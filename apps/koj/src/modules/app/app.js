import RenderRouter from '@/routes';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './app.css';

export function App() {
  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL || '/'}>
        <RenderRouter />
        <ToastContainer autoClose={2000} />
      </BrowserRouter>
    </>
  );
}

export default App;
