/* eslint-disable no-undef */
import { connect } from 'react-redux';
// import { getTranslations, langChange } from '@koj-react/editor-lib';

// import Challenges from './createChanglle';
import Challenges from './viewChanglle';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

export function App(props: any) {
  return (
    <>
      {/* <NxWelcome title="editor" /> */}
      {/* <HelloLib /> */}
      {/* <h1>Ckeditor5 Reactjs</h1> */}

      <Challenges />
      {/* <div className={classes.root}>
        <FileManager
          height={window.innerHeight - 140}
          callback={handleCallBack}
        />
      </div>
      <Button.Group className="hello">
        <Button className="hello">hello</Button>
        <Button>hello</Button>
        <Button>hello</Button>
      </Button.Group> */}
    </>
  );
}

const mapStateToProps = (store: {
  dashboard: { translations: any; lang: any };
}) => ({
  store,
  translations: store.dashboard.translations,
  lang: store.dashboard.lang,
});

const mapDispatchToProps = (
  dispatch: (arg0: { lang?: any; type: string; data?: any }) => any
) => ({
  // langChange: (lang: any) => dispatch(langChange(lang)),
  // getTranslations: (data: any) => dispatch(getTranslations(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
