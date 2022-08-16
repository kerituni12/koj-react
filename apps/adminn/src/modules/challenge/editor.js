import Editor from '@monaco-editor/react';

function KojEditor({ height }) {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      theme="vs-dark"
      options={{
        automaticLayout: true,
        scrollBeyondLastLine: false,
        minimap: { enabled: false },
      }}
    />
  );
}

export default KojEditor;
