import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/Button/Button';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import axios, { AxiosResponse } from 'axios';
import API_IP from '../../../config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DataDeudasAnalista } from './TableDeudasAnalista';

Modal.setAppElement('#root');
interface ModalProps {
	isOpen: boolean;
	closeModal: () => void; // Define the type of closeModal function
	nombre?: string;
	cuotaFormulario?: number;
	formMethods: any;
	idSolicitud?: string;
}

const ModalRRHH: React.FC<ModalProps> = ({
	isOpen,
	closeModal,
	cuotaFormulario = 0,
	formMethods,
	idSolicitud = 0,
}) => {
	const { getValues } = formMethods;
	const [cuota, setCuota] = useState(0);
	const [salario, setSalario] = useState('');
	const [comisiones, setComisiones] = useState(0);
	const [total, setTotal] = useState('');
	const navigate = useNavigate();

	const handleCuotaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newCuota = event.target.value;
		setCuota(Number(newCuota));
		calculateTotal(salario, Number(newCuota), comisiones);
	};

	useEffect(() => {
		setCuota(cuotaFormulario);
	}, [cuotaFormulario]);

	const handleSalarioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newSalario = event.target.value;
		setSalario(newSalario);
		calculateTotal(newSalario, cuota, comisiones);
	};
	const handleComisionesChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newComisiones = event.target.value;
		setComisiones(Number(newComisiones));
		calculateTotal(salario, cuota, Number(newComisiones));
	};
	// function getYearsAndMonthsPassed(fromDate: Date): string {
	// 	const currentDate = new Date();
	// 	let yearsDiff = currentDate.getFullYear() - fromDate.getFullYear();
	// 	let monthsDiff = currentDate.getMonth() - fromDate.getMonth();
	// 	if (monthsDiff < 0) {
	// 		yearsDiff--;
	// 		monthsDiff += 12;
	// 	}
	// 	if (yearsDiff === 0 && monthsDiff === 0) {
	// 		return 'Menos de un mes';
	// 	}
	// 	let result = '';
	// 	if (yearsDiff > 0) {
	// 		result += yearsDiff === 1 ? '1 año' : `${yearsDiff} años`;
	// 	}
	// 	if (monthsDiff > 0) {
	// 		if (result) {
	// 			result += ' ';
	// 		}
	// 		result += monthsDiff === 1 ? '1 mes' : `${monthsDiff} meses`;
	// 	}
	// 	return result;
	// }

	const calculateTotal = (
		ssalario: string,
		ccuota: number,
		ccomisiones: number
	) => {
		const cuotaValue = ccuota + sumValorCuotaNoIncluidas;
		const salarioValue = parseFloat(ssalario) + ccomisiones;

		if (!isNaN(cuotaValue) && !isNaN(salarioValue)) {
			// console.log('cuotaValue2: ', cuotaValue);
			// console.log('salarioValue2: ', salarioValue);
			const newTotal = (cuotaValue / salarioValue) * 100;
			setTotal(`${newTotal.toFixed(2)}`);
		}
	};

	const handleTotalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newTotal = event.target.value;
		setTotal(newTotal);
		// Clear cuota and salario
		setSalario('');
	};

	const [sumValorCuotaNoIncluidas, setSumValorCuotaNoIncluidas] = useState(0);
	const getDeudas = async () => {
		try {
			axios
				.get(
					`${API_IP}/api/SolicitudesDeudas/solicitud?id=${idSolicitud}&tipo=true`
				)
				.then((data: AxiosResponse<DataDeudasAnalista[]>) => {
					const sumValorCuotaNoIncluidas = data.data
						.filter((deuda) => deuda.incluir === 'No')
						.reduce((acc, deuda) => acc + deuda.valorCuota, 0);
					setSumValorCuotaNoIncluidas(sumValorCuotaNoIncluidas);
				});
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		getDeudas();
	}, []);
	const handleGuardar = async () => {
		try {
			const newStatus = getValues('pasoAgroMoney') ? 'En Comite' : 'En Analisis';
			const data = {
				empresa: getValues('empresa'),
				antiguedad: getValues('antiguedad'),
				PorcentajeRRHH: total,
				ComentariosRRHH: getValues('ComentariosRRHH'),
				estatus: newStatus,
				pasoRRHH: true,
			};
			// axios.patch('http://localhost:3001/rrhh', data);
			let formData = getValues();
			formData = {
				...formData,
				...data,
			};
			await axios.patch(API_IP + '/api/Solicitudes/' + idSolicitud, formData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			toast.success('Solicitud actualizada con exito');
			setTimeout(() => {
				navigate('/Principal');
			}, 1000);
		} catch (error) {
			toast.error('Error al actualizar la solicitud');
			console.error(error);
		}
	};

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
					height: '600px',
					border: '1px solid #ccc',
					borderRadius: '4px',
					outline: 'none',
					padding: '20px',
					overflow: 'hidden',
				},
			}}
		>
			<div className="w-full flex justify-between">
				<div className="flex items-center">
					<h1 className="text-3xl">Analisis RRHH</h1>
				</div>
				<button onClick={closeModal} className="text-lg">
					X
				</button>
			</div>
			<div className="flex gap-y-2 flex-col mt-2">
				<p className="text-xl">Datos del empleado</p>
				<div className="flex w-full">
					<div className="flex w-full">
						<TextInput
							id="nombre"
							value={`${getValues('nombre')} ${getValues('segundoNombre')} ${getValues(
								'apellido'
							)} ${getValues('segundoApellido')}`}
							disabled
							label={'Nombre'}
						/>
					</div>
				</div>
				<div className="flex justify-between">
					<div className="flex flex-col">
						<TextInput
							id="cuota"
							value={(cuota + sumValorCuotaNoIncluidas).toFixed(2)}
							disabled
							onChange={handleCuotaChange}
							label={'Cuota'}
						/>
					</div>
					<div className="flex flex-col">
						<TextInput
							id="salario"
							value={salario}
							onChange={handleSalarioChange}
							label={'Salario Neto'}
						/>
					</div>
				</div>

				<div className="flex justify-between">
					<div className="flex flex-col">
						{/* <Controller
							name="PorcentajeRRHH"
							control={formMethods.control}
							render={({ field }) => (
								<TextInput
									id="PorcentajeRRHH"
									value={field.value}
									onChange={field.onChange}
									label={'Total'}
								/>
							)}
						/> */}
						<TextInput
							id="total"
							value={`${total}`}
							onChange={handleTotalChange}
							label={'Porcentaje Cuota/Salario'}
							disabled
						/>
					</div>
					<div className="flex flex-col">
						<TextInput
							id="comisiones"
							value={comisiones}
							onChange={handleComisionesChange}
							label={'Comisiones Ultimos 6 Meses'}
						/>
					</div>
				</div>
				<div className="flex justify-between">
					<div className="flex flex-col">
						<Controller
							name="empresa"
							control={formMethods.control}
							render={({ field }) => (
								<TextInput
									id="empresa"
									value={field.value}
									onChange={field.onChange}
									label={'Lugar de trabajo'}
								/>
							)}
						/>
					</div>
					<div className="flex flex-col">
						<label>Fecha de Ingreso</label>
						<Controller
							control={formMethods.control}
							name="antiguedad"
							rules={{ required: true }}
							render={({ field: { value, onChange } }) => (
								<>
									<DatePicker
										className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
										maxDate={new Date()}
										showYearDropdown
										dateFormat={'dd/MM/yyyy'}
										selected={new Date(value)}
										onChange={(date) => {
											onChange(date);
										}}
									/>
								</>
							)}
						/>
					</div>
				</div>
				<div className="w-full flex justify-between">
					<div className="flex w-full">
						<Controller
							name="ComentariosRRHH"
							control={formMethods.control}
							render={({ field }) => (
								<TextInput
									id="ComentariosRRHH"
									customClassName="w-full"
									value={field.value}
									onChange={field.onChange}
									label={'Comentarios'}
								/>
							)}
						/>
					</div>
				</div>

				<div className="flex justify-end gap-2 mt-4">
					<Button
						type="button"
						customClassName="bg-green-700 font-semibold text-white"
						onClick={closeModal}
					>
						Cancelar
					</Button>

					<Button
						type="button"
						customClassName="bg-blue-700 font-semibold text-white"
						onClick={handleGuardar}
					>
						Guardar
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ModalRRHH;
