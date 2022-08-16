import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  permissions: null,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { firstname, email, avatar, lastname, permissions, userId } =
        action.payload;
      state.firstname = firstname;
      state.lastname = lastname;
      state.email = email;
      state.id = userId;
      state.avatar = avatar;
      state.permissions = permissions;
    },
    setPermission: (state, action) => {
      state.permissions = action.payload.permission;
    },

    resetUser: () => initialState,
  },
});

export const { setUser, resetUser, setLosetPermission } = userSlice.actions;

export default userSlice.reducer;
