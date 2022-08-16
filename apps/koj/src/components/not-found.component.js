import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="404"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          404
        </Button>
      }
    ></Result>
  );
};

export default NotFoundPage;
