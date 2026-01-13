import authReducer, { setCredentials, logout } from './authSlice';

describe('auth reducer', () => {
  it('handles setCredentials', () => {
    const initialState = { accessToken: null, refreshToken: null, role: null };
    const action = setCredentials({ access: 'a1', refresh: 'r1', role: 'customer' });
    const state = authReducer(initialState as any, action);
    expect(state.accessToken).toBe('a1');
    expect(state.refreshToken).toBe('r1');
    expect(state.role).toBe('customer');
  });

  it('handles logout', () => {
    const initialState = { accessToken: 'a', refreshToken: 'r', role: 'customer' };
    const state = authReducer(initialState as any, logout());
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
  });
});