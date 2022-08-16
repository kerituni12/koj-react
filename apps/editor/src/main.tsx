import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import App from './app/app';
import { store } from '@koj-react/editor-lib';
import { Provider } from 'react-redux';
ReactDOM.render(
  <Provider store={store}>{<App />}</Provider>,
  document.getElementById('root')
);
