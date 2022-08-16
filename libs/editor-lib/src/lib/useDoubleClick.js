import { useCallback, useRef } from 'react';

export const useDoubleClick = (doubleClick, click, timeout = 200) => {
  // we're using useRef here for the useCallback to rememeber the timeout
  const clickTimeout = useRef();

  const clearClickTimeout = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = undefined;
    }
  };

  // return a memoized version of the callback that only changes if one of the dependencies has changed
  return useCallback(
    (event, data) => {
      clearClickTimeout();
      if (click && event.detail === 1) {
        clickTimeout.current = setTimeout(() => {
          click(event, data);
        }, timeout);
      }
      if (event.detail % 2 === 0) {
        doubleClick(event, data);
      }
    },
    [click, doubleClick]
  );
};
