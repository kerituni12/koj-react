import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const ErrorSystemPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="500"
      title="Hinh nhu xuat hien loi"
      subTitle="hehe"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Go to Home Page
        </Button>
      }
    />
  );
};

export default ErrorSystemPage;
