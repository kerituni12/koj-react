import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    permissions: null,
  },
  reducers: {
    setUser: (state, action) => {
      const { firstname, lastname, permissions } = action.payload;
      state.firstname = firstname;
      state.lastname = lastname;
      state.permissions = permissions;
    },
    setPermission: (state, action) => {
      state.permissions = action.payload.permission;
    },
  },
});

export const { setUser, setPermission } = userSlice.actions;

export default userSlice.reducer;
