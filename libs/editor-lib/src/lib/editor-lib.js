// import { CKEditor } from '@ckeditor/ckeditor5-react';
import React from 'react';
// import * as ClassicEditor from '../build/index';
import ButtonList from './FileManager/Elements/ButtonGroup';
export function Appp(props) {
  const buttons = [
    {
      name: 'submit',
      icon: 'icon-exit',
      label: 'Save & Quit',
      class: 'green',
      // onClick: () => handleClickButton(false),
    },
    {
      name: 'update',
      icon: 'icon-save',
      label: 'Save as new file',
      class: 'blue',
      // onClick: ()=>handleClickButton(true)
    },
    {
      name: 'submit',
      icon: 'icon-ban',
      label: 'Cancel',
      class: 'red',
      // onClick: ()=>closeCallBack()
    },
  ];
  return (
    <>
      {/* <NxWelcome title="editor" /> */}
      <h1>Ckeditor5 Reactjs</h1>
      {/* <CKEditor className="mt-3 wrap-ckeditor" editor={ClassicEditor} /> */}
      <ButtonList buttons={buttons} />
      <div />
    </>
  );
}

export default Appp;
