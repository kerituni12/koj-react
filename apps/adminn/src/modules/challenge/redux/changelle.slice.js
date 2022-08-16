import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  policies: {},
};
const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    addchallenge(state, { payload }) {
      if (payload?.resource) {
        let currentchallenge = state.policies[payload.resource];
        if (currentchallenge) {
          currentchallenge.unshift(payload.challenge);
        } else {
          state.policies[payload.resource] = [payload.challenge];
        }
      }
    },
    updatechallenge(state, { payload }) {
      if (payload?.resource && payload?.challenge) {
        const index = state.policies[payload.resource].findIndex(
          (challenge) => challenge.id === payload.challenge.id
        );
        state.policies[payload.resource][index] = { ...payload.challenge };
      }
    },
    removechallenge(state, { payload }) {
      if (payload?.resource) {
        const newPolices = state.policies[payload.resource].filter(
          (challenge) => challenge.id !== payload.id
        );

        state.policies[payload.resource] = newPolices;
      }
    },
    resetchallenge(state) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = initialState;
    },
  },
});

export const getPolicies = createAsyncThunk(
  'getPolicies',
  async (data, { getState }) => {
    return getState().role?.challenge?.policies;
  }
);

export const challengeAction = challengeSlice.actions;

export default challengeSlice.reducer;
