import { useCallback } from 'react';
import { redirect } from 'react-router';

export const TOKEN_KEY = 'BEARER_TOKEN';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const updateToken = (token = '') => {
  if (!token || token === '' || token === null) {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const useLogout = () => {
  const logout = useCallback(() => {
    updateToken('');
    redirect('/login');
  }, []);

  return [logout];
};
