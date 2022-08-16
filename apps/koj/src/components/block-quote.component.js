import { css } from '@emotion/css';

export function BlockQuote({ author, content }) {
  return (
    <div className={blockQuoteStyle}>
      <div className="block-quote">
        <div className="corner " id="left_top"></div>
        <div className="corner" id="left_bottom"></div>
        <div className="corner" id="right_top"></div>
        <div className="corner" id="right_bottom"></div>
        <span className="author">{author}</span>
        <div className="block-quote-content">
          <blockquote>
            <span>
              <i>&ldquo;{content}.&rdquo;</i>
            </span>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

const blockQuoteStyle = css`
  background-color: #1d1f20;
  padding: 20px;
  border-radius: 4px;

  .block-quote {
    height: 120px;
    border: 1px solid #f1c40f;
    text-align: center;
    position: relative;
    color: #fff;
    padding: 15px;
  }

  .block-quote-content {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    top: -20px;
    position: relative;
  }

  .author {
    background: #1d1f20;
    color: #f1c40f;
    padding: 0 10px;
    font-size: 13px;
    position: relative;
    top: -28px;
  }

  .corner {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    border: 1px solid #fff;
    transform: rotate(-45deg);
    position: absolute;
    background: #1d1f20;
  }

  #left_top {
    top: -16px;
    left: -16px;
    border-color: transparent transparent #f1c40f transparent;
  }

  #right_top {
    top: -16px;
    right: -16px;
    border-color: transparent transparent transparent #f1c40f;
  }

  #left_bottom {
    bottom: -16px;
    left: -16px;
    border-color: transparent #f1c40f transparent transparent;
  }

  #right_bottom {
    bottom: -16px;
    right: -16px;
    border-color: #f1c40f transparent transparent transparent;
  }

  p {
    padding-top: 13px;
    font-size: 13px;
  }
`;
