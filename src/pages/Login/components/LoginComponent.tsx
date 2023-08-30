import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LoginFormDto } from '../../../tipos/login';
import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/Button/Button';
import InputMask from 'react-input-mask';
import { useState } from 'react';
import axios from 'axios';
import API_IP from '../../../config';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { ToastContainer, toast } from 'react-toastify';

const LoginComponent = (): JSX.Element => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<LoginFormDto>();
	const [isLoading, setIsLoading] = useState(false);
	const handleLogin = async (data: LoginFormDto) => {
		setIsLoading(true);

		try {
			// Aquí iría tu lógica de autenticación para verificar las credenciales del usuario.
			// Si la autenticación es exitosa, podrías hacer lo siguiente para redirigir al usuario a la página principal:
			// history.push("/Principal"); // Cambia "/main" por la ruta de tu página principal. http://192.100.10.187/
			const response = await axios.post(
				'http://' + API_IP + '/api/Usuarios/login/',
				{
					Telefono: data.Telefono,
					Password: data.Password,
				}
			);

			if (response.status === 200) {
				localStorage.setItem('logusuario', JSON.stringify(response.data.usuario));
				localStorage.setItem('token', response.data.token);
				navigate('/Principal');
				window.close();
			} else {
				toast.error('Credenciales incorrectas.');
			}
		} catch (error) {
			toast.error('Credenciales incorrectas.');
			console.log(error);
		}
		setIsLoading(false);
	};

	return (
		<div className="w-full gap-y-2">
			<form
				onSubmit={handleSubmit((data) => handleLogin(data))}
				className="w-full mb-2"
			>
				<div className="flex flex-col m-2 gap-y-2">
					<div className="flex flex-col gap-2 w-full justify-center items-end">
						<Controller
							name="Telefono"
							control={control}
							rules={{
								required: true,
							}}
							render={({ field: { value, onChange } }) => (
								<div className="w-full">
									<TextInput
										type="number"
										value={value}
										label="Telefono"
										{...register('Telefono')}
									/>
								</div>
							)}
						/>

						{errors.Telefono && errors.Telefono.type === 'required' && (
							<span className="text-red-500">Este campo es requerido</span>
						)}
						{errors.Telefono && errors.Telefono.type === 'pattern' && (
							<span className="text-red-500">
								Este campo debe ser un numero de telefono valido
							</span>
						)}
					</div>
					<div className="flex flex-col gap-2 w-full justify-center items-end">
						<Controller
							name="Password"
							control={control}
							rules={{
								required: true,
							}}
							render={({ field: { value, onChange } }) => (
								<TextInput
									value={value}
									type="password"
									label="Contraseña"
									{...register('Password')}
								/>
							)}
						/>
						{errors.Password && errors.Password.type === 'required' && (
							<span className="text-red-500">Este campo es requerido</span>
						)}
					</div>
					<div className="flex flex-col gap-2 w-full justify-center items-end">
						<Controller
							name="Token"
							control={control}
							rules={{
								required: true,
								pattern: /^[0-9]{6}$/,
							}}
							render={({ field: { value, onChange } }) => (
								<div className="w-full">
									<label className="ml-1">token</label>
									<InputMask
										mask="999999"
										value={value}
										onChange={onChange}
										placeholder="Token"
										className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
									/>
								</div>
								//<TextInput value={value} label="Token" {...register('Token')} />
							)}
						/>
						{errors.Token && errors.Token.type === 'required' && (
							<span className="text-red-500">Este campo es requerido</span>
						)}
						{errors.Token && errors.Token.type === 'pattern' && (
							<span className="text-red-500">
								Este campo debe ser un numero de 6 digitos
							</span>
						)}
					</div>
					<div className="flex flex-row justify-between">
						<div className="flex w-full justify-center">
							<Button
								customClassName="bg-green-700 font-semibold text-white"
								type="submit"
							>
								{isLoading ? <LoadingSpinner /> : 'Iniciar Sesión'}
							</Button>
						</div>
						<div className="flex w-full justify-center">
							<span
								onClick={() => navigate('Recuperar')}
								className="cursor-pointer text-center"
							>
								¿Olvidaste tu contraseña?
							</span>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default LoginComponent;
