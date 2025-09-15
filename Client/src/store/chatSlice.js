import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  groups: [],
  currentUserOrGroup: null,
  onlineUsers: [],
  isProfileOpen: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setCurrentUserOrGroup: (state, action) => {
      state.currentUserOrGroup = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setIsProfileOpen: (state , action) => {
      state.isProfileOpen = action.payload;
    }
  },
});

export const { setUsers, setCurrentUserOrGroup, setOnlineUsers, setGroups, setIsProfileOpen } = chatSlice.actions;
export default chatSlice.reducer;
