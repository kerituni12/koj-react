import {
  themeColorStorageKey,
  isMultiTheme,
  defaultColor,
} from './constants/defaultValue';
function a() {}
const color =
  (isMultiTheme && localStorage.getItem(themeColorStorageKey)) || defaultColor;

localStorage.setItem(themeColorStorageKey, color);

import('./assets/themes/' + color + '.css');
import('./MainApp');
