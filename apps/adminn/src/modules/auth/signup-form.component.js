import { Button, Form, Input } from 'antd';

export function SignupForm({ onFinished }) {
  return (
    <Form
      onFinish={onFinished}
      className="login-page-form"
      // initialValues={initialValues}
      layout="vertical"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Email is required' }]}
      >
        <Input placeholder="abc@gmail.com" />
      </Form.Item>
      <Form.Item
        label="User Name"
        name="username"
        style={{ marginBottom: 0 }}
        rules={[{ required: true }]}
      >
        <Form.Item
          name="firstname"
          rules={[{ required: true }]}
          style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
        >
          <Input placeholder="first name" />
        </Form.Item>
        <Form.Item
          name="lastname"
          rules={[{ required: true }]}
          style={{
            display: 'inline-block',
            width: 'calc(50% - 8px)',
            marginLeft: '16px',
          }}
        >
          <Input placeholder="last name" />
        </Form.Item>
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Password is required！' }]}
      >
        <Input type="password" placeholder="password" />
      </Form.Item>
      <Button htmlType="submit" block type="primary" className="login-button">
        Sign Up
      </Button>
    </Form>
  );
}
