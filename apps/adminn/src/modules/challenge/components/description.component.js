import { CKEditor } from '@ckeditor/ckeditor5-react';

import { Input, Form, Row, Col, Select } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons/lib/icons';

import KojModal from '../Modal';

import { Editor as ClassicEditor } from '@koj-react/ckeditor';
import { Emitter } from '@koj-react/emitter';
import { html } from '@/utils/format-search';
import { lazy, useEffect, useRef, useState } from 'react';
import { topicTagOptions } from '../configs/topic-tags.config';
import { ckeditorCustomStyle } from '../styles/challenge.style';
import clsx from 'clsx';

let FileManager;

function Description({ ckeditor, description }) {
  const [data, setData] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

  function showModal() {
    setIsModalVisible(true);
  }
  function handleCancel() {
    setIsModalVisible(false);
  }
  function handleData() {
    setData(ckeditor?.current?.getData());
  }
  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  useEffect(() => {
    Emitter.on('open_modal', (image) => showModal());
    Emitter.on('close_modal', (image) => setIsModalVisible(false));
    import(
      /* webpackChunkName: "file-manager.create" */ '@koj-react/editor-lib/FileManager/FileManager'
    ).then((module) => (FileManager = module.default));
    return () => {
      console.log('clear');
    };
  }, []);

  return (
    <div style={{ overflow: 'initial' }}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Tên thử thách"
            name="challengeName"
            required
            rules={[
              {
                required: true,
              },
            ]}
            tooltip="This is a required field"
          >
            <Input placeholder="Challenge name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Tên hàm"
            name="functionName"
            tooltip={{
              title: 'Tooltip with customize icon',
              icon: <InfoCircleOutlined />,
            }}
          >
            <Input placeholder="Function name" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Đối tượng xem"
            name="audience"
            required
            tooltip="This is a required field"
          >
            <Select
            // onChange={handleChange}
            >
              <Select.Option value="onlyme">Only me</Select.Option>
              <Select.Option value="any">Any</Select.Option>
              <Select.Option value="team" disabled>
                Team
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Độ khó"
            name="difficulty"
            tooltip={{
              title: 'Tooltip with customize icon',
              icon: <InfoCircleOutlined />,
            }}
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
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Topic Tags"
            name="topicTags"
            required
            tooltip="This is a required field"
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              onChange={handleChange}
              tokenSeparators={[',']}
              options={topicTagOptions}
              maxTagCount="responsive"
              fieldNames={{ value: 'id', label: 'name' }}
            />
          </Form.Item>
        </Col>
      </Row>
      <div className={clsx('mt-3 wrap-ckeditor', ckeditorCustomStyle)}>
        <CKEditor
          data={description}
          editor={ClassicEditor}
          onReady={(editor) => {
            ckeditor.current = editor;
            // editor.editing.view.change((writer) => {
            //   writer.setStyle(
            //     'height',
            //     '450px',
            //     editor.editing.view.document.getRoot()
            //   );
            // });
          }}
          config={{
            extendConfig: { emitter: Emitter },
          }}
        />

        <KojModal isOpen={isModalVisible} handleCancel={handleCancel}>
          {isModalVisible && <FileManager height={window.innerHeight - 140} />}
        </KojModal>
      </div>
      {/* <Form.Item>
    <Button type="primary">Submit</Button>
  </Form.Item> */}
    </div>
  );
}

export default Description;
