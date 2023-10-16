import axios from 'axios';

const setupAxiosInterceptors = () => {
	// Add a request interceptor
	axios.interceptors.request.use(
		(config) => {
			const usuariolog = localStorage.getItem('token') || '';
			// console.log('usuariolog interceptor', usuariolog);
			if (usuariolog) {
				config.headers.Authorization = `Bearer ${usuariolog}`;
			}
			return config;
		},
		(error) => {
			// console.log('error here', error);
			return Promise.reject(error);
		}
	);
	axios.interceptors.response.use(
		(response) => {
			// console.log('response, ', response);
			if (response.status === 401) {
				console.log('Unauthorized');
			}
			if (response.status === 403) {
				console.log('Forbidden');
			}
			if (response.status === 404) {
				console.log('Not Found');
			}

			return response;
		},
		(error) => {
			if (error) {
				console.log('error, ', error);
			}
		}
	);
};

export default setupAxiosInterceptors;
