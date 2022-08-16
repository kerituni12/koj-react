import { httpStatus } from '@/constants/http-status';

import Forbidden from './forbidden.component';
import NotFoundPage from './not-found.component';
import NetworkErrorPage from './network-error.component';
import ErrorSystemPage from './error-system.component';

function ErrorFallback({ error }) {
  if (error.networkError) {
    return <NetworkErrorPage />;
  }

  if (error.statusCode == httpStatus.NotFoundPage) {
    return <NotFoundPage />;
  }

  if (error.graphQLErrors) {
    if (
      error.graphQLErrors[0]?.extensions?.response?.statusCode ===
      httpStatus.UNAUTHORIZED
    ) {
      return <Forbidden />;
    }
  }

  return <ErrorSystemPage />;
}

export default ErrorFallback;
