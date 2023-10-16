import axios from 'axios';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import API_IP from '../../config';
import { Usuario, exampleUsuario } from '../../tipos/Usuario';
import { Controller, useForm } from 'react-hook-form';
import TextInput from '../../components/TextInput/TextInput';
import Select from '../../components/Select/Select';
import Button from '../../components/Button/Button';

interface ModalProps {
	isOpen: boolean;
	closeModal: () => void; // Define the type of closeModal function
	nombre?: string;
	cuotaFormulario?: number;
	usuario?: Usuario;
}
const ControlUsuarioModal: React.FC<ModalProps> = ({
	isOpen,
	closeModal,
	nombre = '',
	cuotaFormulario = 0,
	usuario,
}) => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		getValues,
		control,
		reset,
		setValue,
	} = useForm<Usuario>({
		defaultValues: exampleUsuario,
	});
	const [usuarioModal, setUsuarioModal] = useState();
	const [empresas, setEmpresas] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const usuariologtoken = localStorage.getItem('token');
	const fetchUsuarios = async () => {
		const res = await axios
			.get(`${API_IP}/api/Usuarios/${usuario?.idUsuario || 1}`, {
				headers: {
					Authorization: `Bearer ${usuariologtoken}`,
				},
			})
			.then((res) => {
				setEmpresas(JSON.parse(res.data.empresa));
				setIsLoading(false);
				const newData = {
					...res.data,
					password: '',
				};
				reset(newData);
			});
		//console.log(res.data);
		//setUsuarioModal(res.data);
	};
	useEffect(() => {
		setIsLoading(true);
		if (usuario) fetchUsuarios();
		else {
			reset(exampleUsuario);
			setIsLoading(false);
		}
	}, [usuario]);
	const perfiles = [
		{ value: 'A', label: 'Administrador' },
		{ value: 'E', label: 'Cliente' },
		{ value: 'R', label: 'RRHH' },
		{ value: 'M', label: 'AgroMoney' },
		{ value: 'C', label: 'Comite de Credito' },
	];
	// const companies = [
	// 	'Cadelga',
	// 	'Fertica',
	// 	'AgroMoney',
	// 	'CATV',
	// 	'Chumbagua',
	// 	'Fertiagrho',
	// 	'Tres Valles',
	// 	'ADN',
	// ];

	const onSubmit = async (data: Usuario) => {
		//json-stringify the array and add it to the data object
		data.empresa = JSON.stringify(empresas);
		
		if (data.idUsuario !== 0) {
			// const res = await axios.patch(
			// 	`${API_IP}/api/Usuarios/${data.idUsuario}`,
			// 	data
			// );
			//add headers
			const usuariologtoken = localStorage.getItem('token');
			const res = await axios({
				method: 'patch',
				url: `${API_IP}/api/Usuarios/${data.idUsuario}`,
				data: data,
				headers: {
					Authorization: `Bearer ${usuariologtoken}`,
				},
			});
		} else {
			const usuariologtoken = localStorage.getItem('token');
			const res = await axios({
				method: 'post',
				url: `${API_IP}/api/Usuarios`,
				data: data,
				headers: {
					Authorization: `Bearer ${usuariologtoken}`,
				},
			});
			// const res = await axios.post(`${API_IP}/api/Usuarios`, data);
		}
		closeModal();
	};
	 const companies = [
		{ value: 'Cadelga', label: 'Cadelga' },
		{ value: 'Fertica', label: 'Fertica' },
		{ value: 'AgroMoney', label: 'AgroMoney' },
		{ value: 'CATV', label: 'CATV' },
		{ value: 'Chumbagua', label: 'Chumbagua' },
		{ value: 'Fertiagrho', label: 'Fertiagrho' },
		{ value: 'Tres Valles', label: 'Tres Valles' },
		{ value: 'ADN', label: 'ADN' },
	];

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			contentLabel="ModalRRHH"
			style={{
				overlay: {
					backgroundColor: 'rgba(0,0,0,0.5)',
				},
				content: {
					backgroundColor: '#fff',
					margin: 'auto',
					width: '520px',
					height: 600,
					border: '1px solid #ccc',
					borderRadius: '4px',
					outline: 'none',
					padding: '20px',
					overflowX: 'hidden',
				},
			}}
		>
			{isLoading ? (
				<svg
					className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			) : (
				<form className="flex flex-col h-full pb-4" onSubmit={handleSubmit(onSubmit)}>
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-bold">Control de Usuario</h2>
						<button onClick={closeModal} className="text-2xl font-bold">
							&times;
						</button>
					</div>
					<div className="flex  gap-y-2 mt-2 flex-row w-full justify-between gap-x-4">
						<div className="flex flex-col gap-y-1 w-full">
							<Controller
								name="nombre"
								control={control}
								rules={{ required: true }}
								render={({ field }) => (
									<TextInput label="Nombre" placeholder="Nombre" {...field} />
								)}
							/>
						</div>
						<div className="flex flex-col gap-y-1 w-full">
							<Controller
								name="apellido"
								control={control}
								rules={{ required: true }}
								render={({ field }) => (
									<TextInput label="Apellido" placeholder="Apellido" {...field} />
								)}
							/>
						</div>
					</div>
					<div className="flex  gap-y-2 mt-2 flex-row w-full justify-between gap-x-4">
						<div className="flex flex-col gap-y-1 w-full">
							<Controller
								name="correo"
								control={control}
								rules={{ required: true }}
								render={({ field }) => (
									<TextInput label="Email" placeholder="Email" {...field} />
								)}
							/>
						</div>
						<div className="flex flex-col gap-y-1 w-full">
							<Controller
								name="telefono"
								control={control}
								rules={{ required: true }}
								render={({ field }) => (
									<TextInput label="Teléfono" placeholder="Teléfono" {...field} />
								)}
							/>
						</div>
					</div>
					<div className="flex gap-y-2 mt-2 flex-row w-full justify-between gap-x-4">
						<div className="flex flex-col gap-y-1 w-full">
							<Controller
								name="tipoPersona"
								control={control}
								render={({ field }) => (
									<Select
										label="Tipo de Persona"
										placeholder="Tipo de Persona"
										{...field}
										options={[
											{ label: 'Natural', value: 'Natural' },
											{ label: 'Juridica', value: 'Juridica' },
										]}
									/>
								)}
							/>
						</div>
						<div className="flex flex-col gap-y-1 w-full">
							<Controller
								name="perfil"
								control={control}
								rules={{ required: true }}
								render={({ field }) => (
									<Select
										label="Rol"
										placeholder="Rol"
										options={perfiles}
										value={field.value}
										onChange={(e) => {
											// console.log(e);
											const perfil = perfiles.find((p) => p.value === e.target.value);
											if (perfil) {
												setValue('perfil', perfil?.value);
												setValue('tipo', perfil?.label);
											}
										}}
										name="perfil"
									/>
								)}
							/>
						</div>
					</div>
					<div className="flex gap-y-2 mt-2 flex-row w-full justify-between gap-x-4">
						<div className="flex flex-col gap-y-1 w-full">
							<Controller
								name="password"
								control={control}
								render={({ field }) => (
									<TextInput
										label="Contraseña"
										placeholder="Contraseña"
										type="password"
										{...field}
									/>
								)}
							/>
						</div>
					</div>
					<div className="flex gap-y-2 mt-2 flex-row w-full justify-between gap-x-4">
						<div className="flex flex-col gap-y-1 w-full">
							<Controller
								name="estatus"
								control={control}
								rules={{ required: true }}
								render={({ field }) => (
									<Select
										label="Estatus"
										placeholder="Estatus"
										{...field}
										options={[
											{ label: 'Activo', value: 'A' },
											{ label: 'Inactivo', value: 'I' },
										]}
									/>
								)}
							/>
						</div>
						<div className="flex flex-col gap-y-1 w-full">
							<Controller
								name="token"
								control={control}
								rules={{ required: true }}
								render={({ field }) => (
									<TextInput label="Token" placeholder="Token" {...field} />
								)}
							/>
						</div>
					</div>
					{/* have a dropdown that creates a list of strings */}
					<div className="flex gap-y-2 mt-2 flex-row w-full justify-between gap-x-4">
						<div className="flex flex-row gap-y-1 w-full">
							<Controller
								name="empresa"
								control={control}
								rules={{ required: true }}
								render={({ field }) => (
									<Select
										label="Empresa"
										placeholder="Empresa"
										{...field}
										options={companies}
									/>
								)}
							/>
							{/* button that adds the value to a state array of strings */}
						</div>
						<div className="flex flex-row gap-y-1 w-1/2 items-center">
							<Button
								type="button"
								customClassName="bg-green-700 font-semibold text-white"
								onClick={() => {
									const empresa = getValues('empresa');
									if (empresa && !empresas.includes(empresa)) {
										let newEmpresas = [...empresas];
										newEmpresas.push(empresa);
										setEmpresas(newEmpresas);
									}
								}}
							>
								Añadir
							</Button>
						</div>
					</div>
					{/* have a list of strings with a button to remove it*/}
					<h1 className="text-xl font-bold mt-4 mb-2">Empresas</h1>
					
					<div className="flex flex-col gap-y-1 w-1/2">
						{empresas.map((empresa) => (
							<div className="flex justify-between" key={empresa}> 
								<p>{empresa}</p>
								<button
									// onClick={() => setEmpresas(empresas.filter((e) => e !== empresa))}
									onClick={() => {
										let newEmpresas = [...empresas];
										newEmpresas = newEmpresas.filter((e) => e !== empresa);
										setEmpresas(newEmpresas);
									}}
								>
									&times;
								</button>
							</div>
						))}
					</div>
					<div className="flex justify-end gap-2 mt-4 mb-4">
						<Button
							type="button"
							customClassName="bg-green-700 font-semibold text-white"
							onClick={closeModal}
						>
							Cancelar
						</Button>

						<Button
							type="submit"
							customClassName="bg-blue-700 font-semibold text-white"
						>
							Guardar
						</Button>
					</div>
				</form>
			)}
		</Modal>
	);
};

export default ControlUsuarioModal;
