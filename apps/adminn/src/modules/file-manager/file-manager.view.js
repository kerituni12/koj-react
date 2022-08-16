import {
  headerHeightPx,
  mainContentPaddingPx,
} from '@/constants/default-value';
import { lazy } from 'react';

import KojFileManager from '@koj-react/editor-lib/FileManager/FileManager';

const headerFileManagerPx = 45;
const FileManager = (props) => {
  console.log('render file manager');
  return (
    <KojFileManager
      height={`calc(100vh - ${
        Number(headerHeightPx) +
        Number(mainContentPaddingPx) * 2 +
        Number(headerFileManagerPx)
      }px)`}
    />
  );
};

export default FileManager;
