import {
  ACCESS_PAYLOAD_KEY,
  BASE_API_PREFIX,
  BASE_API_URL,
  REFRESH_PAYLOAD_KEY,
} from '@/constants/default-value';
import {
  ApolloClient,
  ApolloLink,
  fromPromise,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import axios from './axios';
// import { RestLink } from 'apollo-link-rest';

const httpLink = new HttpLink({
  uri: `${BASE_API_URL}/${BASE_API_PREFIX}/graphql`,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const accessTokenPayload = localStorage.getItem('x-access-payload');
  return {
    headers: {
      ...headers,
      'x-access-payload': accessTokenPayload ? `${accessTokenPayload}` : '',
      'x-domain': 'sub.koj.test',
    },
  };
});

let isRefreshing = false;
let pendingRequests = [];

const resolvePendingRequests = () => {
  pendingRequests.map((callback) => callback());
  pendingRequests = [];
};

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        case 'UNAUTHENTICATED': {
          let forward$;

          if (!isRefreshing) {
            isRefreshing = true;
            forward$ = fromPromise(
              getNewToken()
                .then(({ accessTokenPayload, refreshTokenPayload }) => {
                  localStorage.setItem(
                    REFRESH_PAYLOAD_KEY,
                    refreshTokenPayload
                  );
                  localStorage.setItem(ACCESS_PAYLOAD_KEY, accessTokenPayload);
                  resolvePendingRequests();
                  return accessTokenPayload;
                })
                .catch((error) => {
                  pendingRequests = [];
                  return;
                })
                .finally(() => {
                  isRefreshing = false;
                })
            ).filter((value) => Boolean(value));
          } else {
            // Will only emit once the Promise is resolved
            forward$ = fromPromise(
              new Promise((resolve) => {
                pendingRequests.push(() => resolve());
              })
            );
          }

          return forward$.flatMap((accessTokenPayload) => {
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                'x-access-payload': accessTokenPayload,
              },
            });
            return forward(operation);
          });
        }
      }
    }
  }
  // if (networkError) {
  //     const observable = forward(operation);
  //     return new Observable((observer) => {
  //       observable.subscribe({
  //         error: (networkError) => {
  //             observer.error(new Error({ message: 'hello', leve: 1 }));
  //         },
  //       });
  //     });
  // }
});

async function getNewToken() {
  const refreshTokenPayload$ = localStorage.getItem(REFRESH_PAYLOAD_KEY);

  if (!refreshTokenPayload$) throw new Error('Missing refresh token');

  const { accessTokenPayload, refreshTokenPayload } = await axios
    .get(`${BASE_API_URL}/${BASE_API_PREFIX}/auth/refresh`, {
      headers: {
        'Content-Type': 'application/json',
        [`${REFRESH_PAYLOAD_KEY}`]: refreshTokenPayload$,
      },
    })
    .then(({ data }) => data);

  return {
    accessTokenPayload,
    refreshTokenPayload,
  };
}

export const cache = new InMemoryCache({
  // typePolicies: {
  //   Query: {
  //     fields: {
  //       comments(_, { args, toReference }) {
  //         return toReference({
  //           __typename: 'Comment',
  //           id: args?.parentId,
  //         });
  //       },
  //     },
  //   },
  // },
  typePolicies: {
    // Comment: {
    //   // In an inventory management system, products might be identified
    //   // by their UPC.
    //   keyFields: ['_id'],
    // },
    // Query: {
    //   fields: {
    //     comments: {
    //       keyArgs: (_, { variables }) => {
    //         console.log(
    //           '🚀 ~ file: apollo-client.js ~ line 149 ~ variables',
    //           variables
    //         );
    //         if (variables?.where?.parentId == null) {
    //           return 'parentId';
    //         } else {
    //           return `parentId:${variables.where.parentId}`;
    //         }
    //       },
    //     },
    //   },
    // },
  },
});

export const client = new ApolloClient({
  cache,
  link: ApolloLink.from([authLink, errorLink, httpLink]),
});
