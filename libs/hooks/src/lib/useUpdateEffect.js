import { useEffect, useRef } from 'react';

const useEffectUpdate = (effects, deps) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effects();
    }
  }, deps);
};

export { useEffectUpdate };
