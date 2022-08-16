import {
  themeColorStorageKey,
  isMultiTheme,
  defaultColor,
} from '@/constants/default-value';

import '@koj-react/ui/style/perfect-scrollbar.css';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.variable.min.css';

const color =
  (isMultiTheme && localStorage.getItem(themeColorStorageKey)) || defaultColor;

localStorage.setItem(themeColorStorageKey, color);

import(/* webpackChunkName: "theme" */ './styles/themes/' + color + '.less');
import(/* webpackChunkName: "mainapp" */ './main');
