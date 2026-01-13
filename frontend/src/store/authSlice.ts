import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken?: string | null;
  refreshToken?: string | null;
  role?: string | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  role: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ access: string; refresh?: string; role?: string }>) {
      state.accessToken = action.payload.access;
      if (action.payload.refresh) state.refreshToken = action.payload.refresh;
      if (action.payload.role) state.role = action.payload.role;
      localStorage.setItem('accessToken', action.payload.access);
      if (action.payload.refresh) localStorage.setItem('refreshToken', action.payload.refresh);
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
