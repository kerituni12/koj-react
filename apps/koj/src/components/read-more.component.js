import * as React from 'react';
import styled from '@emotion/styled';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  // border-radius: 3px;
  // box-shadow: 3px 3px 15px -4px rgba(0, 0, 0, 0.86);
`;

const Body = styled.div`
  // height: calc((16px * ${(props) => props.lines - 0.618} * 1.618));
  height: calc(${(props) => props.openHeight});
  overflow: hidden;
  line-height: 1.618;
  word-break: break-word;

  &.clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-box-pack: end;
  }

  &.open,
  &.closed {
    transition: height 0.3s ease-in-out, display 0.3s ease;
    transition-delay: 0, 1;
    * {
      transition: all 0.3s ease-out;
    }
  }
  &.open {
    display: block;
    // height: calc(${(props) => props.openHeight});
  }

  &.closed {
    -webkit-line-clamp: ${(props) => props.lines};
    text-overflow: ellipsis;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  z-index: 1;
  // padding: 0.5rem 1rem 1rem;
`;

function useWindowSize() {
  const [size, setSize] = React.useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const ReadMoreEnum = {
  false: 'show_more',
  true: 'show_less',
};

export const ReadMore = ({ lines, children }) => {
  const [width] = useWindowSize();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = React.useState(false);
  const [bodyRef, setBodyRef] = React.useState(null);
  const [openHeight, setOpenHeight] = React.useState(0);
  const [className, setClassName] = React.useState('closed clamp');
  const [readMoreVisible, setReadMoreVisible] = React.useState(true);
  const [readMoreText, setReadMoreText] = React.useState(ReadMoreEnum['false']);

  const closedHeight = React.Children.count(children) * 16 * lines;

  const updateReadMoreText = (pred) => {
    const readMoreIndex = pred ? 'true' : 'false';
    setReadMoreText(ReadMoreEnum[readMoreIndex]);
  };
  const handleClick = () => {
    const nextOpenStatus = !isOpen;
    setIsOpen(nextOpenStatus);
    setClassName(nextOpenStatus ? 'open' : 'closed');
    updateReadMoreText(nextOpenStatus);
  };

  React.useLayoutEffect(() => {
    if (bodyRef) {
      const readMoreComponents = bodyRef.children;

      let componentScrollHeight = 0;
      for (let component of readMoreComponents) {
        componentScrollHeight += component.scrollHeight;
      }

      if (componentScrollHeight < closedHeight) {
        setReadMoreVisible(false);
        setClassName('unset');
        setOpenHeight();
      } else {
        //Height lon hon default
        if (isOpen) {
          setOpenHeight();
        } else {
          if (!readMoreVisible) {
            setReadMoreVisible(true);
            if (className === 'unset') {
              setClassName('open');
              setIsOpen(true);
              updateReadMoreText(true);
            }
          }
          setOpenHeight(`(16px * ${lines - 0.618} * 1.618)`);
        }
      }
    }
  }, [bodyRef, width, closedHeight, readMoreVisible, className]);

  return (
    <Container>
      <Body
        ref={setBodyRef}
        lines={lines}
        openHeight={openHeight}
        className={`${className}`}
        onTransitionEnd={(e) => {
          e.target.classList.add('clamp');
        }}
      >
        {typeof children === 'string' ? <p>{children}</p> : children}
      </Body>
      {readMoreVisible && (
        <Footer>
          <Button type="text" onClick={handleClick}>
            {t(`title.${readMoreText}`)}
          </Button>
        </Footer>
      )}
    </Container>
  );
};
