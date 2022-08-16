import { getChallengeList } from '@/modules/challenge/graphql/challenge.query';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { Button } from 'antd';
import React, { useState } from 'react';

const GET_COUNTRIES = gql`
  {
    countries {
      code
      name
    }
  }
`;
export function DelayedCountries() {
  const [getCountries, { loading, data }] = useLazyQuery(GET_COUNTRIES);
  if (loading) return <p>Loading ...</p>;

  if (data && data.countries) {
    console.log(data.countries);
  }

  return (
    <div>
      <button onClick={() => getCountries()}>
        Click me to print all countries!
      </button>
      {data &&
        data.countries &&
        data.countries.map((c, i) => <div key={i}>{c.name}</div>)}
    </div>
  );
}

export function Test() {
  const [first, setFirst] = useState(1);
  return (
    <>
      <Button
        onClick={() => {
          // getCommentByIdGql();
          setFirst((state) => !state);
        }}
      >
        sdfdsf
      </Button>
      {first ? <DelayedCountries /> : <Txx />}
    </>
  );
}

export function GQL() {
  const { data, called } = useQuery(getChallengeList, {
    // nextFetchPolicy: 'network-only',
    // fetchPolicy: 'network-only',
  });
  const [getChallengeListGql] = useLazyQuery(getChallengeList, {
    fetchPolicy: 'cache-only',
  });
  console.log('🚀 ~ file: test.js ~ line 31 ~ GQL ~ data', data);
  console.log('🚀 ~ file: test.js ~ line 11 ~ Test ~ called', called);

  return (
    <>
      <Button
        onClick={() => {
          getChallengeListGql();
        }}
      >
        GQL
      </Button>
      {called}
      {data?.[0]?.id}
      aaa
    </>
  );
}

export function Txx() {
  return (
    <>
      <Button
        onClick={() => {
          // getCommentByIdGql();
        }}
      >
        TXT
      </Button>
    </>
  );
}
