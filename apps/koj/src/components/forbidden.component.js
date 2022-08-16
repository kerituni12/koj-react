import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="Forbidden"
      subTitle="Sorry you don't have permission"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Go to Home Page
        </Button>
      }
    ></Result>
  );
};

export default Forbidden;
