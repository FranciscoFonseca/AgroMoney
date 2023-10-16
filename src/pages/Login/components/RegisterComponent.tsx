import { Controller, set, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { RegisterFormDto, defaultRegisterFormDto } from '../../../tipos/login';
import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/Button/Button';
import InputMask from 'react-input-mask';
import { useState } from 'react';
import axios from 'axios';
import API_IP from '../../../config';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { toast } from 'react-toastify';
import Select from '../../../components/Select/Select';

interface RegisterComponentProps {
	setActiveTab: (tab: string) => void;
}

const RegisterComponent = ({
	setActiveTab,
}: RegisterComponentProps): JSX.Element => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<RegisterFormDto>({ defaultValues: defaultRegisterFormDto });
	const [isLoading, setIsLoading] = useState(false);
	const handleLogin = async (formData: RegisterFormDto) => {
		setIsLoading(true);

		try {
			// Aquí iría tu lógica de autenticación para verificar las credenciales del usuario.
			// Si la autenticación es exitosa, podrías hacer lo siguiente para redirigir al usuario a la página principal:
			// history.push("/Principal"); // Cambia "/main" por la ruta de tu página principal. http://192.100.10.187/

			const usuariologtoken = localStorage.getItem('token');

			// const response = await axios.post(
			// 	 API_IP + '/api/Usuarios/',
			// 	formData
			// );
			const response = await axios.post(API_IP + '/api/Usuarios/', formData, {
				headers: {
					Authorization: `Bearer ${usuariologtoken}`,
				},
			});

			if (response.status === 201) {
				toast.success('Usuario Creado Correctamente.');
				setActiveTab('login');
			} else {
				toast.error('Ha Ocurrido un Error.');
			}
		} catch (error) {
			toast.error('Ha Ocurrido un Error.');
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
							name="nombre"
							control={control}
							rules={{
								required: true,
							}}
							render={({ field: { value, onChange } }) => (
								<TextInput value={value} label="Nombre" {...register('nombre')} />
							)}
						/>
						{errors.nombre && errors.nombre.type === 'required' && (
							<span className="text-red-500">Este campo es requerido</span>
						)}
					</div>
					<div className="flex flex-col gap-2 w-full justify-center items-end">
						<Controller
							name="apellido"
							control={control}
							rules={{
								required: true,
							}}
							render={({ field: { value, onChange } }) => (
								<TextInput value={value} label="apellido" {...register('apellido')} />
							)}
						/>
						{errors.apellido && errors.apellido.type === 'required' && (
							<span className="text-red-500">Este campo es requerido</span>
						)}
					</div>
					<div className="flex flex-col gap-2 w-full justify-center items-end">
						<Controller
							name="correo"
							control={control}
							rules={{
								required: true,
								pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
							}}
							render={({ field: { value, onChange } }) => (
								<TextInput value={value} label="correo" {...register('correo')} />
							)}
						/>
						{errors.correo && errors.correo.type === 'required' && (
							<span className="text-red-500">Este campo es requerido</span>
						)}
						{errors.correo && errors.correo.type === 'pattern' && (
							<span className="text-red-500">
								Este campo debe ser un correo valido
							</span>
						)}
					</div>
					<div className="flex flex-col gap-2 w-full justify-center items-end">
						<Controller
							name="telefono"
							control={control}
							rules={{
								required: true,
								pattern: /^[0-9]{8}$/,
							}}
							render={({ field: { value, onChange } }) => (
								<div className="w-full">
									<label className="ml-1">Teléfono</label>
									<InputMask
										mask="99999999"
										value={value}
										onChange={onChange}
										placeholder="Teléfono"
										className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
									/>
								</div>
							)}
						/>

						{errors.telefono && errors.telefono.type === 'required' && (
							<span className="text-red-500">Este campo es requerido</span>
						)}
						{errors.telefono && errors.telefono.type === 'pattern' && (
							<span className="text-red-500">
								Este campo debe ser un numero de telefono valido
							</span>
						)}
					</div>
					<div className="flex flex-col gap-2 w-full justify-center items-end">
						<Controller
							name="tipoPersona"
							control={control}
							rules={{
								required: true,
							}}
							render={({ field: { value, onChange } }) => (
								<Select
									value={value}
									label="Tipo de Persona"
									options={[
										{ label: 'Natural', value: 'Natural' },
										{ label: 'Juridica', value: 'Juridica' },
									]}
									//onChange={onChange}
									{...register('tipoPersona')}
								></Select>
							)}
						/>

						{errors.tipoPersona && errors.tipoPersona.type === 'required' && (
							<span className="text-red-500">Este campo es requerido</span>
						)}
					</div>
					<div className="flex flex-col gap-2 w-full justify-center items-end">
						<Controller
							name="password"
							control={control}
							rules={{
								required: true,
							}}
							render={({ field: { value, onChange } }) => (
								<TextInput
									value={value}
									type="password"
									label="Contraseña"
									{...register('password')}
								/>
							)}
						/>
						{errors.password && errors.password.type === 'required' && (
							<span className="text-red-500">Este campo es requerido</span>
						)}
					</div>

					<div className="flex flex-row justify-between">
						<div className="flex w-full justify-start">
							<Button
								customClassName="bg-green-700 font-semibold text-white"
								type="submit"
							>
								{isLoading ? <LoadingSpinner /> : 'Registrarse'}
							</Button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default RegisterComponent;
