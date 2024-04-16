import axios from 'axios';

const request = axios.create({
    baseURL: '/api',
    timeout: 60000
});

request.defaults.withCredentials = true;

request.interceptors.request.use(config => {
    return config;
});

request.interceptors.response.use(rs => {
    return rs
}, error => {
    return Promise.reject(new Error('Error : ' + error));
});

export default request;