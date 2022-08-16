import React from 'react';

const Paper = React.forwardRef(({ id, children }, ref) => {
  return (
    <div id={id} style={{ position: 'relative' }} ref={ref}>
      {children}
    </div>
  );
});

export default Paper;
