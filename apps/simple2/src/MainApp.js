import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
const App = lazy(() => import(/* webpackChunkName: "App"  */ './app/app'));

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<h1>loading</h1>}>
      <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
