import React, { useEffect, useState } from 'react';
import API_IP from '../../config';
import TextInput from '../../components/TextInput/TextInput';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '../../components/Button/Button';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { Region, departm, munic, paises } from '../../constants/departamentos';
import axios, { AxiosResponse } from 'axios';
import {
	FormularioSolicitudes,
	FormularioSolicitudesDefault,
} from '../../tipos/formularioSolicitudes';
import TableComponent, { DataAmortizar } from './components/TableComponent';

import {
	FaArrowsAltH,
	FaCaretRight,
	FaFileExcel,
	FaFilePdf,
	FaMoneyBill,
	FaSync,
	FaSyncAlt,
} from 'react-icons/fa';
import Select from '../../components/Select/Select';
import { tasaDeInteres } from '../../constants/dataConstants';
import SelectRango from './components/selectRango';
import IngresarDeudas from './components/IngresarDeudas';
import DatePicker from 'react-datepicker';
import { minMax } from '../../tipos/shared';
import { DataDeudas } from './components/TableDeudas';
import LayoutCustom from '../../components/Navbar/Layout';
import BotonesAdjuntar, {
	BotonesAdjuntarOptions,
	arrayBotones,
	optionMappings,
} from './components/BotonesAdjuntar';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { formatNumber } from '../../functions';
import clsx from 'clsx';
import { Profesion } from './components/ModalProfesion';
import InputMask from 'react-input-mask';
import { Tooltip } from 'react-tooltip';
import CurrencyInput from 'react-currency-input-field';
import { get } from 'lodash';
import ModalTyC from './components/ModalTyC';

const NuevaSlt2 = (): JSX.Element => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		watch,
		getValues,
		trigger,
		reset,
		formState: { errors },
	} = useForm<FormularioSolicitudes>({
		defaultValues: FormularioSolicitudesDefault,
	});
	const { id } = useParams();

	const [selectedFiles, setSelectedFiles] = useState<Record<string, File[]>>({});
	const [amortizarData, setAmortizarData] = useState<DataAmortizar[]>([]);
	const [destinos, setDestinos] = useState<any[]>([]);
	const [profesiones, setProfesiones] = useState<Profesion[]>([]);

	const [municipios, setMunicipios] = useState<any[]>([]);
	const [tableDeudas, setTableDeudas] = useState<DataDeudas[]>([]);
	const [step, setStep] = useState<number>(0);
	const [diferenciaAnos, setDiferenciaAnos] = useState<number>(0);
	const [montoRange, setMontoRange] = useState<minMax>({
		min: 0,
		max: 0,
	});
	const [plazoRange, setPlazoRange] = useState<minMax>({
		min: 0,
		max: 0,
	});
	const [aceptoTerminos, setAceptoTerminos] = useState<boolean>(false);
	const companies = [
		{
			value: 'Cadelga',
			label: 'Cadelga',
			gerente: 'Mauricio Burgos',
			correo: 'mauricio.burgos@grupocadelga.com',
		},
		{
			value: 'Fertica',
			label: 'Fertica',
			gerente: 'Mauricio Burgos',
			correo: 'mauricio.burgos@grupocadelga.com',
		},
		{
			value: 'AgroMoney',
			label: 'AgroMoney',
			gerente: 'Mauricio Burgos',
			correo: 'mauricio.burgos@grupocadelga.com',
		},
		{
			value: 'Chumbagua',
			label: 'Chumbagua',
			gerente: 'Pablo Ardon',
			correo: 'pablo.ardon@chumbagua.com',
		},
		{
			value: 'Fertiagrho',
			label: 'Fertiagrho',
			gerente: 'Mauricio Burgos',
			correo: 'mauricio.burgos@grupocadelga.com',
		},
		{
			value: 'Tres Valles',
			label: 'Tres Valles',
			gerente: 'Magda Montoya',
			correo: 'mmontoya@3valles.hn',
		},
		{
			value: 'ADN',
			label: 'ADN',
			gerente: 'Magda Montoya',
			correo: 'mmontoya@3valles.hn',
		},
	];
	const salarioRange = {
		min: 0,
		max: 250000,
	};

	// useEffect based on id

	useEffect(() => {
		if (id) {
			setStep(0);
			axios
				.get(`${API_IP}/api/Solicitudes/CompletarSolicitud/${id}`)
				.then((response) => {
					//reset the form with the data from the response

					reset(response.data);
					//bookmark
					setValue('tipoDePersona', 'Natural');
					fetch(API_IP + '/api/Destino')
						.then((response) => response.json())
						.then((data: any) => {
							const selected = data.find(
								(item: any) => item.destino === response.data.destino_Credito
							);
							if (selected) {
								setValue('producto', selected.producto);
								setMontoRange({
									min: selected.minimo,
									max: selected.maximo,
								});
								setPlazoRange({
									min: 1,
									max: selected.plazo,
								});
							}
							setValue('plazo', response.data.plazo);
						});

					const selected = departm.find(
						(item: Region) => item.nombre === response.data.departamento
					);

					if (selected) {
						setValue('departamento', selected.nombre);
						changemunicipios(selected.id);
					}

					const selected2 = munic.find(
						(item: any) => item.nombre === response.data.municipio
					);
					if (selected2) {
						setValue('municipio', selected2.nombre);
					}
					setValue('monto', response.data.monto);
					setValue('destino_Credito', response.data.destino_Credito);
				});
		}
	}, [id]);

	const navigate = useNavigate();
	const locStorage = localStorage.getItem('logusuario');
	const handleUpload = (response: any) => {
		const formData = new FormData();
		if (selectedFiles) {
			for (const key in selectedFiles) {
				if (Object.prototype.hasOwnProperty.call(selectedFiles, key)) {
					const files = selectedFiles[key];
					for (let i = 0; i < files.length; i++) {
						const file = files[i];
						const mimeType = file.type;
						const fileNameParts = file.name.split('.');
						const fileExtension = fileNameParts[fileNameParts.length - 1];
						const newFileName = `${key}-${i + 1}.${fileExtension}`; // Construct new filename
						const modifiedFile = new File([file], newFileName, {
							type: file.type,
							lastModified: file.lastModified,
						});
						formData.append('files', modifiedFile);
					}
				}
			}
		}
		const usuariologtoken = localStorage.getItem('token');
		axios
			.post(
				`${API_IP}/api/Attachments?associatedId=${response.data.idSolicitud || 0}`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${usuariologtoken}`,
					},
				}
			)
			.then((response) => {
				toast.success('Solicitud Creada Exitosamente.');
				navigate('/');
			})
			.catch((error) => {
				console.error('API Error:', error);
			});
	};

	const handleSolicitud = (response: any) => {
		const idSolicitudValue = response.data.idSolicitud;
		const modifiedArray = tableDeudas.map((item) => {
			const { id, ...rest } = item;
			return {
				...rest,
				tipoCreada: false,
				idSolicitud: idSolicitudValue,
			};
		});
		const usuariologtoken = localStorage.getItem('token');
		axios.post(`${API_IP}/api/SolicitudesDeudas`, modifiedArray, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${usuariologtoken}`,
			},
		});
	};
	const handleUpload2 = (idSolicitud: any) => {
		const formData = new FormData();
		if (selectedFiles) {
			for (const key in selectedFiles) {
				if (Object.prototype.hasOwnProperty.call(selectedFiles, key)) {
					const files = selectedFiles[key];
					for (let i = 0; i < files.length; i++) {
						const file = files[i];
						const mimeType = file.type;
						const fileNameParts = file.name.split('.');
						const fileExtension = fileNameParts[fileNameParts.length - 1];
						const newFileName = `${key}-${i + 1}.${fileExtension}`; // Construct new filename
						const modifiedFile = new File([file], newFileName, {
							type: file.type,
							lastModified: file.lastModified,
						});
						formData.append('files', modifiedFile);
					}
				}
			}
		}
		const usuariologtoken = localStorage.getItem('token');
		axios
			.post(
				`${API_IP}/api/Attachments?associatedId=${idSolicitud || 0}`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${usuariologtoken}`,
					},
				}
			)
			.then((response) => {
				toast.success('Solicitud Creada Exitosamente.');
				navigate('/');
			})
			.catch((error) => {
				console.error('API Error:', error);
			});
	};

	const handleSolicitud2 = (idSolicitudValue: any) => {
		const modifiedArray = tableDeudas.map((item) => {
			const { id, ...rest } = item;
			return {
				...rest,
				tipoCreada: false,
				idSolicitud: idSolicitudValue,
			};
		});
		const usuariologtoken = localStorage.getItem('token');
		axios.post(`${API_IP}/api/SolicitudesDeudas`, modifiedArray, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${usuariologtoken}`,
			},
		});
	};
	const onSubmitParcial = async () => {
		try {
			const formData = getValues();

			if (formData.telefono.length < 8) {
				return toast.error('El numero de telefono debe tener al menos 8 digitos');
			}
			if (formData.dni.length < 11) {
				return toast.error('El numero de cedula debe tener al menos 11 digitos');
			}
			if (formData.nombre === '') {
				return toast.error('El nombre es requerido');
			}
			if (formData.apellido === '') {
				return toast.error('El apellido es requerido');
			}
			setValue('tipoDePersona', 'Natural');
			setValue('usuario_Registro', 1);
			const telefono = formData.telefono;
			const teljefe = formData.telJefeIn;
			const telEmpresa = formData.telEmpresa;
			const dni = formData.dni;
			toast.warn('Creando su Solicitud, No Cierre esta Pantalla.');
			const newForm2 = getValues();
			const cleancharsfromtelefono = telefono.replace(/[^0-9]/g, '');
			const cleancharsfromteljefe = teljefe.replace(/[^0-9]/g, '');
			const cleancharsfromtelEmpresa = telEmpresa.replace(/[^0-9]/g, '');
			const cleancharsfromdni = dni.replace(/[^0-9]/g, '');

			const newForm = {
				...newForm2,
				telefono: cleancharsfromtelefono,
				telJefeIn: cleancharsfromteljefe,
				telEmpresa: cleancharsfromtelEmpresa,
				dni: cleancharsfromdni,
				estatus: 'En Proceso',
			};

			const usuariologtoken = localStorage.getItem('token');
			await axios
				.get(`${API_IP}/api/Solicitudes/BuscarPorNumero/${newForm.telefono}`, {
					headers: {
						Authorization: `Bearer ${usuariologtoken}`,
					},
				})
				.then(async (data: any) => {
					if (data.status === 204) {
						const response = await axios.post(API_IP + '/api/Solicitudes/', newForm, {
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${usuariologtoken}`,
							},
						});
						if (response.status === 201) {
							toast.warn('Creando su Solicitud, No Cierre esta Pantalla.');
							handleUpload(response);
							handleSolicitud(response);
						}
					} else {
						return toast.error(
							'Ya existe una solicitud con este numero, para crear mas de una solicitud con el mismo numero, por favor registre su cuenta'
						);
					}
				});
		} catch (error) {
			console.log(error);
		}
	};
	const onSubmit: SubmitHandler<FormularioSolicitudes> = async (formData) => {
		try {
			trigger();
			if (!(Object.keys(errors).length === 0)) {
				return;
			}

			setValue('tipoDePersona', 'Natural');
			setValue('usuario_Registro', 1);
			const telefono = formData.telefono;
			const teljefe = formData.telJefeIn;
			const telEmpresa = formData.telEmpresa;
			const dni = formData.dni;
			toast.warn('Creando su Solicitud, No Cierre esta Pantalla.');
			const newForm2 = getValues();
			const cleancharsfromtelefono = telefono.replace(/[^0-9]/g, '');
			const cleancharsfromteljefe = teljefe.replace(/[^0-9]/g, '');
			const cleancharsfromtelEmpresa = telEmpresa.replace(/[^0-9]/g, '');
			const cleancharsfromdni = dni.replace(/[^0-9]/g, '');
			const newForm = {
				...newForm2,
				telefono: cleancharsfromtelefono,
				telJefeIn: cleancharsfromteljefe,
				telEmpresa: cleancharsfromtelEmpresa,
				dni: cleancharsfromdni,
			};

			const usuariologtoken = localStorage.getItem('token');
			if (newForm.estatus === 'En Proceso') {
				const newForm3 = {
					...newForm,
					estatus: 'Nueva',
				};
				axios
					.patch(`${API_IP}/api/Solicitudes/CompletarSolicitud/${id}`, newForm3)
					.then((response) => {
						handleUpload2(id);
						handleSolicitud2(id);
					});
			} else {
				await axios
					.get(`${API_IP}/api/Solicitudes/BuscarPorNumero/${newForm.telefono}`, {
						headers: {
							Authorization: `Bearer ${usuariologtoken}`,
						},
					})
					.then(async (data: any) => {
						if (data.status === 204) {
							const response = await axios.post(
								API_IP + '/api/Solicitudes/',
								newForm,
								{
									headers: {
										'Content-Type': 'application/json',
										Authorization: `Bearer ${usuariologtoken}`,
									},
								}
							);
							if (response.status === 201) {
								toast.warn('Creando su Solicitud, No Cierre esta Pantalla.');
								handleUpload(response);
								handleSolicitud(response);
							}
						} else {
							return toast.error(
								'Ya existe una solicitud con este numero, para crear mas de una solicitud con el mismo numero, por favor registre su cuenta'
							);
						}
					});
			}
		} catch (error) {
			return toast.error('Ha ocurrido un error.');
		}
	};

	const handleExportToExcel = async (monto: string, plazo: string) => {
		// const modifiedData = amortizarData.map((item) => {
		// 	return {
		// 		...item,
		// 		// Modify numeric values as needed, for example, doubling them
		// 		saldoInicial:
		// 			typeof item.saldoInicial === 'number'
		// 				? formatNumber(item.saldoInicial.toFixed(2))
		// 				: item.saldoInicial,
		// 		pagoProgramado:
		// 			typeof item.pagoProgramado === 'number'
		// 				? formatNumber(item.pagoProgramado.toFixed(2))
		// 				: item.pagoProgramado,

		// 		pagoTotal:
		// 			typeof item.pagoTotal === 'number'
		// 				? formatNumber(item.pagoTotal.toFixed(2))
		// 				: item.pagoTotal,
		// 		capital:
		// 			typeof item.capital === 'number'
		// 				? formatNumber(item.capital.toFixed(2))
		// 				: item.capital,
		// 		interes:
		// 			typeof item.interes === 'number'
		// 				? formatNumber(item.interes.toFixed(2))
		// 				: item.interes,
		// 		saldoFinal:
		// 			typeof item.saldoFinal === 'number'
		// 				? formatNumber(item.saldoFinal.toFixed(2))
		// 				: item.saldoFinal,
		// 		interesAcumulativo:
		// 			typeof item.interesAcumulativo === 'number'
		// 				? formatNumber(item.interesAcumulativo.toFixed(2))
		// 				: item.interesAcumulativo,

		// 		// Add similar logic for other numeric fields
		// 	};
		// });

		// const worksheet = XLSX.utils.json_to_sheet(modifiedData);

		// // const worksheet = XLSX.utils.json_to_sheet(amortizarData);
		// const workbook = XLSX.utils.book_new();
		// XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		// const excelBuffer = XLSX.write(workbook, {
		// 	bookType: 'xlsx',
		// 	type: 'array',
		// });
		// saveAs(
		// 	new Blob([excelBuffer], { type: 'application/octet-stream' }),
		// 	'table.xlsx'
		// );
		try {
			const usuariologtoken = localStorage.getItem('token');
			// const response = await axios.get(
			// 	`${API_IP}/api/Solicitudes/ExportToExcel?monto=${monto}&plazo=${plazo}`,
			// 	{ responseType: 'blob' }
			// );
			const response = await axios.get(
				`${API_IP}/api/Solicitudes/ExportToExcel?monto=${monto}&plazo=${plazo}`,
				{
					headers: {
						Authorization: `Bearer ${usuariologtoken}`,
					},
					responseType: 'blob',
				}
			);
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const a = document.createElement('a');
			a.href = url;
			a.download = 'solicitud_data.xlsx';
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error exporting Excel file', error);
		}
	};

	const getProfesion = async () => {
		try {
			axios
				.get(`${API_IP}/api/Profesion`)
				.then((data: AxiosResponse<Profesion[]>) => {
					setProfesiones(data.data);
				});
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		const defaultDestino: any = {
			idDestino: 0,
			destino: 'Seleccione un destino',
		};
		fetch(API_IP + '/api/Destino')
			.then((response) => response.json())
			.then((data: any) => {
				setDestinos([defaultDestino, ...data]);
			});
		const locStorage = localStorage.getItem('logusuario');
		if (locStorage) {
			const usuariolog = JSON.parse(locStorage);
			setValue('usuario_Registro', usuariolog.idUsuario);
			setValue('idUsuario', usuariolog.idUsuario);
		}
		getProfesion();
	}, []);
	const handlePaisChange = (e: any) => {
		const selected = paises.find((item: any) => item === e.target.value);
		if (selected) {
			setValue('pais', selected);
		}
	};

	const formatCurrency = (value: number | string): string => {
		const formatter = new Intl.NumberFormat('en-US');
		const currencySymbol = 'L';
		if (typeof value === 'string') {
			value = parseFloat(value);
		}
		if (isNaN(value) || value < 0) return '';
		const newValue = Number(value);
		const formattedValue = newValue.toFixed(2);
		const formattedCurrency = formatter.format(Number(formattedValue));
		return `${currencySymbol} ${formattedCurrency}`;
	};

	const changemunicipios = (departamentoId: number) => {
		const newMunic = munic.filter(
			(region) => region.idDepartamento === departamentoId
		);
		setMunicipios(newMunic);
		setValue('municipio', newMunic[0].nombre);
	};

	const handleDepartamentoChange = (e: any) => {
		const selected = departm.find(
			(item: Region) => item.nombre === e.target.value
		);
		if (selected) {
			setValue('departamento', selected.nombre);
			changemunicipios(selected.id);
		}
	};
	const handleMunicipioChange = (e: any) => {
		const selected = munic.find((item: any) => item.nombre === e.target.value);
		if (selected) {
			setValue('municipio', selected.nombre);
		}
	};
	const handleProfesionChange = (e: any) => {
		setValue('profesion', e.target.value);
	};
	const handleDestinoChange = (e: any) => {
		const selected = destinos.find(
			(item: any) => item.destino === e.target.value
		);
		if (selected) {
			setValue('producto', selected.producto);
			setMontoRange({
				min: 0,
				max: selected.maximo,
			});
			setPlazoRange({
				min: 1,
				max: selected.plazo,
			});
			// setValue('monto', 0);
			setValue('plazo', 1);
			setValue('destino_Credito', selected.destino);
		}
	};
	// useEffect(() => {
	// 	setValue('monto', montoRange.min);
	// }, [montoRange]);

	function calcularPago(tasa: number, nper: number, pv: number): number {
		const r = tasa / 12;
		const pago = (pv * r) / (1 - Math.pow(1 + r, -nper));
		if (!pago) return 0;
		return pago;
	}

	const handleGenerarTabla = () => {
		if (watchMonto > montoRange.max) {
			return toast.warn(
				'El monto ingresado supera el monto maximo para este destino'
			);
		}
		if (watchMonto < montoRange.min) {
			return toast.warn(
				'El monto ingresado es menor al monto minimo para este destino'
			);
		}
		if (watchPlazo > plazoRange.max) {
			return toast.warn(
				'El plazo ingresado supera el plazo maximo para este destino'
			);
		}
		if (watchPlazo < plazoRange.min) {
			return toast.warn(
				'El plazo ingresado es menor al plazo minimo para este destino'
			);
		}
		if (watchSalario && watchSalario <= 0) {
			return toast.warn('El salario debe ser mayor a 0');
		}
		setStep(1);
		const data: DataAmortizar[] = [];
		let saldoInicial = Number(watchMonto);
		let saldoFinal = 0;
		let interesAcumulativo = 0;
		let pagoProgramado = 0;
		let interes = 0;
		let capital = 0;
		let fechaPago = moment().format('DD/MM/YYYY');
		for (let i = 1; i <= Number(watchPlazo); i++) {
			interes = saldoInicial * 0.0125;
			capital = cuota - interes;
			saldoFinal = saldoInicial - capital;
			interesAcumulativo += interes;
			pagoProgramado = cuota;
			data.push({
				id: i.toString(),
				fechaDePago: fechaPago,
				saldoInicial: Number(saldoInicial.toFixed(2)),
				pagoProgramado: Number(pagoProgramado.toFixed(2)),
				pagoTotal: Number(pagoProgramado.toFixed(2)),
				capital: Number(capital.toFixed(2)),
				interes: Number(interes.toFixed(2)),
				saldoFinal: Number(saldoFinal.toFixed(2)),
				interesAcumulativo: Number(interesAcumulativo.toFixed(2)),
			});
			saldoInicial = saldoFinal;
			fechaPago = moment(fechaPago, 'DD/MM/YYYY')
				.add(1, 'months')
				.format('DD/MM/YYYY');
		}
		setAmortizarData(data);
	};
	const watchMonto = watch('monto');
	const watchPlazo = watch('plazo');
	const watchSalario = watch('salario');
	const cuota = calcularPago(
		tasaDeInteres / 100,
		Number(getValues('plazo')),
		Number(getValues('monto'))
	);
	useEffect(() => {
		setValue('cuota_Maxima', cuota);
	}, [cuota]);
	function getYearsAndMonthsPassed(fromDate2: Date): string {
		//validate if valid date
		//validate Cannot read properties of null (reading 'getTime')
		const fromDate = new Date(fromDate2);

		if (!fromDate) return '';

		if (isNaN(fromDate.getTime())) {
			return '';
		}
		const currentDate = new Date();
		let yearsDiff = currentDate.getFullYear() - fromDate.getFullYear();
		let monthsDiff = currentDate.getMonth() - fromDate.getMonth();
		if (monthsDiff < 0) {
			yearsDiff--;
			monthsDiff += 12;
		}
		setDiferenciaAnos(yearsDiff);
		if (yearsDiff === 0 && monthsDiff === 0) {
			return 'Menos de un mes';
		}
		let result = '';
		if (yearsDiff > 0) {
			result += yearsDiff === 1 ? '1 año' : `${yearsDiff} años`;
		}
		if (monthsDiff > 0) {
			if (result) {
				result += ' ';
			}
			result += monthsDiff === 1 ? '1 mes' : `${monthsDiff} meses`;
		}
		return result;
	}

	const handleBotonAmortizarDisable = () => {
		if (
			watch('destino_Credito') === 'Seleccione un destino' ||
			!watch('destino_Credito')
		) {
			return true;
		}
		if (watchMonto === 0 || !watchMonto) {
			return true;
		}
		if (watchPlazo === 0 || !watchPlazo) {
			return true;
		}
		if (!watchSalario || watchSalario === 0) {
			return true;
		}
		if (cuota / Number(watchSalario) > 0.3) {
			return true;
		}
		//check if watchSalario is NAn
		if (isNaN(Number(watchSalario))) {
			return true;
		}
		if (isNaN(Number(watchMonto))) {
			return true;
		}
		return false;
	};

	useEffect(() => {
		handlerTotalInteres();
		handlerTotalPagar();
		// setAmortizarData([]);
		if (isNaN(Number(watchMonto))) {
			setValue('monto', 0);
		}
		if (isNaN(Number(watchPlazo))) {
			setValue('plazo', 0);
		}
		if (isNaN(Number(watchSalario))) {
			setValue('salario', 0);
		}
	}, [watchMonto, watchSalario, watchPlazo]);
	const handlerTotalInteres = () => {
		const totalPago = cuota * Number(watchPlazo);
		const totalInteres = totalPago - Number(watchMonto);
		const totalPagar = totalInteres + Number(watchMonto);
		setValue('total_Pagar', Number(totalPagar.toFixed(2)));
		setValue('total_Interes', Number(totalInteres.toFixed(2)));
	};
	const handlerTotalPagar = () => {
		const totalPago = cuota * Number(watchPlazo);
		const totalInteres = totalPago - Number(watchMonto);
	};

	const handleAgregarDeuda = (data: DataDeudas) => {
		if (data.tipo === '') {
			return toast.warn('Debe seleccionar un tipo de deuda');
		}
		if (data.refencia === '') {
			return toast.warn('Debe ingresar una referencia');
		}
		if (data.monto === 0) {
			return toast.warn('Debe ingresar un monto');
		}
		setTableDeudas([...tableDeudas, data]);
		// console.log([...tableDeudas, data]);
	};

	const handleEliminarDeuda = (id: string) => {
		const newTableDeudas = tableDeudas.filter((item) => item.id !== id);
		setTableDeudas(newTableDeudas);
	};
	const tipoDePersonaWatch = watch('tipoDePersona');

	useEffect(() => {
		setValue('nombre', '');
		setValue('segundoNombre', '');
		setValue('apellido', '');
		setValue('segundoApellido', '');
		setValue('fechaNacimiento', new Date());
		setValue('antiguedad', new Date());
		setValue('direccion', '');
		setValue('segundoApellido', '');
	}, [tipoDePersonaWatch]);
	const handleDatosGeneralesContinue = async () => {
		if (tipoDePersonaWatch === 'Natural') {
			const trigerdata = await trigger([
				'nombre',
				'apellido',
				'dni',
				'profesion',
				'telefono',
				'pais',
				'departamento',
				'municipio',
				'fechaNacimiento',
				'nacionalidad',
				'genero',
				'tipoDePersona',
				'direccion',
				'antiguedad',
				'cargo',
				'telEmpresa',
				'contrato',
				'jefeIn',
				'gerenteRRHH',
				'telJefeIn',
				'correoJefeIn',
			]);
			const currentDate = new Date();
			const fechaDeNacimiento = getValues('fechaNacimiento');
			let yearsDiff = currentDate.getFullYear() - fechaDeNacimiento.getFullYear();
			if (yearsDiff < 18){
				toast.warn('Debe tener al menos 18 años para realizar una solicitud.');
				return;
			}
			if (diferenciaAnos < 1) {
				toast.warn('Debe tener al menos 1 año de antiguedad laboral.');
				return;
			}
			if (trigerdata) {
				setStep(2);
			} else {
				toast.warn('Debe completar los campos obligatorios');
			}
		} else {
			const trigerdata = await trigger([
				'nombre',
				'segundoNombre',
				'apellido',
				'segundoApellido',
				'fechaNacimiento',
				'direccion',
			]);
			if (trigerdata) {
				setStep(2);
			} else {
				toast.warn('Debe completar los campos obligatorios');
			}
		}
	};
	function getOptionsByList(listName: string): BotonesAdjuntarOptions[] {
		const optionIndices = optionMappings[listName] || [];
		return optionIndices.map((index) => arrayBotones[index]);
	}

	const onErrors = (errors: any) => {
		console.log(errors);
		return toast.error('Ha ocurrido un error.');
	};
	const handleEmpresaChange = (e: any) => {
		console.log(e);
		setValue('empresa', e.target.value);
		const selectedCompanie = companies.find(
			(item: any) => item.value === e.target.value
		);
		console.log(selectedCompanie);
		setValue('gerenteRRHH', selectedCompanie?.gerente || '');
	};
	const [modalIsOpen, setModalIsOpen] = useState(false);
	return (
		<>
			<LayoutCustom>
				<ModalTyC
					isOpen={modalIsOpen}
					closeModal={() => setModalIsOpen(false)}
					handler={() => {
						setAceptoTerminos(true);
						setModalIsOpen(false);
					}}
				/>
				<form
					onSubmit={handleSubmit(onSubmit, onErrors)}
					className="flex gap-y-2 flex-col items-center bg-gray-100 p-4 rounded-lg shadow-lg"
				>
					<div className="border-b-2 w-full flex justify-center border-black">
						<p className="text-xl font-semibold">Precalificado</p>
					</div>
					{watch('destino_Credito') !== 'Seleccione un destino' &&
						watch('destino_Credito') !== '' && (
							<div className="flex flex-row gap-2 w-full mb-2 flex-wrap sm:flex-nowrap">
								{/* if there is a destino selected, show optionmappins from botonesAdjintar, and show the text from arrayBotones
								 */}
								<b className="text-xs mt-1 ml-2">
									Para este destino necesitaras los siguientes documentos:
								</b>

								{getOptionsByList(watch('destino_Credito')).map((item) => (
									<p
										className="text-xs mt-1 ml-2 text-red-600"
										key={item.label}
										data-tooltip-id="my-tooltip2"
										data-tooltip-content={item.tooltip}
									>
										{item.label}
									</p>
								))}
								<Tooltip id="my-tooltip2" />
							</div>
						)}
					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<Select
								options={destinos.map((item: any) => ({
									label: item.destino,
									value: item.destino,
								}))}
								disabled={step !== 0}
								placeholder="se"
								label="Destino"
								{...register('destino_Credito')}
								onChange={handleDestinoChange}
							/>
						</div>
						<div className="flex flex-col w-full">
							<Controller
								name="producto"
								control={control}
								rules={{ required: true }}
								render={({ field: { value, onChange } }) => (
									<TextInput label="Producto" disabled {...register('producto')} />
								)}
							/>
						</div>
					</div>
					<div className="flex flex-row gap-2 gap-x-4 w-full flex-wrap sm:flex-nowrap">
						{/* <SelectRango
							label="Monto"
							montoRange={montoRange}
							selectOnChange={debouncedOnChangeMonto}
							control={control}
							register={register('monto')}
							step={100}
							disabled={step !== 0}
						/> */}
						<div className="flex flex-col gap-2 w-full flex-wrap sm:flex-nowrap">
							<Controller
								name="monto"
								control={control}
								rules={{ required: true }}
								render={({ field: { value, onChange } }) => (
									<div className="flex flex-col gap-y-1 w-full">
										<label className={clsx('ml-1 ')}>Monto</label>
										<CurrencyInput
											max={montoRange.max}
											disabled={step !== 0}
											{...register('monto')}
											value={value}
											onValueChange={(value, name) => {
												setValue('monto', Number(value));
												handlerTotalInteres();
												handlerTotalPagar();
											}}
											intlConfig={{ locale: 'es-HN', currency: 'HNL' }}
											//check if watchmonto is n, if its nan put 0
											min={0}
											prefix="L "
											className="block h-12 w-full rounded-lg border border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
										/>
									</div>
								)}
							/>
							{montoRange && (
								<p className="text-xs mt-1 ml-2 text-red-600">
									El monto maximo para este destino es de{' '}
									{formatCurrency(montoRange.max)}
								</p>
							)}
						</div>
						<div className="flex flex-col gap-2 w-full flex-wrap sm:flex-nowrap">
							<SelectRango
								label="Plazo"
								montoRange={plazoRange}
								selectOnChange={(e) => {
									setValue('plazo', Number(e.target.value));
									handlerTotalInteres();
									handlerTotalPagar();
								}}
								control={control}
								step={1}
								register={register('plazo')}
								ignoreDecimals
								value={watchPlazo}
								meses
								disabled={step !== 0}
							/>
							{plazoRange && (
								<p className="text-xs mt-1 ml-2 text-red-600">
									El plazo maximo para este destino es de {plazoRange.max} meses
								</p>
							)}
						</div>
						{/* <SSelectRango
							label="Salario"
							montoRange={salarioRange}
							selectOnChange={debouncedOnChangeSalario}
							control={control}
							step={100}
							register={register('salario')}
							disabled={step !== 0}
						/> */}
						<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
							<Controller
								name="salario"
								control={control}
								rules={{ required: true }}
								// render={({ field: { value, onChange } }) => (
								// 	<TextInput
								// 		label="Salario"
								// 		type="number"
								// 		disabled={step !== 0}
								// 		{...register('salario')}
								// 	/>
								// )}
								render={({ field: { value, onChange } }) => (
									<div className="flex flex-col gap-y-1 w-full">
										<label className={clsx('ml-1 ')}>Salario</label>
										<CurrencyInput
											disabled={step !== 0}
											{...register('salario')}
											value={value}
											onValueChange={(value, name) => {
												setValue('salario', Number(value));
												handlerTotalInteres();
												handlerTotalPagar();
											}}
											intlConfig={{ locale: 'es-HN', currency: 'HNL' }}
											min={0}
											prefix="L "
											className="block h-12 w-full rounded-lg border border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
										/>
									</div>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<TextInput label="Tiempo Máximo" disabled value={plazoRange.max} />
						</div>
						<div className="flex flex-col w-full">
							<TextInput
								label="Tasa de Interés"
								disabled
								value={`${tasaDeInteres}%`}
							/>
						</div>
						<div className="flex flex-col w-full">
							<Controller
								name="cuota_Maxima"
								control={control}
								rules={{ required: true }}
								render={({ field: { value, onChange } }) => (
									<TextInput
										label="Cuota Máxima"
										value={formatCurrency(cuota.toFixed(2))}
										disabled
									/>
								)}
							/>

							{cuota / Number(watchSalario) > 0.3 && (
								<p className="text-xs mt-2 ml-2 text-red-600">
									Cuota excede el 30% del salario base
								</p>
							)}
						</div>
					</div>
					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<TextInput
								label="Observaciones"
								disabled={step !== 0}
								{...register('observaciones')}
							/>
						</div>
						<div className="flex flex-col w-full ">
							<Controller
								name="total_Interes"
								control={control}
								rules={{ required: true }}
								render={({ field: { value, onChange } }) => (
									<TextInput
										disabled
										value={formatCurrency(value)}
										label="Total Interés"
										{...register('total_Interes')}
									/>
								)}
							/>
						</div>
						<div className="flex flex-col w-full">
							<Controller
								name="total_Pagar"
								control={control}
								rules={{ required: true }}
								render={({ field: { value, onChange } }) => (
									<TextInput
										disabled
										value={formatCurrency(value)}
										label="Total a Pagar"
										{...register('total_Pagar')}
									/>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-row w-full justify-between gap-x-2">
							<div className="flex flex-row gap-2 flex-wrap items-center">
								<Button
									onClick={handleGenerarTabla}
									type="button"
									disabled={handleBotonAmortizarDisable()}
									customClassName={`font-semibold text-white ${
										handleBotonAmortizarDisable() || step !== 0
											? 'cursor-not-allowed bg-gray-300'
											: 'bg-green-700  '
									}`}
								>
									Amortizar <FaMoneyBill />
								</Button>
								<p className={step !== 0 ? 'hidden' : ''}>
									Por favor, amortice para continuar.
								</p>
								<Button
									type="button"
									onClick={() => {
										setStep(0);
										setAmortizarData([]);
									}}
									customClassName={`font-semibold text-white ${
										step <= 0 ? 'hidden bg-gray-300' : 'bg-green-700  '
									}`}
								>
									Restablecer <FaSyncAlt />
								</Button>
							</div>
							{amortizarData && amortizarData.length > 0 && (
								<div className="flex flex-row justify-end">
									<Button
										onClick={() =>
											handleExportToExcel(watchMonto.toString(), watchPlazo.toString())
										}
										type="button"
										customClassName="bg-green-700 font-semibold text-white"
									>
										Exportar a Excel <FaFileExcel />
									</Button>
								</div>
							)}
						</div>
						{amortizarData && amortizarData.length > 0 && (
							<TableComponent data={amortizarData} id="table-to-export" />
						)}
					</div>
					<div className="mt-2 border-b-2 w-full flex justify-center border-black">
						<p className="text-xl font-semibold">Datos Generales</p>
					</div>
					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						{/*<div className="flex flex-col w-1/2">
							 <Controller
								name="tipoDePersona"
								control={control}
								rules={{ required: true }}
								render={({ field: { value, onChange } }) => (
									<Select
										value={value}
										options={[
											{ label: 'Natural', value: 'Natural' },
											{ label: 'Juridica', value: 'Juridica' },
										]}
										label="Tipo de persona"
										{...register('tipoDePersona')}
										disabled={step !== 1}
									/>
								)}
							/>
							{errors.tipoDePersona && (
								<p className="text-xs mt-2 ml-2 text-red-600">
									El tipo de persona es requerido
								</p>
							)}
						</div>*/}
					</div>
					{tipoDePersonaWatch === 'Natural' ? (
						<>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full">
									<Controller
										name="nombre"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Primer Nombre"
												disabled={step !== 1}
												{...register('nombre')}
											/>
										)}
									/>
									{errors.nombre && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El nombre es requerido
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="segundoNombre"
										control={control}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Segundo Nombre"
												disabled={step !== 1}
												{...register('segundoNombre')}
											/>
										)}
									/>
									{errors.segundoNombre && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El segundo nombre es requerido
										</p>
									)}
								</div>
							</div>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full">
									<Controller
										name="apellido"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												disabled={step !== 1}
												label="Primer Apellido"
												{...register('apellido')}
											/>
										)}
									/>
									{errors.apellido && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El apellido es requerido
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="segundoApellido"
										control={control}
										render={({ field: { value, onChange } }) => (
											<TextInput
												disabled={step !== 1}
												label="Segundo Apellido"
												{...register('segundoApellido')}
											/>
										)}
									/>
									{errors.segundoApellido && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El segundo apellido es requerido
										</p>
									)}
								</div>
							</div>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full">
									<Controller
										name="dni"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput disabled={step !== 1} label="DNI" {...register('dni')} />
										)}
									/>
									{errors.dni && (
										<p className="text-xs mt-2 ml-2 text-red-600">El DNI es requerido</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Select
										options={profesiones.map((item: Profesion) => ({
											label: item.profesionName,
											value: item.profesionName,
										}))}
										disabled={step !== 1}
										placeholder="Seleccione una profesión"
										label="Profesión"
										{...register('profesion')}
										onChange={handleProfesionChange}
									/>
									{/* <Controller
										name="profesion"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												disabled={step !== 1}
												label="Profesión"
												{...register('profesion')}
											/>
										)}
									/> */}
									{errors.profesion && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											La profesion es requerida
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="correoPersonal"
										control={control}
										rules={{
											required: true,
											pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
										}}
										render={({ field: { value, onChange } }) => (
											<TextInput
												disabled={step !== 1}
												label="Correo Personal"
												{...register('correoPersonal')}
											/>
										)}
									/>
									{errors.correoPersonal && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El correo es requerido
										</p>
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
													disabled={step !== 1}
													value={value}
													placeholder="Teléfono"
													className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
													{...register('telefono')}
													onChange={onChange}
												/>
											</div>
										)}
									/>
									{/* <Controller
									name="telefono"
									control={control}
									rules={{
										required: true,
									}}
									render={({ field: { value, onChange } }) => (
										<TextInput
											disabled={step !== 1}
											label="Teléfono (91234567)"
											{...register('telefono')}
										/>
									)}
								/> */}
									{errors.telefono && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El telefono es requerido
										</p>
									)}
								</div>
							</div>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full">
									<Controller
										name="estadoCivil"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<Select
												options={[
													{ label: 'Soltero', value: 'Soltero' },
													{ label: 'Union Libre', value: 'Union Libre' },
													{ label: 'Casado', value: 'Casado' },
													{ label: 'Divorciado', value: 'Divorciado' },
													{ label: 'Viudo', value: 'Viudo' },
												]}
												label="Estado Civil"
												{...register('estadoCivil')}
												disabled={step !== 1}
											/>
										)}
									/>
									{errors.estadoCivil && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El estado civil es requerido
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="nombreConyuge"
										control={control}
										render={({ field: { value, onChange } }) => (
											<TextInput
												disabled={
													step !== 1 ||
													watch('estadoCivil') === 'Soltero' ||
													watch('estadoCivil') === 'Divorciado' ||
													watch('estadoCivil') === 'Viudo'
												}
												label="Nombre Cónyuge"
												{...register('nombreConyuge')}
											/>
										)}
									/>
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="profesionConyuge"
										control={control}
										render={({ field: { value, onChange } }) => (
											<TextInput
												disabled={
													step !== 1 ||
													watch('estadoCivil') === 'Soltero' ||
													watch('estadoCivil') === 'Divorciado' ||
													watch('estadoCivil') === 'Viudo'
												}
												label="Profesión Cónyuge"
												{...register('profesionConyuge')}
											/>
										)}
									/>
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="telConyuge"
										control={control}
										rules={{
											pattern: /^[0-9]{8}$/,
										}}
										render={({ field: { value, onChange } }) => (
											<div className="w-full">
												<label className="ml-1">Teléfono Cónyuge (91234567)</label>
												<InputMask
													mask="99999999"
													value={value}
													placeholder="Teléfono Cónyuge (91234567)"
													disabled={
														step !== 1 ||
														watch('estadoCivil') === 'Soltero' ||
														watch('estadoCivil') === 'Divorciado' ||
														watch('estadoCivil') === 'Viudo'
													}
													className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
													{...register('telConyuge')}
													onChange={onChange}
												/>
											</div>
										)}
									/>
									{/* <Controller
										name="telConyuge"
										control={control}
										render={({ field: { value, onChange } }) => (
											<TextInput
												disabled={
													step !== 1 ||
													watch('estadoCivil') === 'Soltero' ||
													watch('estadoCivil') === 'Divorciado' ||
													watch('estadoCivil') === 'Viudo'
												}
												label="Teléfono Cónyuge (91234567)"
												{...register('telConyuge')}
											/>
										)}
									/> */}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="dependientes"
										control={control}
										render={({ field: { value, onChange } }) => (
											<TextInput
												disabled={step !== 1}
												label="Dependientes"
												{...register('dependientes')}
											/>
										)}
									/>
								</div>
							</div>
							<label className="flex w-full">Lugar y Fecha de Nacimiento</label>
							<div className="flex flex-row gap-2 w-full flex-wrap p-2 rounded-lg border sm:flex-nowrap">
								<div className="flex flex-col w-full">
									<Controller
										name="pais"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<Select
												options={paises.map((item: any) => ({
													label: item,
													value: item,
												}))}
												defaultValue={'Honduras'}
												placeholder="se"
												label="País"
												{...register('pais')}
												onChange={handlePaisChange}
												disabled={step !== 1}
											/>
										)}
									/>
									{errors.pais && (
										<p className="text-xs mt-2 ml-2 text-red-600">El pais es requerido</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="departamento"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<Select
												options={departm.map((item: any) => ({
													label: item.nombre,
													value: item.nombre,
												}))}
												label="Departamento"
												{...register('departamento')}
												onChange={handleDepartamentoChange}
												disabled={step !== 1}
											/>
										)}
									/>
									{errors.departamento && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El departamento es requerido
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="municipio"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<Select
												options={municipios.map((item: any) => ({
													label: item.nombre,
													value: item.nombre,
												}))}
												label="Municipio"
												{...register('municipio')}
												onChange={handleMunicipioChange}
												disabled={step !== 1}
											/>
										)}
									/>
									{errors.municipio && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El municipio es requerido
										</p>
									)}
								</div>
								<div className="flex flex-col w-full gap-y-1">
									<label>Fecha de Nacimiento (DD/MM/AAAA)</label>
									<Controller
										control={control}
										name="fechaNacimiento"
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<>
												<DatePicker
													className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
													maxDate={new Date()}
													dateFormat={'dd/MM/yyyy'}
													showYearDropdown
													selected={new Date(value)}
													onChange={(date) => {
														onChange(date);
													}}
													customInput={
														<InputMask
															mask="99/99/9999"
															value={
																value instanceof Date ? value.toLocaleDateString() : value
															}
															onChange={(e) => onChange(e.target.value)}
															placeholder="Token"
															className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
														/>
													}
													disabled={step !== 1}
												/>
											</>
										)}
									/>
								</div>
							</div>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full">
									<Controller
										name="nacionalidad"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Nacionalidad"
												{...register('nacionalidad')}
												disabled={step !== 1}
											/>
										)}
									/>
									{errors.nacionalidad && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											La nacionalidad es requerida
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="genero"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<Select
												options={[
													{ label: 'Masculino', value: 'Masculino' },
													{ label: 'Femenino', value: 'Femenino' },
												]}
												label="Género"
												{...register('genero')}
												disabled={step !== 1}
											/>
										)}
									/>
									{errors.genero && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El genero es requerido
										</p>
									)}
								</div>
							</div>

							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full">
									<Controller
										name="direccion"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Dirección de Vivienda"
												{...register('direccion')}
												disabled={step !== 1}
											/>
										)}
									/>
									{errors.direccion && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											La direccion es requerida
										</p>
									)}
								</div>
							</div>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full">
									{/* <Controller
										name="empresa"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Lugar de Trabajo"
												{...register('empresa')}
												disabled={step !== 1}
											/>
										)}
									/> */}
									<Controller
										name="empresa"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<Select
												options={companies}
												label="Empresa para la cual trabaja"
												{...register('empresa')}
												//onchange handle the controller onchange and a console.log
												onChange={handleEmpresaChange}
												disabled={step !== 1}
											/>
										)}
									/>
									{errors.empresa && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											La empresa es requerida
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<label>Fecha de Ingreso (DD/MM/AAAA)</label>
									<Controller
										control={control}
										name="antiguedad"
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<>
												<DatePicker
													className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
													maxDate={new Date()}
													dateFormat={'dd/MM/yyyy'}
													showYearDropdown
													selected={new Date(value)}
													onChange={(date) => {
														onChange(date);
													}}
													customInput={
														<InputMask
															mask="99/99/9999"
															value={
																value instanceof Date ? value.toLocaleDateString() : value
															}
															onChange={(e) => onChange(e.target.value)}
															placeholder="Token"
															className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
														/>
													}
													// customInput={
													// 	<div className="flex flex-col w-full">
													// 		<InputMask
													// 			mask="99/99/9999"
													// 			value={
													// 				value instanceof Date ? value.toLocaleDateString() : value
													// 			}
													// 			onChange={(e) => onChange(e.target.value)}
													// 			placeholder="Token"
													// 			className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
													// 		/>

													// 	</div>
													// }
												/>
												<p className="text-xs mt-2 ml-2">
													{getYearsAndMonthsPassed(value)}
												</p>
											</>
										)}
									/>
								</div>
								<div className="flex flex-col w-full">
									<Controller
										control={control}
										name="cargo"
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Cargo que Ocupa"
												disabled={step !== 1}
												{...register('cargo')}
											/>
										)}
									/>
									{errors.cargo && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El cargo es requerido
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="telEmpresa"
										control={control}
										rules={{
											required: true,
											pattern: /^[0-9]{8}$/,
										}}
										render={({ field: { value, onChange } }) => (
											<div className="w-full">
												<label className="ml-1">Telefono de Trabajo (91234567)</label>
												<InputMask
													mask="99999999"
													value={value}
													placeholder="Telefono de Trabajo (91234567)"
													disabled={step !== 1}
													className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
													{...register('telEmpresa')}
													onChange={onChange}
												/>
											</div>
										)}
									/>
									{/* <Controller
										control={control}
										name="telEmpresa"
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Telefono de Trabajo (91234567)"
												disabled={step !== 1}
												{...register('telEmpresa')}
											/>
										)}
									/> */}
									{errors.telEmpresa && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El telefono de trabajo es requerido
										</p>
									)}
								</div>
							</div>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full">
									{/* 
									<Controller
										control={control}
										name="contrato"
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Tipo de Contrato"
												disabled={step !== 1}
												{...register('contrato')}
											/>
										)}
									/>*/}
									<Controller
										name="contrato"
										control={control}
										render={({ field: { value, onChange } }) => (
											<Select
												options={[
													{ value: 'Permanente', label: 'Permanente' },
													{ value: 'Temporal', label: 'Temporal' },
												]}
												label="Tipo de contrato"
												{...register('contrato')}
												disabled={step !== 1}
											/>
										)}
									/>
									{errors.contrato && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El tipo de contrato es requerido
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										control={control}
										name="jefeIn"
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Jefe Inmediato"
												disabled={step !== 1}
												{...register('jefeIn')}
											/>
										)}
									/>
									{errors.jefeIn && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El jefe inmediato es requerido
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										control={control}
										name="gerenteRRHH"
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Gerente de RRHH"
												disabled={step !== 1}
												{...register('gerenteRRHH')}
											/>
										)}
									/>
									{errors.gerenteRRHH && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El gerente de RRHH es requerido
										</p>
									)}
								</div>
							</div>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-row w-full items-center">
									<Controller
										control={control}
										name="esCadelga"
										render={({ field: { value, onChange } }) => (
											<input
												className="w-6 h-6 mr-1"
												type="checkbox"
												checked={value}
												onChange={onChange}
												disabled={step !== 1}
											/>
										)}
									/>
									Soy Empleado de &quot;Grupo Cadelga&quot;
								</div>
								{watch('esCadelga') ? (
									<>
										<div className="flex flex-col w-full">
											<Controller
												name="telJefeIn"
												control={control}
												rules={{
													required: true,
												}}
												render={({ field: { value, onChange } }) => (
													<div className="w-full">
														<label className="ml-1">
															Telefono de Jefe Inmediato (91234567)
														</label>
														<InputMask
															mask="99999999"
															value={value}
															placeholder="Telefono de Jefe Inmediato (91234567)"
															disabled={step !== 1}
															className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
															{...register('telJefeIn')}
															onChange={onChange}
														/>
													</div>
												)}
											/>
											{/* <Controller
												control={control}
												name="telJefeIn"
												rules={{
													required: true,
												}}
												render={({ field: { value, onChange } }) => (
													<TextInput
														label={'Telefono de Jefe Inmediato (91234567)'}
														{...register('telJefeIn')}
														disabled={step !== 1}
													/>
												)}
											/> */}
											{errors.telJefeIn && (
												<p className="text-xs mt-2 ml-2 text-red-600">
													El Telefono de jefe inmediato es requerido
												</p>
											)}
										</div>
										<div className="flex flex-col w-full">
											<Controller
												control={control}
												name="correoJefeIn"
												rules={{
													required: true,
												}}
												render={({ field: { value, onChange } }) => (
													<TextInput
														label={'Correo de Jefe Inmediato'}
														{...register('correoJefeIn')}
														disabled={step !== 1}
													/>
												)}
											/>
											{errors.correoJefeIn && (
												<p className="text-xs mt-2 ml-2 text-red-600">
													El telefono de jefe inmediato es requerido
												</p>
											)}
										</div>
									</>
								) : (
									<> </>
								)}
							</div>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-row w-full">
									<Button
										type="button"
										onClick={() => {
											handleDatosGeneralesContinue();
										}}
										customClassName={`font-semibold text-white ${
											step === 1 ? 'bg-green-700  ' : 'hidden bg-gray-300'
										}`}
									>
										Continuar <FaCaretRight />
									</Button>
								</div>
								<div className="flex flex-row w-full">
									<Button
										type="button"
										onClick={() => {
											setStep(1);
										}}
										customClassName={`font-semibold text-white ${
											step > 1 ? 'bg-green-700  ' : 'hidden bg-gray-300'
										}`}
									>
										Restablecer <FaSyncAlt />
									</Button>
								</div>
							</div>
						</>
					) : (
						<>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full">
									<Controller
										name="nombre"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Nombre de la Empresa"
												disabled={step !== 1}
												{...register('nombre')}
											/>
										)}
									/>
									{errors.nombre && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El nombre es requerido
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="contacto"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Contacto"
												disabled={step !== 1}
												{...register('contacto')}
											/>
										)}
									/>
									{errors.contacto && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El contacto es requerido
										</p>
									)}
								</div>
							</div>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full">
									<Controller
										name="RTN"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput label="RTN" disabled={step !== 1} {...register('RTN')} />
										)}
									/>
									{errors.RTN && (
										<p className="text-xs mt-2 ml-2 text-red-600">El RTN es requerido</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="correo"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Correo de la Empresa"
												disabled={step !== 1}
												{...register('correo')}
											/>
										)}
									/>
									{errors.correo && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El correo es requerido
										</p>
									)}
								</div>
							</div>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full gap-y-1">
									<label>Fecha de Constitución (DD/MM/AAAA)</label>
									<Controller
										control={control}
										name="fechaConstitucion"
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<DatePicker
												className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
												maxDate={new Date()}
												showYearDropdown
												customInput={
													<InputMask
														mask="99/99/9999"
														//fecha is stored like this 2019-10-01
														value={value instanceof Date ? value.toLocaleDateString() : value}
														onChange={(e) => onChange(e.target.value)}
														placeholder="Token"
														className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
													/>
												}
												selected={new Date(value)}
												onChange={(date) => {
													onChange(date);
												}}
												disabled={step !== 1}
											/>
										)}
									/>
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="direccion"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Lugar"
												disabled={step !== 1}
												{...register('direccion')}
											/>
										)}
									/>
									{errors.direccion && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El correo es requerido
										</p>
									)}
								</div>
							</div>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-row w-full">
									<Button
										type="button"
										onClick={() => {
											handleDatosGeneralesContinue();
										}}
										customClassName={`font-semibold text-white ${
											step === 1 ? 'bg-green-700  ' : 'hidden bg-gray-300'
										}`}
									>
										Continuar <FaCaretRight />
									</Button>
								</div>
								<div className="flex flex-row w-full">
									<Button
										type="button"
										onClick={() => {
											setStep(1);
										}}
										customClassName={`font-semibold text-white ${
											step > 1 ? 'bg-green-700  ' : 'hidden bg-gray-300'
										}`}
									>
										Restablecer <FaSyncAlt />
									</Button>
								</div>
							</div>
						</>
					)}

					{step >= 2 && (
						<>
							<div className="mt-2 border-b-2 w-full flex justify-center border-black">
								<p className="text-xl font-semibold">Referencias</p>
							</div>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full">
									<Controller
										name="referencia1"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Referencia Personal"
												disabled={step >= 3}
												{...register('referencia1')}
											/>
										)}
									/>
									{errors.referencia1 && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El Nombre es requerido
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="noReferencia1"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											// <TextInput
											// 	label="Numero de Telefono Referencia Personal"
											// 	disabled={step >= 3}
											// 	{...register('noReferencia1')}
											// />
											<div className="w-full">
												<label className="ml-1">
													Numero de Telefono Referencia Personal
												</label>
												<InputMask
													mask="99999999"
													disabled={step >= 3}
													value={value}
													className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
													{...register('noReferencia1')}
													onChange={onChange}
												/>
											</div>
										)}
									/>
									{errors.noReferencia1 && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El numero de telefono es requerido
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="relacionReferencia1"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Relación Referencia Personal"
												disabled={step >= 3}
												{...register('relacionReferencia1')}
											/>
										)}
									/>
									{errors.relacionReferencia1 && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											La relacion es requerida
										</p>
									)}
								</div>
							</div>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full">
									<Controller
										name="referencia2"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Referencia Familiar"
												disabled={step >= 3}
												{...register('referencia2')}
											/>
										)}
									/>
									{errors.referencia2 && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El Nombre es requerido
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="noReferencia2"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											// <TextInput
											// 	label="Numero de Telefono Referencia Personal"
											// 	disabled={step >= 3}
											// 	{...register('noReferencia2')}
											// />
											<div className="w-full">
												<label className="ml-1">
													Numero de Telefono Referencia Familiar
												</label>
												<InputMask
													mask="99999999"
													disabled={step >= 3}
													value={value}
													className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
													{...register('noReferencia2')}
													onChange={onChange}
												/>
											</div>
										)}
									/>
									{errors.noReferencia2 && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El numero de telefono es requerido
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<Controller
										name="relacionReferencia2"
										control={control}
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Relación Referencia Familiar"
												disabled={step >= 3}
												{...register('relacionReferencia2')}
											/>
										)}
									/>
									{errors.relacionReferencia2 && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											La relacion es requerida
										</p>
									)}
								</div>
							</div>

							<BotonesAdjuntar
								destino={watch('destino_Credito')}
								selectedFiles={selectedFiles}
								setSelectedFiles={setSelectedFiles}
								esCadelga={watch('esCadelga')}
								form={watch()}
								setStep={setStep}
								step={step}
							/>
						</>
					)}
					{step >= 3 && (
						<IngresarDeudas
							data={tableDeudas}
							id="tableDeudas"
							handleAgregarDeuda={handleAgregarDeuda}
							handleEliminarDeuda={handleEliminarDeuda}
						/>
					)}
					<div
						className="flex flex-row gap-2 w-full justify-center flex-wrap sm:flex-nowrap"
						onClick={
							!aceptoTerminos
								? () => {
										setModalIsOpen(true);
								  }
								: () => {
										console.log();
								  }
						}
					>
						<input
							className="w-6 h-6 mr-1 cursor-not-allowed"
							type="checkbox"
							checked={aceptoTerminos}
							disabled={!aceptoTerminos}
							onChange={() => {
								setAceptoTerminos(!aceptoTerminos);
							}}
						/>
						<p className="underline cursor-pointer">Terminos y Condiciones</p>
					</div>
					<div className="flex flex-row gap-2 w-full justify-center flex-wrap sm:flex-nowrap">
						<Button
							type="submit"
							disabled={step !== 3 || !aceptoTerminos}
							customClassName={clsx(
								' font-semibold text-white',
								step !== 3 ? 'cursor-not-allowed bg-gray-300' : 'bg-green-700 '
							)}
						>
							Enviar
						</Button>

						{getValues('estatus') === 'Nueva' && (
							<Button
								type="button"
								customClassName="bg-blue-700 font-semibold text-white"
								onClick={() => {
									onSubmitParcial();
								}}
							>
								Guardar Borrador
							</Button>
						)}

						<Button
							type="button"
							customClassName="bg-green-700 font-semibold text-white"
							onClick={() => {
								navigate('/');
							}}
						>
							Cancelar
						</Button>
					</div>
				</form>
			</LayoutCustom>
		</>
	);
};

export default NuevaSlt2;
