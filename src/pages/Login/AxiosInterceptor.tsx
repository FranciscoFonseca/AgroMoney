import axios from 'axios';
import API_IP from '../../config';

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
				let errorMsg = error.message;
				//check if error.response exist
				if (error.response) {
					if (error.response.data) {
						errorMsg += ' /-/ ' + error.response.data;
					}
					if (error.response.status) {
						if (error.response.status === 401) {
							console.log('Unauthorized');
							window.location.replace('/');
						}
						if (error.response.status === 404) {
							console.log('Not Found');
							// window.location.replace('/');
						} //api/Log_Error
					}
				}
				axios.post(`${API_IP}/api/Log_Error`, {
					LogMsg: errorMsg,
					LogDate: new Date(),
				});
				//TypeError: Cannot read properties of undefined (reading 'status')
			}
		}
	);
};

export default setupAxiosInterceptors;
