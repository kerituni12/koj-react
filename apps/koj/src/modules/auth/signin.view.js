import { Col, Layout, Row } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';

import { useMediaQuery } from '@koj-react/hooks';
import { headerHeightPx } from '@/constants/default-value';

import Login from './signin.component';
import { Slogan } from '@/components/slogan.component';
import loginLogo from '@/assets/images/login-800.png';

function LoginContainer() {
  const isNotMobile = useMediaQuery('(min-width: 768px)');
  return (
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
          style={{
            height: '100%',
            overflow: 'auto',
            background: `url(${loginLogo})`,
            // backgroundSize: 'cover',
            backgroundPositionX: 'center',
          }}
        >
          <Slogan size={30} padding={30}>
            <span>Get your dream with Koj</span>
          </Slogan>
          {/* <img src={loginLogo} /> */}
        </Col>
      )}
    </Row>
  );
}

export default LoginContainer;
