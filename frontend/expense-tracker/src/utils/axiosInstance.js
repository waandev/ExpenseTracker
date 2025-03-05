import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

// Request Interceptor
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response Interceptor
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Handle common error globally
		if (error.response.status === 401) {
			// Redirect to login page
			window.location.href = '/login';
		} else if (error.response.status === 500) {
			console.error('Server error. Please try again later.');
		} else if (error.response.status === 'ECCONNABORTED') {
			console.error('Request timeout. Please try again later.');
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
