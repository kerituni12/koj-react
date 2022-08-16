import * as React from 'react';

const useEffectUpdate: typeof React.useEffect = (effects, deps) => {
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effects();
    }
  }, deps);
};

export default useEffectUpdate;
