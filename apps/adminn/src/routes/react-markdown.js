import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Markdown from 'react-markdown';
import MdEditor, { Plugins } from 'react-markdown-editor-lite';
import rehypeRaw from 'rehype-raw';
import DOMPurify from 'dompurify';

const PLUGINS = undefined;
// const PLUGINS = ['header', 'divider', 'image', 'divider', 'font-bold', 'full-screen'];

// MdEditor.use(Plugins.AutoResize, {
//   min: 200,
//   max: 800
// });

MdEditor.use(Plugins.TabInsert, {
  tabMapValue: 1, // note that 1 means a '\t' instead of ' '.
});

export default class Demo extends React.Component {
  mdEditor = undefined;

  constructor(props) {
    super(props);
    this.renderHTML = this.renderHTML.bind(this);
    this.state = {
      value: '# Hello',
    };
  }

  handleEditorChange = (it, event) => {
    // console.log('handleEditorChange', it.text, it.html, event);
    this.setState({
      value: it.text,
    });
  };

  handleImageUpload = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (data) => {
        resolve(data.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  onCustomImageUpload = (event) => {
    console.log('onCustomImageUpload', event);
    return new Promise((resolve, reject) => {
      const result = window.prompt('Please enter image url here...');
      resolve({ url: result });
      // custom confirm message pseudo code
      // YourCustomDialog.open(() => {
      //   setTimeout(() => {
      //     // setTimeout 模拟oss异步上传图片
      //     // 当oss异步上传获取图片地址后，执行calback回调（参数为imageUrl字符串），即可将图片地址写入markdown
      //     const url = 'https://avatars0.githubusercontent.com/u/21263805?s=80&v=4'
      //     resolve({url: url, name: 'pic'})
      //   }, 1000)
      // })
    });
  };

  handleGetMdValue = () => {
    if (this.mdEditor) {
      alert(this.mdEditor.getMdValue());
    }
  };

  handleGetHtmlValue = () => {
    if (this.mdEditor) {
      alert(DOMPurify.sanitize(this.mdEditor.getHtmlValue()));
      alert(this.mdEditor.getHtmlValue());
    }
  };

  handleSetValue = () => {
    const text = window.prompt('Content');
    this.setState({
      value: DOMPurify.sanitize(text),
    });
  };

  renderHTML(text) {
    console.log(
      '🚀 ~ file: react-markdown.js ~ line 84 ~ Demo ~ renderHTML ~ text',
      text
    );
    return (
      <Markdown
        rehypePlugins={[rehypeRaw]}
        children={DOMPurify.sanitize(text)}
      />
    );

    // console.log(
    //   '🚀 ~ file: react-markdown.js ~ line 91 ~ Demo ~ renderHTML ~ resutl',
    //   resutl
    // );
    // return resutl;
  }

  render() {
    return (
      <div className="demo-wrap">
        <h3>react-markdown-editor-lite demo</h3>
        <nav className="nav">
          <button onClick={this.handleGetMdValue}>getMdValue</button>
          <button onClick={this.handleGetHtmlValue}>getHtmlValue</button>
          <button onClick={this.handleSetValue}>setValue</button>
        </nav>
        <div className="editor-wrap" style={{ marginTop: '30px' }}>
          <MdEditor
            ref={(node) => (this.mdEditor = node || undefined)}
            value={this.state.value}
            style={{ height: '500px', width: '100%' }}
            renderHTML={this.renderHTML}
            plugins={PLUGINS}
            config={{
              view: {
                menu: true,
                md: true,
                html: true,
                fullScreen: true,
                hideMenu: true,
              },
              table: {
                maxRow: 5,
                maxCol: 6,
              },
              imageUrl: 'https://octodex.github.com/images/minion.png',
              syncScrollMode: ['leftFollowRight', 'rightFollowLeft'],
            }}
            onChange={this.handleEditorChange}
            // onImageUpload={this.handleImageUpload}
            // onFocus={(e) => console.log('focus', e)}
            // onBlur={(e) => console.log('blur', e)}
            // onCustomImageUpload={this.onCustomImageUpload}
          />
          {/* <MdEditor
            style={{ height: '500px', width: '100%' }}
            renderHTML={this.renderHTML}
          /> */}
        </div>
        {/* <div style={{marginTop: '30px'}}>
          <MdEditor
            value={MOCK_DATA}
            style={{height: '200px', width: '100%'}}
            config={{
              view: {
                menu: true,
                md: true,
                html: true
              },
              imageUrl: 'https://octodex.github.com/images/minion.png'
            }}
            onChange={this.handleEditorChange} 
          />  
        </div> */}
      </div>
    );
  }
}
