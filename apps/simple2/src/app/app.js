import NxWelcome from './nx-welcome';
import { Button } from 'antd';
export function App() {
  return (
    <>
      <Button type="primary">Primary Button</Button>
      <NxWelcome title="simple" />
      <div />
    </>
  );
}
export default App;
