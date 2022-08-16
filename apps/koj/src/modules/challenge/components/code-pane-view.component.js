import clsx from 'clsx';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';
import { toast } from 'react-toastify';
import SplitPane from 'react-split-pane';
import Editor from '@monaco-editor/react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Row, Col, Select, Button, Space, Tabs } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';

import '../styles/style.css';

import {
  CheckOutlined,
  CloseOutlined,
  CodeSandboxOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';

import {
  codeEditorStyle,
  tablistStyle,
  testcaseContentForm,
  testCaseItemCreate,
  testcaseTabStyle,
} from '../styles/challenge.style';

import {
  TESTCASE_HEADER_MAX_SIZE_PX,
  TESTCASE_HEADER_MIN_SIZE_PX,
  TESTCASE_HEADER_SIZE_PX,
} from '../configs/constant.config';

import { InnerLoading } from '@/components/loading.component';

import { LoginContext } from '../context/login.context';
import { submitChallengeMutation } from '../graphql/challenge.mutation';

function CodePaneView({ languages, challenge }) {
  const params = useParams();
  const { setIsLoginRequired } = useContext(LoginContext);
  const { id: userId } = useSelector(({ user }) => user.user);
  const { t } = useTranslation(['challenge', 'common']);

  const divRef = useRef(null);
  const fileRef = useRef(null);
  const editorRef = useRef(null);
  const elementRef = useRef(null);

  const [consoleMessage, setConsoleMessage] = useState();
  const [testcases, setTestcases] = useState(challenge.testcases || []);
  const [selectedTestcaseId, setSelectedTestcaseId] = useState(
    testcases?.[0]?.id
  );

  const [activeTabKey, setActiveTabKey] = useState('1');
  const [selectedLanguage, setSelectedLanguage] = useState(languages[1]);
  const [panes, setPanes] = useState(selectedLanguage.files);
  const [selectedFile, setSelectedFile] = useState(selectedLanguage.files[0]);

  const [submitChallengeGql, { loading }] = useMutation(
    submitChallengeMutation
  );

  const runTest = () => {
    if (!userId) {
      setIsLoginRequired(true);
      return;
    }

    try {
      submitChallengeGql({
        variables: {
          data: {
            type: 'run_test',
            slug: params.slug,
            challengeId: Number(challenge.id),
            languageId: selectedLanguage.id,
            functionName: challenge.functionName,
            content: btoa(editorRef.current.getValue()),
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
                (challenge.testcases || []).map((testcase, index) => ({
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
              (challenge.testcases || []).map((testcase, index) => ({
                ...testcase,
                ...(submitChallenge.result[index] || {}),
              }))
            );
          });
        },
      });
    } catch (error) {
      toast.error('Error when submit code');
    }
  };

  const submit = () => {
    if (!userId) {
      setIsLoginRequired(true);
      return;
    }

    try {
      submitChallengeGql({
        variables: {
          data: {
            type: 'run_submit',
            slug: params.slug,
            challengeId: Number(challenge.id),
            languageId: selectedLanguage.id,
            functionName: challenge.functionName,
            content: btoa(editorRef.current.getValue()),
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

  return (
    <>
      {loading && <InnerLoading />}
      {/* {!email && <LoginRequire />} */}
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
          </div>
          <div ref={fileRef} className="selectedFile">
            <Tabs
              type="editable-card"
              size="small"
              className={clsx('tablist-testcase', tablistStyle)}
              hideAdd
            >
              <Tabs.TabPane
                tab={panes[0].name}
                key={panes[0].name}
                tabKey={panes[0].name}
                closable={panes[0].closable}
              />
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
                    size="small"
                    type="primary"
                    shape="round"
                    style={{ marginLeft: 'auto' }}
                    icon={<CodeSandboxOutlined />}
                    onClick={runTest}
                  >
                    {t('run_test')}
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    shape="round"
                    style={{ marginLeft: 'auto' }}
                    // icon={<CodeSandboxOutlined />}
                    onClick={submit}
                  >
                    {t('submit')}
                  </Button>
                </Space>
              }
              className={testcaseTabStyle}
              activeKey={activeTabKey}
              onChange={onTabChange}
            >
              <Tabs.TabPane tab="Test cases" key="1">
                <div className="testcase-panel">
                  <div className="wrap-testcases tab-active">
                    <div
                      className={clsx(
                        'ant-list ant-list-sm ant-list-split testcases',
                        testCaseItemCreate
                      )}
                    >
                      <ul className="ant-list-items">
                        {(testcases || []).map((testcase, index) => (
                          <li
                            key={testcase.id}
                            className={`ant-list-item ${
                              testcase.id === selectedTestcaseId && 'active'
                            }`}
                            onClick={() => setSelectedTestcaseId(testcase.id)}
                          >
                            Test case {index + 1}
                            {typeof testcase.result !== 'undefined' ? (
                              testcase.result ? (
                                <ButtonCustom
                                  size="small"
                                  type="link"
                                  color="success"
                                  icon={<CheckOutlined />}
                                />
                              ) : (
                                <ButtonCustom
                                  size="small"
                                  type="link"
                                  danger
                                  icon={<CloseOutlined />}
                                />
                              )
                            ) : testcase.hidden ? (
                              <ButtonCustom
                                size="small"
                                type="link"
                                icon={<EyeInvisibleOutlined />}
                              />
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="wrap-testcases-content">
                      {(testcases || []).map(
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
                                {testcase.hidden ? (
                                  <Row>
                                    <Col span={24}>{t('hidden_testcase')}</Col>
                                  </Row>
                                ) : (
                                  <>
                                    <Row>
                                      <Col span={8}>{t('input')}:</Col>
                                      <Col span={16}>
                                        {/* {JSON.stringify(testcase.inputs)} */}
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
                                    <Row>
                                      <Col span={8}>
                                        {t('expected_output')}:
                                      </Col>
                                      <Col span={16}>
                                        {testcase.expectedOutput}
                                      </Col>
                                    </Row>
                                    {testcase.output && (
                                      <Row>
                                        <Col span={8}>
                                          {t('actual_output')}:
                                        </Col>
                                        <Col span={16}>{testcase.output}</Col>
                                      </Row>
                                    )}
                                    <Row>
                                      <Col span={8}>{t('limit_time')}:</Col>
                                      <Col span={16}>{testcase.timeout}s</Col>
                                    </Row>
                                    {testcase.time && (
                                      <Row>
                                        <Col span={8}>
                                          {t('executed_time')}:
                                        </Col>
                                        <Col span={16}>
                                          {Number.parseFloat(
                                            testcase.time / 1000
                                          ).toFixed(3)}
                                          s
                                        </Col>
                                      </Row>
                                    )}
                                    {testcase.message && (
                                      <Row>
                                        <Col span={8}>{t('state')}:</Col>
                                        <Col span={16}>
                                          {t(testcase.message)}
                                        </Col>
                                      </Row>
                                    )}
                                    {testcase.errorMessage && (
                                      <Row>
                                        <Col span={8}>
                                          {t('title.error', { ns: 'common' })}:
                                        </Col>
                                        <Col span={16}>
                                          {testcase.errorMessage}
                                        </Col>
                                      </Row>
                                    )}
                                    {testcase.log && (
                                      <Row>
                                        <Col span={8}>
                                          {t('title.log', { ns: 'common' })}:
                                        </Col>
                                        <Col span={16}>{testcase.log}</Col>
                                      </Row>
                                    )}
                                  </>
                                )}
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
    </>
  );
}

const ButtonCustom = styled(Button)`
  color: var(--ant-${(props) => props.color}-color);
`;

export default CodePaneView;
