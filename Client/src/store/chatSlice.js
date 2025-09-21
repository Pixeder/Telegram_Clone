import { createSlice } from '@reduxjs/toolkit';
import { act } from 'react';

const initialState = {
  users: [],
  groups: [],
  currentUserOrGroup: null,
  onlineUsers: [],
  isProfileOpen: false,
  notifications: {},
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
    setIsProfileOpen: (state, action) => {
      state.isProfileOpen = action.payload;
    },
    addNotification: (state, action) => {
      const chatId = action.payload;

      if (state.notifications[chatId]) {
        state.notifications[chatId] += 1;
      } else {
        state.notifications[chatId] = 1;
      }
    },

    clearNotification: (state, action) => {
      const chatId = action.payload;
      state.notifications[chatId] = 0;
    },
  },
});

export const {
  setUsers,
  setCurrentUserOrGroup,
  setOnlineUsers,
  setGroups,
  setIsProfileOpen,
  addNotification,
  clearNotification,
} = chatSlice.actions;
export default chatSlice.reducer;
