declare module '@ckeditor/ckeditor5-react' {
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
  import Event from '@ckeditor/ckeditor5-utils/src/eventinfo';
  import { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editorconfig';
  import { Emitter } from '@koj-react/emitter';
  export interface EditorConfigCustom extends EditorConfig {
    extendConfig: { emitter: Emitter };
  }
  import * as React from 'react';
  const CKEditor: React.FunctionComponent<{
    disabled?: boolean;
    editor: typeof ClassicEditor;
    data?: string;
    id?: string;
    config?: EditorConfigCustom;
    className?: string;
    onReady?: (editor: ClassicEditor) => void;
    onChange?: (event: Event, editor: ClassicEditor) => void;
    onBlur?: (event: Event, editor: ClassicEditor) => void;
    onFocus?: (event: Event, editor: ClassicEditor) => void;
    onError?: (event: Event, editor: ClassicEditor) => void;
  }>;
  export { CKEditor };
}
declare module '@koj-react/ui';
declare module '@koj-react/uii';
declare module '@koj-react/editor';
declare module '@koj-react/ckeditor';
declare module '@koj-react/upload';
