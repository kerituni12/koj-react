import { useEffect, useState } from 'react';

const getBreakPoint = (width) => {
  if (width < 576) {
    return 'xs';
  }
  if (width >= 576 && width < 720) {
    return 'sm';
  }
  if (width >= 768 && width < 1024) {
    return 'md';
  }
  if (width >= 992 && width < 1200) {
    return 'lg';
  }
  if (width >= 992 && width < 1600) {
    return 'xl';
  }
  return 'xxl';
};

function useBreakpoint() {
  const [breakpoint, setBreakPoint] = useState(() =>
    getBreakPoint(window.innerWidth)
  );

  useEffect(() => {
    function handleChange() {
      setBreakPoint(getBreakPoint(window.innerWidth));
    }

    window.addEventListener('resize', handleChange);

    return () => {
      window.removeEventListener('resize', handleChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return breakpoint;
}

export { useBreakpoint };
