import { createSlice } from "@reduxjs/toolkit";
import { set } from "mongoose";

const initialState={
  users: [],
  currentUser: null,
  onlineUsers: [],
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setUsers, setCurrentUser, setOnlineUsers} = chatSlice.actions
export default chatSlice.reducer;