import { headerHeightPx } from '@/constants/default-value';
import { css } from '@emotion/css';

export const testCaseItemCreate = css`
  & .ant-list-item {
    background: #1d2631;
    color: #fff;
    padding: 8px;
  }
`;

export const testCaseViewItem = css`
  & .ant-list-item {
    justify-content: space-around;
    background: #1d2631;
    color: #fff;
    padding: 8px;
    &.active {
      background: #0f1112d9;
    }
  }
`;

const tabHeaderPx = 46;
const tabMarginBottomPx = 16;
const occupied = +headerHeightPx + tabHeaderPx + tabMarginBottomPx;
export const tabPaneStyle = css`
  padding: 0 10px 10px 10px;
  height: calc(100vh - ${occupied}px);
`;

export const tabPaneHeaderStyle = css`
  margin-top: 16px;
  padding-top: 80px;
  text-align: center;
  background-color: #fafafa;
  border: 1px dashed #e9e9e9;
  border-radius: 2px;
`;

export const challengeStyle = css`
  & .ant-row .ant-form-item {
    margin-bottom: 13px;
  }
`;

export const testcaseInputsStyle = css`
  & .ant-col .ant-row .ant-form-item:last-child {
    margin-bottom: 0px;
  }
`;

export const tablistStyle = css`
  background-color: #1d2631;
`;

export const codeEditorStyle = css`
  padding-top: 10px;
`;

export const testcaseContentForm = css`
  // & .ant-row .ant-col.ant-col-8:after {
  //   content: ':';
  //   right: 0;
  //   position: absolute;
  // }
  & .ant-row .ant-col {
    padding: 0 5px;
  }
`;

export const ckeditorCustomStyle = css`
  & .ck.ck-editor__main {
    padding-bottom: 20px;
  }
`;

export const testcaseTabStyle = css`
  height: 100%;
  & .ant-tabs-tab {
    color: #8590a3;
  }
  &.ant-tabs > .ant-tabs-nav {
    margin: 0;
    height: 40px;
    padding: 0 10px;
  }
  & .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #fff;
  }
  &.ant-tabs-top > .ant-tabs-nav::before {
    border-bottom: none;
  }
  & > .ant-tabs-nav .ant-tabs-nav-wrap {
    text-transform: uppercase;
    font-weight: bold;
  }
  & .ant-tabs-content.ant-tabs-content-top {
    height: 100%;
  }
  & .testcase-panel {
    height: 100%;
  }
  & .console-message {
    background-color: #1d2631;
    color: #fff;
    height: 100%;
    overflow: auto;
    padding: 10px;
  }
`;
