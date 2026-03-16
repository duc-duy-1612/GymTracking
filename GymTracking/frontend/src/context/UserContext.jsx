import { createContext, useContext, useState, useCallback } from 'react';
import userService from '../services/userService';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const fetchUser = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setFetchError(false);
      return Promise.resolve(null);
    }
    setLoading(true);
    setFetchError(false);
    return userService
      .getMe()
      .then((res) => {
        setUser(res.data);
        setFetchError(false);
        return res.data;
      })
      .catch(() => {
        setUser(null);
        setFetchError(true);
        return null;
      })
      .finally(() => setLoading(false));
  }, []);

  const value = {
    user,
    loading,
    fetchError,
    fetchUser,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}

export default UserContext;
