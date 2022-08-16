import './hello-lib.module.css';
import { Emitter } from '@koj-react/emitter';
import { useEffect } from 'react';
export function HelloLib(props) {
  useEffect(() => {
    Emitter.on('INPUT_FROM_MAIN', (image) => console.log('emitter hello'));
    return () => {
      console.log();
    };
  }, []);
  return (
    <div>
      <h1>Welcome to HelloLib!</h1>
    </div>
  );
}
export default HelloLib;
