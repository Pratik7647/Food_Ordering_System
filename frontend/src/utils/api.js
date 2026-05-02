import axios from 'axios';
import qs from 'qs';

const api = axios.create({
    baseURL: 'https://food-ordering-system-kmtj.onrender.com/api',
    withCredentials: true,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export default api;
