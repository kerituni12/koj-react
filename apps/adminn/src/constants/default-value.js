/**
 * THEME
 */
export const themeColorStorageKey =
  process.env.THEME_COLOR_STORAGE_KEY || 'theme';
export const isMultiTheme = process.env.MULTI_THEME || true;
export const defaultColor = process.env.DEFAULT_COLOR || 'light.orange';
export const defaultDirection = process.env.DEFAULT_DIRECTION || 'ltr';

/**
 * CSS
 */
export const headerHeightPx = '48';
export const mainContentPaddingPx = '20';

/**
 * DEFAULT CONFIG
 */
export const BASE_API_PREFIX =
  process.env.REACT_APP_PUBLIC_BASE_API_PREFIX || 'api';
export const BASE_API_URL =
  process.env.REACT_APP_PUBLIC_BASE_API_URL || 'http://sub.koj.test';
export const ACCESS_PAYLOAD_KEY = 'x-access-payload';
export const REFRESH_PAYLOAD_KEY = 'x-refresh-payload';
