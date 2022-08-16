import React, { Component, Suspense } from 'react';
import { useTranslation, withTranslation, Trans } from 'react-i18next';

// use hoc for class based components
class LegacyWelcomeClass extends Component {
  render() {
    const { t } = this.props;
    return <h2>{t('errors:error')}</h2>;
  }
}
const Welcome = withTranslation()(LegacyWelcomeClass);

// Component using the Trans component
function MyComponent() {
  return (
    <Trans i18nKey="add">
      To get started, edit <code>src/App.js</code> and save to reload.
    </Trans>
  );
}

// page uses the hook
function Page() {
  const { t, i18n } = useTranslation(['errors']);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="App">
      <div className="App-header">
        <Welcome />
        <button type="button" onClick={() => changeLanguage('vi')}>
          de
        </button>
        <button type="button" onClick={() => changeLanguage('en')}>
          en
        </button>
      </div>
      <div className="App-intro">
        <MyComponent />
      </div>
      <div>{t('errors:error')}</div>
    </div>
  );
}

// loading component for suspense fallback
const Loader = () => (
  <div className="App">
    <div>loading...</div>
  </div>
);

// here app catches the suspense from page in case translations are not yet loaded
export default function I18test() {
  return (
    <Suspense fallback={<Loader />}>
      <Page />
    </Suspense>
  );
}
