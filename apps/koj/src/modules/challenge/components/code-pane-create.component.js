import SplitPane from 'react-split-pane';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import {
  Row,
  Col,
  Select,
  Button,
  Form,
  Drawer,
  Space,
  Input,
  InputNumber,
  Tabs,
  Dropdown,
  Menu,
  Typography,
  Spin,
  Switch,
} from 'antd';
import {
  CodeSandboxOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import { List } from 'antd';
import clsx from 'clsx';
import {
  codeEditorStyle,
  tablistStyle,
  testcaseContentForm,
  testcaseInputsStyle,
  testCaseItemCreate,
  testcaseTabStyle,
} from '../styles/challenge.style';
import Editor, { useMonaco } from '@monaco-editor/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import defaultTabFiles from '../configs/file.config';
import { toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import { css } from '@emotion/css';
import {
  TESTCASE_HEADER_MAX_SIZE_PX,
  TESTCASE_HEADER_MIN_SIZE_PX,
  TESTCASE_HEADER_SIZE_PX,
} from '../configs/constant.config';
import { dashesCase } from '@/utils/string';
import { useMutation } from '@apollo/client';
import {
  addChallengeMutation,
  editChallengeMutation,
  submitChallengeMutation,
} from '../graphql/challenge.mutation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { isEditPage, sortInputDesc } from '@/utils/common';
import { defaultLanguages } from '../configs/languages.config';
import { paramTypeOptions } from '../configs/input-type.config';
import { useBasePath } from '@/hooks/use-basepath';
import { useTranslation } from 'react-i18next';

const testcases = [
  { id: 1, inputs: [1, 2, 3, 4, 5], output: [1, 2, 3, 4, 5], timeout: 4000 },
  { id: 2, inputs: [1, 2, 3, 4, 5], output: [1, 2, 3, 4, 5], timeout: 4000 },
  { id: 3, inputs: [1, 2, 3, 4, 5], output: [1, 2, 3, 4, 5], timeout: 4000 },
  { id: 4, inputs: [1, 2, 3, 4, 5], output: [1, 2, 3, 4, 5], timeout: 4000 },
  { id: 5, inputs: [1, 2, 3, 4, 5], output: [1, 2, 3, 4, 5], timeout: 4000 },
  { id: 6, inputs: [1, 2, 3, 4, 5], output: [1, 2, 3, 4, 5], timeout: 4000 },
];

const getNewState = (prevState, event, value) => {
  let newState = { ...prevState };
  switch (event) {
    case 'clicked':
      if (!prevState.clickedPrevState) {
        newState.isVisable = true;
        newState.clickedPrevState = true; // used by next getNewState to determine if it was a click on input
      } else {
        newState.isVisable = false;
        newState.clickedPrevState = false;
      }
      break;
    case 'change':
      // if (prevState.clickedPrevState) {
      //   newState.isVisable = true;
      // }
      break;
    default:
      newState.isVisable = false;
  }
  return newState;
};

function MenuDropDown({ addFile, setVisibleDropdown }) {
  const [fileName, setFileName] = useState('');
  const onChange = (event) => setFileName(dashesCase(event.target.value));
  return (
    <Space>
      <Input
        value={fileName}
        placeholder="file name without extension"
        onChange={onChange}
        maxLength={20}
      />
      <Typography.Link
        onClick={() => {
          if (fileName === '') {
            toast.error('file name not valid', { toastId: 'addfile' });
            return;
          }
          addFile(fileName);
          setVisibleDropdown({ isVisable: false });
          setFileName('');
        }}
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        <PlusOutlined /> Add item
      </Typography.Link>
    </Space>
  );
}

function CodePane({
  form,
  ckeditor,
  languages,
  setLanguages,
  challenge,
  customType,
}) {
  console.log('code editor re-render');
  const monaco = useMonaco();
  const params = useParams();
  const basePath = useBasePath('slug');
  const navigate = useNavigate();

  const { t } = useTranslation();
  const divRef = useRef(null);
  const fileRef = useRef(null);
  const editorRef = useRef(null);
  const elementRef = useRef(null);

  const [testcaseForm] = Form.useForm();
  const inputs = Form.useWatch('inputs', form);
  const output = Form.useWatch('output', form);
  const structs = Form.useWatch('structs', form);
  const functionName = Form.useWatch('functionName', form);

  const [consoleMessage, setConsoleMessage] = useState();
  const [activeTabKey, setActiveTabKey] = useState('1');

  const [testcases, setTestcases] = useState(challenge?.testcases || []);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [selectedTestcaseId, setSelectedTestcaseId] = useState(
    testcases[0]?.id
  );

  const [selectedLanguage, setSelectedLanguage] = useState(languages[1]);
  const [selectedFile, setSelectedFile] = useState(selectedLanguage.files[0]);

  const [panes, setPanes] = useState(selectedLanguage.files);
  const [activeKey, setActiveKey] = useState(selectedFile.name);
  const [visibleDropdown, setVisibleDropdown] = useState({ isVisable: false });
  const [editingTestCaseFromCreate, setEditingTestCaseFromCreate] =
    useState(true);
  const [editingTestcaseKey, setEditingTestcaseKey] = useState();

  const [addChallengeGql] = useMutation(addChallengeMutation, {
    ignoreResults: true,
  });
  const [editChallengeGql] = useMutation(editChallengeMutation, {
    ignoreResults: true,
  });
  const [submitChallengeGql, { loading }] = useMutation(
    submitChallengeMutation
  );

  const runTest = () => {
    try {
      submitChallengeGql({
        variables: {
          data: {
            slug: params.slug,
            languageId: selectedLanguage.id,
            functionName: challenge.functionName,
            content: editorRef.current.getValue(),
          },
        },
        onCompleted({ challenge: { submitChallenge } }) {
          if (submitChallenge.error) {
            ReactDOM.unstable_batchedUpdates(() => {
              setConsoleMessage({
                type: 'error',
                message: submitChallenge.error,
              });
              setActiveTabKey('2');
              setTestcases(
                testcases.map((testcase, index) => ({
                  ...testcase,
                  result: false,
                }))
              );
            });
            return;
          }

          ReactDOM.unstable_batchedUpdates(() => {
            setActiveTabKey('1');
            setTestcases(
              testcases.map((testcase, index) => ({
                ...testcase,
                ...submitChallenge.result[index],
              }))
            );
          });
        },
      });
    } catch (error) {
      toast.error('Error when submit code');
    }
  };

  const onTabChange = (newActiveKey) => {
    setActiveTabKey(newActiveKey);
  };

  const submittest = () => {
    console.log(form.getFieldsValue());
    return;
  };
  const submit = async () => {
    console.log(form.getFieldsValue());
    // return;
    const modelDataMap = new Map();
    const models = monaco.editor.getModels();
    models.forEach((model) => {
      const file = model.uri.path.split('/')[1];
      modelDataMap.set(file, {
        file,
        content: model.getValue(),
      });
    });

    const {
      challengeName,
      functionName,
      difficulty,
      topicTags,
      output,
      inputs,
      structs,
    } = form.getFieldsValue();

    const description = ckeditor.current?.getData();
    const categoryId = 1;

    const mutationData = {
      difficulty,
      categoryId,
      description,
      title: challengeName,
    };

    mutationData.functionName = functionName || 'solution';
    mutationData.inputs = inputs || challenge.inputs;
    mutationData.structs = structs || challenge?.structs || [];
    mutationData.output = output || challenge.output;

    if (customType) {
      // const types = customType.map((type) => type.value);
      mutationData.types = customType;
    }
    if (testcases.length !== 0) {
      const testcases$ = testcases.map((testcase) => {
        const expectedOutput =
          mutationData.output === 'STRING'
            ? testcase.expectedOutput
            : JSON.stringify(eval('(' + testcase.expectedOutput + ')'));
        return {
          ...testcase,
          expectedOutput,
        };
      });
      mutationData.testcases = testcases$;
    }
    if (topicTags) {
      mutationData.topicTags = {
        connect: topicTags.map((tag) => ({ id: tag })),
      };
    }
    if (languages?.length) {
      const solutions = [];
      const languages$ = [];
      languages.forEach(
        ({ id, timeout, description, files, genPlaceholder }) => {
          const language = { id, timeout, description };
          files.forEach((f) => {
            const file = { ...f };
            if (file.type === 'main') {
              if (modelDataMap.has(file.name)) {
                language.placeholder = modelDataMap.get(file.name).content;
              } else {
                const inputs$ = Object.assign(
                  [],
                  inputs || challenge?.inputs || []
                );

                language.placeholder = genPlaceholder({
                  functionName,
                  inputs: inputs$,
                  output: output || challenge?.output,
                  structs: structs || challenge?.structs,
                });
              }
              languages$.push(language);
              return;
            }

            // Solution
            file.languageId = id;
            if (modelDataMap.has(file.name)) {
              file.content = modelDataMap.get(file.name).content;
            }
            solutions.push(file);
          });
        }
      );
      mutationData.solutions = solutions;
      mutationData.languages = languages$;
    }
    try {
      if (!isEditPage(basePath)) {
        await addChallengeGql({
          variables: { data: mutationData },
          onCompleted({ challenge }) {
            navigate(`../edit/${challenge.createChallenge.slug}`, {
              state: { challenge: { id: challenge.createChallenge.id } },
            });
            toast.success('Add challenge success', {
              toastId: 'addChallengeSuccess',
            });
          },
        });
        return;
      }
      if (params.slug) {
        const where = { slug: params.slug };
        await editChallengeGql({
          variables: { data: mutationData, where },
          onCompleted() {
            toast.success('Edit challenge success', {
              toastId: 'editChallengeSuccess',
            });
          },
          ignoreResults: true,
          onQueryUpdated() {
            return false;
          },
        });
      }
    } catch (error) {
      toast.error(error.message, { toastId: 'challengeSubmit' });
    }
  };

  const addFile = (fileName) => {
    const newActiveKey = `${fileName}.${selectedLanguage.extension}`;
    const fileIndex = panes.findIndex((pane) => pane.name === newActiveKey);
    if (fileIndex > -1) {
      toast.error('file exist');
      return;
    }
    const newFile = {
      content: '',
      type: 'solution',
      key: newActiveKey,
      name: newActiveKey,
    };
    const newPanes = [...panes, newFile];
    setPanes(newPanes);
    setActiveKey(newActiveKey);
    setSelectedFile(newFile);
    const newLanguages = [...languages];
    newLanguages.forEach((language) => {
      if (language.id === selectedLanguage.id) {
        language.files.push(newFile);
      }
    });
    setLanguages(newLanguages);
  };

  const removeFile = (targetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    panes.forEach((pane, i) => {
      if (pane.name === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter((pane) => pane.name !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].name;
      } else {
        newActiveKey = newPanes[0].name;
      }
    }

    setPanes(newPanes);
    setActiveKey(newActiveKey);
    setSelectedFile(newPanes[newPanes.length - 1]);
    const newLanguages = languages.filter(
      (language) => language.id !== selectedLanguage.id
    );
    setLanguages(newLanguages);
    monaco.editor.getModel(monaco.Uri.file(`/${targetKey}`)).dispose();
    console.log(monaco.editor.getModels());
  };

  const onEditTabs = (targetKey, action) => {
    if (action === 'add') {
      addFile();
    } else {
      removeFile(targetKey);
    }
  };

  const onChange = (newActiveKey) => {
    setActiveKey(newActiveKey);
    setSelectedFile(panes.find((file) => file.name === newActiveKey));
  };

  const menu = (
    <Menu
      items={[
        {
          label: (
            <MenuDropDown
              addFile={addFile}
              setVisibleDropdown={setVisibleDropdown}
            />
          ),
          key: '0',
        },
      ]}
    />
  );

  useEffect(() => {
    console.log('useEffect - filenamechange');

    editorRef.current?.focus();
  }, [selectedFile.name]);

  function handleChange(value) {
    const newSelectedLanguage = languages.find(
      (language) => language.id === value
    );
    let currentIndexFile = selectedLanguage.files.findIndex(
      (file) => file.name === selectedFile.name
    );
    if (currentIndexFile < 0) currentIndexFile = 0;
    setSelectedLanguage(newSelectedLanguage);
    setSelectedFile(newSelectedLanguage.files[currentIndexFile]);
    setPanes(newSelectedLanguage.files);
    setActiveKey(newSelectedLanguage.files[currentIndexFile].name);
  }

  useEffect(() => {
    // setHeight(elementRef.current.clientHeight);
    if (divRef.current?.parentElement) {
      const divHeight =
        divRef.current.parentElement.clientHeight -
        elementRef.current.clientHeight -
        fileRef.current.clientHeight;
      divRef.current.style.height = divHeight + 'px';
    }

    window.addEventListener('resize', () => {
      if (divRef?.current?.parentElement) {
        const divHeight =
          divRef.current.parentElement.clientHeight -
          elementRef.current.clientHeight -
          fileRef.current.clientHeight;
        divRef.current.style.height = divHeight + 'px';
      }
    });

    return () => {
      window.removeEventListener('resize', null);
    };
  }, []);

  useEffect(() => {
    console.log('useEffect - inputs, function name');

    if (editorRef.current && selectedFile.type === 'main') {
      const inputs$ = Object.assign([], inputs || challenge?.inputs || []);
      const placeholder = selectedLanguage.genPlaceholder({
        functionName,
        inputs: inputs$,
        output: output || challenge?.output,
        structs: structs || challenge?.structs,
      });
      const model = editorRef.current.getModel();
      editorRef.current?.setValue(placeholder);
      model.forceTokenization(model.getLineCount());
    }
  }, [inputs, functionName, output, structs, selectedLanguage, selectedFile]);

  return (
    <>
      <SplitPane
        split="horizontal"
        style={{ backgroundColor: '#1e1e1e' }}
        defaultSize={TESTCASE_HEADER_SIZE_PX}
        maxSize={TESTCASE_HEADER_MAX_SIZE_PX}
        minSize={TESTCASE_HEADER_MIN_SIZE_PX}
        primary="second"
        onChange={(newSize) => {
          const divHeight =
            divRef.current.parentElement.clientHeight -
            elementRef.current.clientHeight -
            fileRef.current.clientHeight;
          divRef.current.style.height = divHeight + 'px';
        }}
      >
        <div ref={divRef}>
          <div
            ref={elementRef}
            style={{
              display: 'flex',
              padding: 10,
              backgroundColor: '#1d2631',
              alignItems: 'center',
            }}
          >
            <Select
              size="small"
              defaultValue={selectedLanguage.id}
              style={{ width: 120, height: '100%' }}
              onChange={handleChange}
              options={languages}
              fieldNames={{ value: 'id', label: 'name' }}
            />
            {!isEditPage(basePath) ? (
              <Button
                size="small"
                shape="round"
                type="primary"
                style={{ marginLeft: 'auto' }}
                icon={<PlusOutlined />}
                onClick={submit}
              >
                {t('create')}
              </Button>
            ) : (
              <Button
                size="small"
                shape="round"
                type="primary"
                style={{ marginLeft: 'auto' }}
                icon={<EditOutlined />}
                onClick={submit}
              >
                {t('edit')}
              </Button>
            )}
          </div>
          <div ref={fileRef} className="selectedFile">
            {/* <button
              disabled={fileName === `main`}
              onClick={() => setFileName('main')}
            >
              {`main.${selectedLanguage.extension}`}
            </button>
            <button
              disabled={fileName === `solution`}
              onClick={() => setFileName('solution')}
            >
              {`solution.${selectedLanguage.extension}`}
            </button> */}
            <Tabs
              type="editable-card"
              onChange={onChange}
              activeKey={activeKey}
              onEdit={onEditTabs}
              size="small"
              className={clsx('tablist-testcase', tablistStyle)}
              hideAdd
              tabBarExtraContent={
                <Dropdown
                  visible={visibleDropdown.isVisable}
                  // placement="bottomRight"
                  overlay={menu}
                  trigger={['click']}
                  onClick={(e) =>
                    setVisibleDropdown((prevstate) => {
                      return getNewState(prevstate, 'clicked');
                    })
                  }
                >
                  <Button
                    size="small"
                    type="primary"
                    shape="circle"
                    style={{ marginRight: 10 }}
                  >
                    <PlusOutlined />
                  </Button>
                </Dropdown>
              }
            >
              {panes.map((pane) => (
                <Tabs.TabPane
                  tab={pane.name}
                  key={pane.name}
                  tabKey={pane.name}
                  closable={pane.closable}
                />
              ))}
            </Tabs>
          </div>
          <Editor
            height="100%"
            className={codeEditorStyle}
            path={selectedFile.name}
            defaultLanguage={selectedLanguage.type}
            defaultValue={selectedFile.content}
            theme="vs-dark"
            options={{
              readOnly: selectedFile.type === 'main',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              minimap: { enabled: false },
              fontSize: 12,
            }}
            onMount={(editor) => (editorRef.current = editor)}
          />
        </div>

        <div style={{ zIndex: 1, display: 'block', width: '100%' }}>
          <div className="testcase-header">
            <Tabs
              tabBarExtraContent={
                <Space size="small">
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setIsOpenDrawer(true);
                      setEditingTestCaseFromCreate(true);
                    }}
                    style={{ padding: '0 5px', color: '#fff' }}
                  >
                    Thêm mới
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    shape="round"
                    style={{ marginLeft: 'auto' }}
                    icon={<CodeSandboxOutlined />}
                  >
                    Run test
                  </Button>
                </Space>
              }
              className={testcaseTabStyle}
              activeKey={activeTabKey}
              onChange={onTabChange}
            >
              <Tabs.TabPane tab="Test case" key="1">
                <div className="testcase-panel">
                  <div className="wrap-testcases tab-active">
                    <div
                      className={clsx(
                        'ant-list ant-list-sm ant-list-split testcases',
                        testCaseItemCreate
                      )}
                    >
                      <ul className="ant-list-items">
                        {testcases.map((testcase, index) => (
                          <li
                            key={testcase.id}
                            className="ant-list-item"
                            onClick={() => setSelectedTestcaseId(testcase.id)}
                          >
                            Test case {index + 1}
                            <Space size={2}>
                              <Button
                                size="small"
                                type="link"
                                style={{ marginLeft: 'auto' }}
                                icon={<EditOutlined />}
                                onClick={() => {
                                  setIsOpenDrawer(true);
                                  setEditingTestCaseFromCreate(false);
                                  setEditingTestcaseKey(testcase.id);
                                  const currentTestcase = Object.assign(
                                    {},
                                    testcases.find(
                                      (testcase$) =>
                                        testcase$.id === testcase.id
                                    )
                                  );

                                  const inputKeys = inputs || challenge.inputs;
                                  const inputs$ = currentTestcase.inputs.map(
                                    (input, index) => ({
                                      key: inputKeys[index].name,
                                      value:
                                        inputKeys[index].type === 'STRING'
                                          ? input.value
                                          : JSON.stringify(input.value),
                                    })
                                  );
                                  currentTestcase.inputs = inputs$;
                                  console.log(currentTestcase.expectedOutput);
                                  challenge.output === 'STRING' &&
                                    (currentTestcase.expectedOutput =
                                      JSON.parse(
                                        currentTestcase.expectedOutput
                                      ));
                                  testcaseForm.setFieldsValue(currentTestcase);
                                }}
                              />

                              <Button
                                size="small"
                                type="text"
                                danger
                                style={{ marginLeft: 'auto' }}
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                  setTestcases(
                                    testcases.filter(
                                      (testcase$) =>
                                        testcase$.id !== testcase.id
                                    )
                                  );
                                }}
                              />
                            </Space>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="wrap-testcases-content">
                      {testcases.map(
                        (testcase) =>
                          testcase.id === selectedTestcaseId && (
                            <div
                              key={`kiem-thu-${testcase.id}`}
                              className="testcase-content"
                            >
                              <div
                                className={clsx(
                                  'form-horizontal',
                                  testcaseContentForm
                                )}
                              >
                                <Row>
                                  <Col span={8}>Đầu vào:</Col>
                                  <Col span={16}>
                                    <Row>
                                      {testcase.inputs.map((input) => {
                                        return (
                                          <React.Fragment key={input.key}>
                                            <Col span={8}>{input.key}</Col>
                                            <Col span={16}>
                                              {JSON.stringify(input.value)}
                                            </Col>
                                          </React.Fragment>
                                        );
                                      })}
                                    </Row>
                                  </Col>
                                </Row>
                                {testcase.output && (
                                  <Row>
                                    <Col span={8}>Đầu ra thực tế:</Col>
                                    <Col span={16}>{testcase.output}</Col>
                                  </Row>
                                )}
                                <Row>
                                  <Col span={8}>Đầu ra mong muốn:</Col>
                                  <Col span={16}>{testcase.expectedOutput}</Col>
                                </Row>
                                <Row>
                                  <Col span={8}>Giới hạn thời gian:</Col>
                                  <Col span={16}>{testcase.timeout} ms</Col>
                                </Row>
                                <Row>
                                  <Col span={8}>Thời gian thực hiện:</Col>
                                  <Col span={16}></Col>
                                </Row>
                                <Row>
                                  <Col span={8}>Tin nhắn:</Col>
                                  <Col span={16}>
                                    <div id="txtRunContentMesseger_0"></div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col span={8}>Mô tả:</Col>
                                  <Col span={16}></Col>
                                </Row>
                              </div>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                  <div className="wrap-main-console"></div>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Console" key="2">
                <div className="console-message">
                  {consoleMessage?.type === 'error' && consoleMessage.message}
                </div>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </SplitPane>
      {isOpenDrawer && (
        <Drawer
          placement="right"
          onClose={() => {
            testcaseForm.resetFields();
            setIsOpenDrawer(false);
          }}
          visible={isOpenDrawer}
          getContainer={false}
          style={{ position: 'absolute' }}
          extra={
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  //   testcaseForm.resetFields();
                  //   setIsOpenDrawer(false);
                  console.log(testcaseForm.getFieldsValue());
                  console.log(testcaseForm);
                }}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                onClick={() => {
                  if (editingTestCaseFromCreate) {
                    testcaseForm
                      .validateFields()
                      .then((data) => {
                        const id = nanoid();
                        const inputs = (data.inputs || []).map((input) => ({
                          key: input.key,
                          value:
                            input.type === 'STRING'
                              ? input.value
                              : eval('(' + input.value + ')'),
                        }));

                        data.id = id;
                        data.inputs = inputs;
                        data.timeout =
                          selectedLanguage.timeout + Number(data.extraTimeout);

                        challenge.output === 'STRING' &&
                          (data.expectedOutput = JSON.stringify(
                            data.expectedOutput
                          ));

                        ReactDOM.unstable_batchedUpdates(() => {
                          setTestcases([...testcases, data]);
                          setSelectedTestcaseId(id);
                          setIsOpenDrawer(false);
                          testcaseForm.resetFields();
                        });
                      })
                      .catch((error) => console.log(error));
                  } else {
                    testcaseForm
                      .validateFields()
                      .then((data) => {
                        const newTestcases = [...testcases];
                        const index = newTestcases.findIndex(
                          (testcase) => testcase.id === editingTestcaseKey
                        );
                        const inputs = (data.inputs || []).map((input) => ({
                          key: input.key,
                          value:
                            input.type === 'STRING'
                              ? input.value
                              : eval('(' + input.value + ')'),
                        }));

                        data.inputs = inputs;
                        data.id = editingTestcaseKey;
                        data.timeout =
                          selectedLanguage.timeout + Number(data.extraTimeout);

                        challenge.output === 'STRING' &&
                          (data.expectedOutput = JSON.stringify(
                            data.expectedOutput
                          ));

                        newTestcases[index] = data;

                        ReactDOM.unstable_batchedUpdates(() => {
                          setTestcases(newTestcases);
                          setIsOpenDrawer(false);
                          testcaseForm.resetFields();
                        });
                      })
                      .catch((error) => console.log(error));
                  }
                }}
              >
                Submit
              </Button>
            </Space>
          }
        >
          <Form form={testcaseForm} name="testcases" layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Time"
                  name="timeoutComplexity"
                  tooltip={{
                    title: 'Tooltip with customize icon',
                    icon: <InfoCircleOutlined />,
                  }}
                  initialValue="on"
                >
                  <Select
                  // onChange={handleChange}
                  >
                    <Select.Option value="o1">O(1)</Select.Option>
                    <Select.Option value="ologn">O(log N)</Select.Option>
                    <Select.Option value="on">O(N)</Select.Option>
                    <Select.Option value="onlogn">O(N log N)</Select.Option>
                    <Select.Option value="on2">O(N^2)</Select.Option>
                    <Select.Option value="on3">O(N^3)</Select.Option>
                    <Select.Option value="o2n">O(2^N)</Select.Option>
                    <Select.Option value="on!">O(N!)</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Space"
                  name="spaceComplexity"
                  tooltip={{
                    title: 'Tooltip with customize icon',
                    icon: <InfoCircleOutlined />,
                  }}
                  initialValue="o1"
                >
                  <Select
                  // onChange={handleChange}
                  >
                    <Select.Option value="o1">O(1)</Select.Option>
                    <Select.Option value="ologn">O(log N)</Select.Option>
                    <Select.Option value="on">O(N)</Select.Option>
                    <Select.Option value="onlogn">O(N log N)</Select.Option>
                    <Select.Option value="on2">O(N^2)</Select.Option>
                    <Select.Option value="on3">O(N^3)</Select.Option>
                    <Select.Option value="o2n">O(2^N)</Select.Option>
                    <Select.Option value="on!">O(N!)</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Inputs" required style={{ marginBottom: 0 }}>
                  {(inputs || challenge.inputs || [])
                    // .sort(sortInputDesc)
                    .map((input, index) => (
                      <Row gutter={16} align="center" key={index}>
                        <Col span={18}>
                          <Form.Item
                            name={['inputs', index, 'value']}
                            rules={[
                              {
                                required: true,
                                message: 'please give the input',
                              },
                            ]}
                          >
                            <Input.TextArea rows={1} placeholder="Input" />
                          </Form.Item>
                          <Form.Item
                            noStyle
                            name={['inputs', index, 'key']}
                            hidden
                            initialValue={input.name}
                          >
                            <Input rows={1} placeholder="Input" />
                          </Form.Item>
                          <Form.Item
                            noStyle
                            name={['inputs', index, 'type']}
                            hidden
                            initialValue={input.type}
                          >
                            <Input rows={1} placeholder="Input" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>{input.name}</Col>
                      </Row>
                    ))}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="expectedOutput"
                  label="Output"
                  rules={[
                    {
                      required: true,
                      message: 'please give the ouput',
                    },
                  ]}
                  //   initialValue=""
                >
                  <Input.TextArea rows={1} placeholder="Expected Output" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={18}>
                <Form.Item
                  label="Độ khó"
                  name="difficulty"
                  tooltip={{
                    title: 'Tooltip with customize icon',
                    icon: <InfoCircleOutlined />,
                  }}
                  initialValue="easy"
                >
                  <Select
                  // onChange={handleChange}
                  >
                    <Select.Option value="easy">Easy</Select.Option>
                    <Select.Option value="medium">medium</Select.Option>
                    <Select.Option value="hard" disabled>
                      Hard
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Hidden"
                  name="hidden"
                  tooltip={{
                    title: 'Tooltip with customize icon',
                    icon: <InfoCircleOutlined />,
                  }}
                  initialValue={false}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="score" label="Score" initialValue={100}>
                  <InputNumber
                    min={0}
                    max={1000}
                    style={{ width: '100%' }}
                    type="number"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="extraTimeout"
                  label="Extra Timeout"
                  initialValue={0}
                  tooltip={{
                    title:
                      '-1, 1, -0.5, 0.5, ... Using negative number to decrease default timeout',
                    icon: <InfoCircleOutlined />,
                  }}
                >
                  <InputNumber
                    min={-2}
                    max={2}
                    style={{ width: '100%' }}
                    type="number"
                    placeholder="-1, 1, -0.5, 0.5,..."
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="description" label="Description">
                  <Input.TextArea
                    rows={4}
                    placeholder="please enter url description"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
      )}
    </>
  );
}

export default CodePane;
