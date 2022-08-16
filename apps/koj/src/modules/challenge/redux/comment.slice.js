import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  comments: [],
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    addComment(state, { payload }) {
      if (payload.comment) {
        state.comments.push(payload.comment);
      }
    },
    updateComment(state, { payload }) {
      if (payload.comment) {
        const index = state.comments.findIndex(
          (comment) => comment.id === payload.comment.id
        );
        state.comments[index] = { ...payload.comment };
      }
    },
    removeComment(state, { payload }) {
      if (payload?.comment) {
        const newPolices = state.comments.filter(
          (comment) => comment.id !== payload.id
        );

        state.comments = newPolices;
      }
    },
    resetComment(state) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state = initialState;
    },
  },
});

export const commentAction = commentSlice.actions;

export default commentSlice.reducer;
