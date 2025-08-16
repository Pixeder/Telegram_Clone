import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
  isAuthenticated: !!localStorage.getItem("token"),
}

const authSlice = createSlice(
  {
    name: "auth",
    initialState,
    reducers: {
      login: (state , action) => {
        const { user , token } = action.payload;
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", accessToken);
      },
      logout: (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }
);

export const { login , logout } = authSlice.actions;
export default authSlice.reducer;