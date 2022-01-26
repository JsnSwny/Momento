import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('accessToken');
    return tokenString
  };
  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    sessionStorage.setItem('userId', JSON.stringify(userToken.id));
    sessionStorage.setItem('username', JSON.stringify(userToken.username));
    sessionStorage.setItem('emailAddress', JSON.stringify(userToken.emailAddress));
    sessionStorage.setItem('roles', JSON.stringify(userToken.roles));
    sessionStorage.setItem('accessToken', JSON.stringify(userToken.accessToken));
    setToken(userToken.accessToken);
  };

  return {
    setToken: saveToken,
    token
  }
}