import { Col, Layout, Row } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useBreakpoint, useMediaQuery } from '@koj-react/hooks';

// import OTP from "./OTP";
import SignUp from './signup.component';
import { headerHeightPx } from '../../constants/default-value';

function SignUpView() {
  const [email, setEmail] = useState(null);
  const isNotMobile = useMediaQuery('(min-width: 768px)');
  const { isOtpVerify, isRenderLogin } = useSelector((state) => state.auth);

  if (isOtpVerify && !isRenderLogin) return <p>hello </p>; //return <OTP email={email} />;
  return (
    isRenderLogin && (
      <Layout>
        <Header style={{ height: headerHeightPx }}>Header</Header>
        <Content>
          <Row
            style={{
              height: `calc(100vh - ${headerHeightPx}px)`,
              overflow: 'hidden',
            }}
          >
            <Col xs={24} md={10} lg={8} style={{ height: '100%' }}>
              <SignUp setEmail={setEmail} />;
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
    )
  );
}

export default SignUpView;
