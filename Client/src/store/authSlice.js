import { createSlice } from '@reduxjs/toolkit';

let initialUser = null;
const userFromStorage = localStorage.getItem('user');

if (userFromStorage && userFromStorage !== 'undefined') {
  try {
    initialUser = JSON.parse(userFromStorage);
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    localStorage.removeItem('user');
    initialUser = null;
  }
}

let initialToken = null;
const tokenFromStorage = localStorage.getItem('token');

if (tokenFromStorage && tokenFromStorage !== 'undefined') {
  try {
    initialToken = JSON.parse(tokenFromStorage);
  } catch (error) {
    console.error('Failed to parse token from localStorage:', error);
    localStorage.removeItem('token');
    initialToken = null;
  }
}

const initialState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', JSON.stringify(token));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
