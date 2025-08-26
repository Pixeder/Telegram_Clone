import { createSlice } from "@reduxjs/toolkit";

const initialState={
  users: [],
  groups: [],
  currentUserOrGroup: null,
  onlineUsers: [],
}

const chatSlice = createSlice({
  name: "chat",
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
    setGroups: (state , action) => {
      state.groups = action.payload;
    }
  },
});

export const { setUsers, setCurrentUserOrGroup, setOnlineUsers , setGroups} = chatSlice.actions
export default chatSlice.reducer;