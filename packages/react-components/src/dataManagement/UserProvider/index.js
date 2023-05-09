import React, { useRef, useEffect } from 'react';
import { Base64 } from 'js-base64';
import UserContext from './UserContext';
import axios from '../api/axios';
import env from '../../../.env.json';
import { deleteCookie, getCookie, setCookie } from '../../utils/util';

const JWT_STORAGE_NAME = 'GBIF_JWT';
const refreshInterval = 5 * 60 * 1000; // 5 minutes

const useUnmounted = () => {
  const unmounted = useRef(false)
  useEffect(() => () => {
    unmounted.current = true
  }, [])
  return unmounted
}

export function UserProvider(props) {
  const [user, setUser] = React.useState(null);
  const unmounted = useUnmounted();

  const signHeaders = (headers = {}) => {
    const jwt = getCookie(JWT_STORAGE_NAME);
    if (jwt) {
      headers['Authorization'] = `Bearer ${jwt}`;
    }
    return headers;
  }

  const getUser = async ({ reloadIfExpired }) => {
    const jwt = getCookie(JWT_STORAGE_NAME);
    if (!jwt) return;

    const { promise, cancel } = axios.post(`${env.API_V1}/user/whoami`, {}, { headers: signHeaders({}) });
    try {
      const { data: user, headers } = (await promise);

      const { token } = headers;
      // Renewing our local version of token
      if (token) {
        // Setting expiration data +30 minutes
        setCookie(JWT_STORAGE_NAME, token, { expires: 1800 });
      }

      if (!unmounted?.current) {
        setUser(user);
        refreshToken();
      }
    } catch (err) {
      const statusCode = err.response.status;
      if (statusCode < 500) {
        // The jwt is no longer valid - delete the token
        logout();
        if (reloadIfExpired) window.location.reload();
      } else {
        throw err;
      }
    }
  };

  // refresh jwt token by calling getUser every 10 minutes
  let refreshTimer = null;
  const refreshToken = () => {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      getUser({ reloadIfExpired: false });
      refreshToken();
    }, refreshInterval);
  }


  const login = async ({ username, password, renewToken } = {}) => {
    return axios.post(`${env.API_V1}/user/login`, {}, {
      headers: {
        'Authorization': `Basic ${Base64.encode(username + ':' + password)}`
      }
    }).promise
      .then(response => {
        const user = response.data;
        const jwt = user.token;
        // Setting expiration data +30 minutes
        setCookie(JWT_STORAGE_NAME, jwt, { expires: 1800 });
        if (renewToken) { refreshToken(); }
        if (!unmounted?.current) setUser(user);
      });
  };

  const logout = () => {
    deleteCookie(JWT_STORAGE_NAME);
    if (!unmounted?.current) setUser(null);
  };

  // get user on mount
  useEffect(() => {
    getUser({ reloadIfExpired: false });
  }, []);

  return <UserContext.Provider value={{ logout, login, signHeaders, user, JWT_STORAGE_NAME }} {...props} />
}