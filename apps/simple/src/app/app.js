import NxWelcome from './nx-welcome';
import { Button } from 'antd';
import { readFileSync, writeFileSync } from 'fs';
import { useEffect, useState } from 'react';

export function App() {
  const [text, setText] = useState('second');
  const getTextFile = () => {
    writeFileSync('/text.js', `export function hello() { alert('hello'); };`);
    let newText = readFileSync('/text.js', 'utf8');
    console.log('🚀 ~ file: app.js ~ line 11 ~ getTextFile ~ newText', newText);
    // console.log(vol.toJSON());
    setText(newText);
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `   
    async function doimport() {
        const module = await import(moduleData);
        module.hello();
      }
    
      doimport();
    `;
    // script.innerHTML = ' console.log(1) ';

    document.body.appendChild(script);
  };

  useEffect(() => {
    writeFileSync('/text.txt', 'helo em ');
  }, []);

  return (
    <>
      <Button type="primary">Primary Button</Button>

      <NxWelcome title="simple" />
      <Button onClick={getTextFile}>Get text</Button>
      {text}
      <div />
    </>
  );
}
export default App;
