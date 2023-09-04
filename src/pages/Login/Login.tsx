import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import imagenLogin from '../../images/agromoney.png';
import { useState } from 'react';
import clsx from 'clsx';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import { ToastContainer } from 'react-toastify';
const Login = (): JSX.Element => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('login');

	return (
		<div className="flex flex-col justify-center items-center w-full h-[90vh] gap-y-8 ">
			<ToastContainer />
			<img
				className="imagen-login hover:cursor-pointer"
				src={imagenLogin}
				alt="Imagen de login"
				onClick={() => navigate('/')}
			/>

			<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap justify-center items-end">
				<div className="flex flex-col w-80 bg-white border border-1 border-gray-300 rounded-lg">
					<div className="flex flex-row justify-center items-center w-full h-12 bg-green-600 rounded-t-lg ">
						<Button
							customClassName={clsx(
								'font-bold border-none text-2',
								activeTab == 'login' ? 'bg-white text-orange-600' : 'text-white'
							)}
							onClick={() => {
								setActiveTab('login');
							}}
						>
							Iniciar Sesión
						</Button>
						<Button
							customClassName={clsx(
								'font-bold border-none text-2',
								activeTab == 'register' ? 'bg-white text-orange-600' : 'text-white'
							)}
							onClick={() => {
								setActiveTab('register');
							}}
						>
							Registrar
						</Button>
					</div>
					<div className="flex flex-col justify-center items-center w-full h-full">
						{activeTab == 'login' ? (
							<LoginComponent />
						) : (
							<RegisterComponent setActiveTab={setActiveTab} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;