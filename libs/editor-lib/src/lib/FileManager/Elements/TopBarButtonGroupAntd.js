import { Tooltip, Button } from 'antd';

export default function ButtonGroupSimple(props) {
  const { buttons, index } = props;
  return (
    <>
      {buttons.map((button, index) => {
        return (
          <Tooltip key={index} title={button.title}>
            <Button onClick={button.onClick} disabled={button.disable}>
              {button.icon && <span className={`${button.icon}`}></span>}
              {/* <span className=''>{button.title}</span> */}
            </Button>
          </Tooltip>
        );
      })}
    </>
  );
}
