import { Result } from 'antd';

const NetworkErrorPage = () => {
  return (
    <Result
      status="500"
      title="Network error"
      subTitle="You have some issue with your network"
    ></Result>
  );
};

export default NetworkErrorPage;
