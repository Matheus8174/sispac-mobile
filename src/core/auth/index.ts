import { create } from 'zustand';

import { getToken, removeToken, setToken, TokenType } from './utils';

interface AuthState {
  token: TokenType | null;
  staySignedIn: boolean;
  status: 'idle' | 'signOut' | 'signIn';
  signIn: (data: TokenType) => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  staySignedIn: false, // implementar refresh token
  token: null,
  userId: null,
  signIn: async (token) => {
    await setToken(token);

    set({ status: 'signIn', token });
  },
  signOut: async () => {
    await removeToken();

    set({ status: 'signOut', token: null });
  },
  hydrate: async () => {
    try {
      const userToken = await getToken();

      if (userToken) get().signIn(userToken);

      if (!userToken) get().signOut();
    } catch (e) {
      // catch error here
      // Maybe sign_out user!
    }
  }
}));

export const hydrateAuth = () => useAuth.getState().hydrate();
export const token = () => useAuth.getState().token;
