import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  policies: {},
};
const policySlice = createSlice({
  name: 'policy',
  initialState,
  reducers: {
    addPolicy(state, { payload }) {
      if (payload?.resource) {
        let currentPolicy = state.policies[payload.resource];
        if (currentPolicy) {
          currentPolicy.unshift(payload.policy);
        } else {
          state.policies[payload.resource] = [payload.policy];
        }
      }
    },
    updatePolicy(state, { payload }) {
      if (payload?.resource && payload?.policy) {
        const index = state.policies[payload.resource].findIndex(
          (policy) => policy.id === payload.policy.id
        );
        state.policies[payload.resource][index] = { ...payload.policy };
      }
    },
    removePolicy(state, { payload }) {
      if (payload?.resource) {
        const newPolices = state.policies[payload.resource].filter(
          (policy) => policy.id !== payload.id
        );

        state.policies[payload.resource] = newPolices;
      }
    },
    resetPolicy(state) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = initialState;
    },
  },
});

export const getPolicies = createAsyncThunk(
  'getPolicies',
  async (data, { getState }) => {
    return getState().role?.policy?.policies;
  }
);

export const policyAction = policySlice.actions;

export default policySlice.reducer;
