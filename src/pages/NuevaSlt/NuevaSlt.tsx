import { useEffect, useState } from 'react';
import API_IP from '../../config';
import TextInput from '../../components/TextInput/TextInput';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '../../components/Button/Button';
import { jsPDF } from 'jspdf';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { Region, departm, munic, paises } from '../../constants/departamentos';
import axios from 'axios';
import {
	FormularioSolicitudes,
	FormularioSolicitudesDefault,
} from '../../tipos/formularioSolicitudes';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
import { debounce } from 'lodash';
import SelectRango from './components/selectRango';
import IngresarDeudas from './components/IngresarDeudas';
import DatePicker from 'react-datepicker';
import { minMax } from '../../tipos/shared';
import { DataDeudas } from './components/TableDeudas';
import LayoutCustom from '../../components/Navbar/Layout';
import BotonesAdjuntar from './components/BotonesAdjuntar';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '../../functions';
import clsx from 'clsx';

const NuevaSlt2 = (): JSX.Element => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		watch,
		getValues,
		trigger,
		formState: { errors },
	} = useForm<FormularioSolicitudes>({
		defaultValues: FormularioSolicitudesDefault,
	});
	const [selectedFiles, setSelectedFiles] = useState<Record<string, File[]>>({});
	const [amortizarData, setAmortizarData] = useState<DataAmortizar[]>([]);
	const [destinos, setDestinos] = useState<any[]>([]);
	const [municipios, setMunicipios] = useState<any[]>([]);
	const [tableDeudas, setTableDeudas] = useState<DataDeudas[]>([]);
	const [step, setStep] = useState<number>(0);
	const [montoRange, setMontoRange] = useState<minMax>({
		min: 0,
		max: 0,
	});
	const [plazoRange, setPlazoRange] = useState<minMax>({
		min: 0,
		max: 0,
	});

	const salarioRange = {
		min: 0,
		max: 250000,
	};
	const navigate = useNavigate();
	const locStorage = localStorage.getItem('logusuario');
	const handleUpload = (response: any) => {
		console.log('response', response.data.idSolicitud);
		console.log('form', getValues());
		const formData = new FormData();
		if (selectedFiles) {
			for (const key in selectedFiles) {
				if (Object.prototype.hasOwnProperty.call(selectedFiles, key)) {
					const files = selectedFiles[key];
					for (let i = 0; i < files.length; i++) {
						const file = files[i];
						//get mimetype
						const mimeType = file.type;
						const fileNameParts = file.name.split('.');

						// The last part will be the file extension
						const fileExtension = fileNameParts[fileNameParts.length - 1];
						const newFileName = `${key}-${i + 1}.${fileExtension}`; // Construct new filename
						// Create a new File object with updated filename
						const modifiedFile = new File([file], newFileName, {
							type: file.type,
							lastModified: file.lastModified,
						});

						formData.append('files', modifiedFile);
					}
				}
			}
		}
		axios
			.post(
				`http://${API_IP}/api/Attachments?associatedId=${
					response.data.idSolicitud || 0
				}`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)
			.then((response) => {
				toast.success('Solicitud Creada Exitosamente.');
				navigate('/Principal');

				// Handle success
			})
			.catch((error) => {
				console.error('API Error:', error);
				// Handle error
			});
	};

	const handleSolicitud = (response: any) => {
		// console.log('response', response.data.idSolicitud);
		const idSolicitudValue = response.data.idSolicitud;
		const modifiedArray = tableDeudas.map((item) => {
			// Destructure the object to remove the "id" property
			const { id, ...rest } = item;

			// Add the "idSolicitud" property with the constant value
			return {
				...rest,
				tipoCreada: false,
				idSolicitud: idSolicitudValue,
			};
		});

		axios
			.post(`http://${API_IP}/api/SolicitudesDeudas`, modifiedArray)
			.then((response) => {
				//navigate('/Principal');
			});
	};

	const onSubmit: SubmitHandler<FormularioSolicitudes> = async (formData) => {
		try {
			trigger();
			if (!(Object.keys(errors).length === 0)) {
				return;
			}
			setValue('usuario_Registro', 1);
			if (locStorage) {
				//const usuariolog = JSON.parse(locStorage);
				const usuariolog = JSON.parse(locStorage);
				setValue('usuario_Registro', usuariolog.id);
				setValue('idUsuario', usuariolog.id);
				setValue('telefono', usuariolog.telefono);
				const response = await axios.post(
					'http://' + API_IP + '/api/Solicitudes/',
					formData,
					{
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				if (response.status === 201) {
					toast.warn('Creando su Solicitud, No Cierre esta Pantalla.');
					handleUpload(response);

					handleSolicitud(response);
				}
			} else {
				await fetch(
					`http://${API_IP}/api/Solicitudes/BuscarPorNumero/${formData.telefono}`
				).then(async (data: any) => {
					if (data.status === 404) {
						const response = await axios.post(
							'http://' + API_IP + '/api/Solicitudes/',
							formData,
							{
								headers: {
									'Content-Type': 'application/json',
								},
							}
						);
						if (response.status === 201) {
							toast.warn('Creando su Solicitud, No Cierre esta Pantalla.');
							handleUpload(response);
							handleSolicitud(response);
							//Fnavigate('/Principal');
						}
					} else {
						return toast.error(
							'Ya existe una solicitud con este numero, para crear mas de una solicitud con el mismo numero, por favor registre su cuenta'
						);
					}
				});
			}
		} catch (error) {
			console.log(error);
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
			const response = await axios.get(
				`http://${API_IP}/api/Solicitudes/ExportToExcel?monto=${monto}&plazo=${plazo}`,
				{ responseType: 'blob' }
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

	const handleExportToPDF = () => {
		const input = document.getElementById('table-to-export');
		if (input) {
			html2canvas(input).then((canvas) => {
				const imgData = canvas.toDataURL('image/png');
				const customPageSize = { width: 841, height: 1189 };
				const pdf = new jsPDF({
					unit: 'mm',
					format: [customPageSize.width, customPageSize.height],
				});
				const pdfWidth = customPageSize.width;
				const imgHeight = (canvas.height * pdfWidth) / canvas.width;
				const pdfHeight = customPageSize.height;
				const pageHeight = pdfHeight - 35;
				const totalPages = Math.ceil(imgHeight / pageHeight);
				let currentPosition = 0;
				for (let page = 0; page < totalPages; page++) {
					pdf.addImage(
						imgData,
						'PNG',
						20,
						-currentPosition + 20,
						pdfWidth - 40,
						imgHeight,
						undefined,
						'FAST'
					);
					currentPosition += pageHeight;
					if (page + 1 < totalPages) {
						pdf.addPage([customPageSize.width, customPageSize.height], 'mm');
					}
				}
				pdf.save('table.pdf');
			});
		}
	};

	useEffect(() => {
		const defaultDestino: any = {
			idDestino: 0,
			destino: 'Seleccione un Destino',
		};
		fetch('http://' + API_IP + '/api/Destino')
			.then((response) => response.json())
			.then((data: any) => {
				setDestinos([defaultDestino, ...data]);
			});
		const locStorage = localStorage.getItem('logusuario');
		if (locStorage) {
			const usuariolog = JSON.parse(locStorage);
			setValue('usuario_Registro', usuariolog.idUsuario);
			setValue('idUsuario', usuariolog.idUsuario);
			setValue('telefono', usuariolog.telefono);
			setValue('tipoDePersona', usuariolog.tipoPersona || 'Natural');
		}
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
	const handleDestinoChange = (e: any) => {
		const selected = destinos.find(
			(item: any) => item.destino === e.target.value
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
			setValue('plazo', 1);
			setValue('destino_Credito', selected.destino);
		}
	};
	useEffect(() => {
		setValue('monto', montoRange.min);
	}, [montoRange]);

	function calcularPago(tasa: number, nper: number, pv: number): number {
		const r = tasa / 12;
		const pago = (pv * r) / (1 - Math.pow(1 + r, -nper));
		if (!pago) return 0;
		return pago;
	}

	const handleGenerarTabla = () => {
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
		Number(watchPlazo),
		Number(watchMonto)
	);
	useEffect(() => {
		setValue('cuota_Maxima', cuota);
	}, [cuota]);
	function getYearsAndMonthsPassed(fromDate: Date): string {
		const currentDate = new Date();
		let yearsDiff = currentDate.getFullYear() - fromDate.getFullYear();
		let monthsDiff = currentDate.getMonth() - fromDate.getMonth();
		if (monthsDiff < 0) {
			yearsDiff--;
			monthsDiff += 12;
		}
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
			watch('destino_Credito') === 'Seleccione un Destino' ||
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
		return false;
	};
	const debouncedOnChangeSalario = debounce((e: any) => {
		setValue('salario', Number(e.target.value));
		handlerTotalInteres();
		handlerTotalPagar();
		setAmortizarData([]);
	}, 50);
	const debouncedOnChangePlazo = debounce((e: any) => {
		setValue('plazo', Number(e.target.value));
		handlerTotalInteres();
		handlerTotalPagar();
		setAmortizarData([]);
	}, 50);
	const debouncedOnChangeMonto = debounce((e: any) => {
		setValue('monto', Number(e.target.value));
		handlerTotalInteres();
		handlerTotalPagar();
		setAmortizarData([]);
	}, 50);

	const handlerTotalInteres = () => {
		const totalPago = cuota * Number(watchPlazo);
		const totalInteres = totalPago - Number(watchMonto);
		setValue('total_Interes', Number(totalInteres.toFixed(2)));
	};
	const handlerTotalPagar = () => {
		const totalPago = cuota * Number(watchPlazo);
		const totalInteres = totalPago - Number(watchMonto);
		const totalPagar = totalInteres + Number(watchMonto);
		setValue('total_Pagar', Number(totalPagar.toFixed(2)));
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
		console.log([...tableDeudas, data]);
	};
	useEffect(() => {
		console.log(tableDeudas);
	}, [tableDeudas]);
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
		setValue('direccion', '');
		setValue('segundoApellido', '');
	}, [tipoDePersonaWatch]);
	const handleDatosGeneralesContinue = async () => {
		if (tipoDePersonaWatch === 'Natural') {
			const trigerdata = await trigger([
				'nombre',
				'segundoNombre',
				'apellido',
				'segundoApellido',
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
				'empresa',
				'antiguedad',
				'cargo',
				'telEmpresa',
				'contrato',
				'jefeIn',
				'gerenteRRHH',
				'telJefeIn',
				'correoJefeIn',
			]);
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
	return (
		<>
			<LayoutCustom>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex gap-y-2 flex-col items-center bg-gray-100 p-4 rounded-lg shadow-lg"
				>
					<div className="border-b-2 w-full flex justify-center border-black">
						<p className="text-xl font-semibold">Precalificado</p>
					</div>
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
						<SelectRango
							label="Monto"
							montoRange={montoRange}
							selectOnChange={debouncedOnChangeMonto}
							control={control}
							register={register('monto')}
							step={100}
							disabled={step !== 0}
						/>

						<SelectRango
							label="Plazo"
							montoRange={plazoRange}
							selectOnChange={debouncedOnChangePlazo}
							control={control}
							step={1}
							register={register('plazo')}
							ignoreDecimals
							disabled={step !== 0}
						/>

						<SelectRango
							label="Salario"
							montoRange={salarioRange}
							selectOnChange={debouncedOnChangeSalario}
							control={control}
							step={100}
							register={register('salario')}
							disabled={step !== 0}
						/>
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
							<div className="flex flex-row gap-2 ">
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
									<Button
										onClick={handleExportToPDF}
										type="button"
										customClassName="bg-green-700 font-semibold text-white"
									>
										Exportar a PDF <FaFilePdf />
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
						<div className="flex flex-col w-1/2">
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
						</div>
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
												label="Nombre"
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
										rules={{ required: true }}
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
												label="Apellido"
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
										rules={{ required: true }}
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
									<Controller
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
									/>
									{errors.profesion && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											La profesion es requerida
										</p>
									)}
								</div>
								{!locStorage && (
									<>
										<div className="flex flex-col w-full">
											<Controller
												name="telefono"
												control={control}
												rules={{
													required: true,
												}}
												render={({ field: { value, onChange } }) => (
													<TextInput
														disabled={step !== 1}
														label="Teléfono"
														{...register('telefono')}
													/>
												)}
											/>
											{errors.telefono && (
												<p className="text-xs mt-2 ml-2 text-red-600">
													El telefono es requerido
												</p>
											)}
										</div>
									</>
								)}
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
										name="profesionConyuge"
										control={control}
										render={({ field: { value, onChange } }) => (
											<TextInput
												disabled={step !== 1}
												label="Profesión Conyuge"
												{...register('profesionConyuge')}
											/>
										)}
									/>
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
									<label>Fecha de Nacimiento</label>
									<Controller
										control={control}
										name="fechaNacimiento"
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<DatePicker
												className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
												maxDate={new Date()}
												showYearDropdown
												selected={new Date(value)}
												onChange={(date) => {
													onChange(date);
												}}
												disabled={step !== 1}
											/>
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
									<Controller
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
									/>
									{errors.empresa && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											La empresa es requerida
										</p>
									)}
								</div>
								<div className="flex flex-col w-full">
									<label>Fecha de Ingreso</label>
									<Controller
										control={control}
										name="antiguedad"
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<>
												<DatePicker
													className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
													maxDate={new Date()}
													showYearDropdown
													selected={new Date(value)}
													onChange={(date) => {
														onChange(date);
													}}
													disabled={step !== 1}
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
										control={control}
										name="telEmpresa"
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Telefono de Trabajo"
												disabled={step !== 1}
												{...register('telEmpresa')}
											/>
										)}
									/>
									{errors.telEmpresa && (
										<p className="text-xs mt-2 ml-2 text-red-600">
											El telefono de trabajo es requerido
										</p>
									)}
								</div>
							</div>
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full">
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
									Soy Empleado de "Grupo Cadelga"
								</div>
								{watch('esCadelga') ? (
									<>
										<div className="flex flex-col w-full">
											<Controller
												control={control}
												name="telJefeIn"
												rules={{
													required: true,
												}}
												render={({ field: { value, onChange } }) => (
													<TextInput
														label={'Telefono de Jefe Inmediato'}
														{...register('telJefeIn')}
														disabled={step !== 1}
													/>
												)}
											/>
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
									<label>Fecha de Constitución</label>
									<Controller
										control={control}
										name="fechaConstitucion"
										rules={{ required: true }}
										render={({ field: { value, onChange } }) => (
											<DatePicker
												className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
												maxDate={new Date()}
												showYearDropdown
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
						<BotonesAdjuntar
							destino={watch('destino_Credito')}
							selectedFiles={selectedFiles}
							setSelectedFiles={setSelectedFiles}
							esCadelga={watch('esCadelga')}
							form={watch()}
							setStep={setStep}
							step={step}
						/>
					)}
					{step >= 3 && (
						<IngresarDeudas
							data={tableDeudas}
							id="tableDeudas"
							handleAgregarDeuda={handleAgregarDeuda}
							handleEliminarDeuda={handleEliminarDeuda}
						/>
					)}

					<div className="flex flex-row gap-2 w-full justify-center flex-wrap sm:flex-nowrap">
						<Button
							type="submit"
							disabled={step !== 3}
							customClassName={clsx(
								' font-semibold text-white',
								step !== 3 ? 'cursor-not-allowed bg-gray-300' : 'bg-green-700 '
							)}
						>
							Enviar
						</Button>
						<Button
							type="button"
							customClassName="bg-green-700 font-semibold text-white"
							onClick={() => {
								navigate('/Principal');
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
