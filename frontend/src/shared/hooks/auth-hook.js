import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, isAdmin, expirationDate) => {
    const tokenExpiry =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour
    setToken(token);
    setUserId(uid);
    setIsAdmin(isAdmin);
    setTokenExpirationDate(tokenExpiry);

    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpiry.toISOString(),
        isAdmin: isAdmin,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setIsAdmin(false);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        new Date(tokenExpirationDate).getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() &&
      storedData.isAdmin
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration),
        storedData.isAdmin
      );
    }
  }, [login]);

  return { token, login, logout, userId, isAdmin };
};
