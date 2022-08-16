import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from 'antd';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0px 0px 10px 0px',
  },
  title: {
    fontSize: '14px',
  },
  message: {
    fontSize: '12px',
    margin: '0',
    padding: '0',
  },
  progress: {
    width: '100%',
    marginTop: '-15px',
    marginBottom: '10px',
  },
}));

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function InfoBoxes(props) {
  const { alert } = props;
  const [open, setOpen] = React.useState(true);
  const prevAlert = usePrevious(alert);
  const classes = useStyles();
  const timer = (delay) => {
    setTimeout(() => {
      setOpen(false);
    }, delay);
  };
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (prevAlert !== alert) {
      setOpen(true);
    }
    return clearTimeout;
  }, [alert]);

  return (
    <>
      {open && (
        <Alert
          message={alert.title}
          type="info"
          closable
          // afterClose={handleClose}
        />
      )}
      {timer()}
    </>
  );
}

InfoBoxes.propTypes = {
  alert: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.string,
    type: PropTypes.string,
    disableClose: PropTypes.bool,
  }),
};
