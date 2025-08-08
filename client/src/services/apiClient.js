import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
});


export const apiConnector = (method, url, bodyData = undefined, headers = {}, params = undefined) => {
  const token = localStorage.getItem('token');
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  return axiosInstance({
    method,
    url,
    data: bodyData,
    params,
    headers: { ...authHeaders, ...headers },
  });
};
