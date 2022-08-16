import { lazy, Suspense } from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { Spin } from 'antd';
import './index.css';
import { ApolloProvider } from '@apollo/client';
import { client } from './services/apollo-client';
import { PersistGate } from 'redux-persist/integration/react';
import App from './modules/app/app';
// const App = lazy(() =>
//   import(/* webpackChunkName: "App"  */ './modules/app/app')
// );

ReactDOM.render(
  <Provider store={store}>
    <PersistGate
      loading={
        <div className="center-screen">
          <Spin size="large" />
        </div>
      }
      persistor={store.persistor}
    >
      <ApolloProvider client={client}>
        <Suspense
          fallback={
            <div className="center-screen">
              <Spin size="large" />
            </div>
          }
        >
          <App />
        </Suspense>
      </ApolloProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
