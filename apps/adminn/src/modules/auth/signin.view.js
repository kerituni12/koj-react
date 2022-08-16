import { Col, Layout, Row } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';

import { useMediaQuery } from '@koj-react/hooks';
import { headerHeightPx } from '@/constants/default-value';

import Login from './signin.component';

function LoginContainer() {
  const isNotMobile = useMediaQuery('(min-width: 768px)');
  return (
    <Layout>
      <Header style={{ height: headerHeightPx }}>Header</Header>
      <Content>
        <Row
          style={{
            height: `calc(100vh - ${headerHeightPx}px)`,
            overflow: 'hidden',
          }}
        >
          <Col
            xs={24}
            md={10}
            lg={8}
            style={{
              height: '100%',
            }}
          >
            <Login />;
          </Col>
          {isNotMobile && (
            <Col
              sm={24}
              md={14}
              lg={16}
              style={{ height: '100%', overflow: 'auto' }}
            >
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
              <p>dsfsdf</p>
            </Col>
          )}
        </Row>
      </Content>
    </Layout>
  );
}

export default LoginContainer;
