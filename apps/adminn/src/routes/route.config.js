import { useTranslation } from 'react-i18next';
import PrivateRoute from './pravateRoute';

const WrapperRouteComponent = ({ titleId, auth, ...props }) => {
  const { t } = useTranslation();

  if (titleId) {
    document.title = t('add');
  }

  return auth ? <PrivateRoute {...props} /> : props.element;
};

export default WrapperRouteComponent;
