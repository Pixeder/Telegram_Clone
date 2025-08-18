import { createSlice } from "@reduxjs/toolkit";

const initialState={
  users: [],
  currentUser: null,
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
  },
});

export const { setUsers, setCurrentUser } = chatSlice.actions
export default chatSlice.reducer;