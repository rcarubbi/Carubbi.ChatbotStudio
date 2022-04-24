import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(async config => {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// api.interceptors.response.use(response => {
// 	return response;
// });

export default api;
