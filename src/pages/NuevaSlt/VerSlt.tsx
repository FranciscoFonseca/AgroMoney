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
import axios, { AxiosResponse } from 'axios';
import {
	FormularioSolicitudes,
	FormularioSolicitudesDefault,
} from '../../tipos/formularioSolicitudes';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import TableComponent, { DataAmortizar } from './components/TableComponent';

import {
	FaEye,
	FaFileDownload,
	FaFileExcel,
	FaFilePdf,
	FaMoneyBill,
} from 'react-icons/fa';
import Select from '../../components/Select/Select';
import { tasaDeInteres } from '../../constants/dataConstants';
import { debounce, get } from 'lodash';
import SelectRango from './components/selectRango';
import IngresarDeudas from './components/IngresarDeudas';
import DatePicker from 'react-datepicker';
import { minMax } from '../../tipos/shared';
import { DataDeudas } from './components/TableDeudas';
import LayoutCustom from '../../components/Navbar/Layout';
import BotonesAdjuntar from './components/BotonesAdjuntar';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import IngresarDeudasAnalista from './components/IngresarDeudasAnalista';
import { DataDeudasAnalista } from './components/TableDeudasAnalista';
import ModalRRHH from './components/ModalRRHH';
import { Usuario } from '../../tipos/Usuario';
import clsx from 'clsx';
import ModalExepcion from './components/ModalExepcion';

const NuevaSlt2 = (): JSX.Element => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		watch,
		formState: { errors },
		reset,
		getValues,
		formState,
	} = useForm<FormularioSolicitudes>({
		defaultValues: FormularioSolicitudesDefault,
	});
	const { id } = useParams();
	const [selectedFiles, setSelectedFiles] = useState<Record<string, File[]>>({});
	const [esCadelga, setEsCadelga] = useState<boolean>(false);
	const [amortizarData, setAmortizarData] = useState<DataAmortizar[]>([]);
	const [destinos, setDestinos] = useState<any[]>([]);
	const [municipios, setMunicipios] = useState<any[]>([]);
	const [tableDeudas, setTableDeudas] = useState<DataDeudas[]>([]);
	const [tableDeudasAnalista, setTableDeudasAnalista] = useState<
		DataDeudasAnalista[]
	>([]);
	const [documentMetadata, setDocumentMetadata] = useState([]);
	const [montoRange, setMontoRange] = useState<minMax>({
		min: 0,
		max: 0,
	});
	const [plazoRange, setPlazoRange] = useState<minMax>({
		min: 0,
		max: 0,
	});
	const navigate = useNavigate();

	const locStorage = localStorage.getItem('logusuario');
	const [usuariolog, setUsuariolog] = useState<Usuario>();
	useEffect(() => {
		if (locStorage) {
			const usuariolog = JSON.parse(locStorage);
			setUsuariolog(usuariolog);
		}
	}, [locStorage]);
	const onSubmit: SubmitHandler<FormularioSolicitudes> = async (formData) => {
		try {
			setValue('usuario_Registro', 1);
			if (locStorage) {
				const usuariolog = JSON.parse(locStorage);
				setValue('usuario_Registro', usuariolog.id);
				setValue('idUsuario', usuariolog.id);
				setValue('telefono', usuariolog.telefono);
				const usuariologtoken = localStorage.getItem('token');
				const response = await axios.post(API_IP + '/api/Solicitudes/', formData, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${usuariologtoken}`,
					},
				});
				if (response.status === 201) {
					toast.success('Solicitud Creada Correctamente.');
					navigate('/Principal');
				}
			} else {
				await fetch(
					`${API_IP}/api/Solicitudes/BuscarPorNumero/${formData.telefono}`
				).then(async (data: any) => {
					if (data.status === 404) {
						const usuariologtoken = localStorage.getItem('token');
						const response = await axios.post(
							API_IP + '/api/Solicitudes/',
							formData,
							{
								headers: {
									'Content-Type': 'application/json',
									Authorization: `Bearer ${usuariologtoken}`,
								},
							}
						);
						if (response.status === 201) {
							toast.success('Solicitud Creada Correctamente.');
							navigate('/Principal');
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
	// const downloadDocument = (fileName: string, associatedId: number) => {
	// 	const downloadLink = `${API_IP}/api/DownloadDocument?fileName=${encodeURIComponent(
	// 		fileName
	// 	)}&associatedId=${associatedId}`;

	// 	// Open the download link in a new tab
	// 	window.open(downloadLink, '_blank');
	// };
	const downloadDocument = async (associatedId: number, fileName: string) => {
		const downloadLink = `${API_IP}/api/Attachments/DownloadDocument?fileName=${encodeURIComponent(
			fileName
		)}&associatedId=${associatedId}`;

		try {
			// const response = await fetch(downloadLink);
			const usuariologtoken = localStorage.getItem('token');
			// const response = await axios.get(downloadLink, {
			// 	responseType: 'blob',
			// });
			//const response = await axios.get(downloadLink, {
			//	headers: {
			//		Authorization: `Bearer ${usuariologtoken}`,
			//	},
			//	responseType: 'blob',
			//});
			// fetch downloadlink with authorization header
			const response = await fetch(downloadLink, {
				headers: {
					Authorization: `Bearer ${usuariologtoken}`,
				},
			});

			const blob = await response.blob();

			// Create a URL for the blob
			const blobUrl = URL.createObjectURL(blob);

			// Create a temporary anchor element
			const anchor = document.createElement('a');
			anchor.href = blobUrl;
			anchor.download = fileName;

			// Simulate a click event on the anchor element
			anchor.click();

			// Clean up the URL and anchor element
			URL.revokeObjectURL(blobUrl);
			anchor.remove();
		} catch (error) {
			console.error('Error downloading document:', error);
		}
	};
	const openDocumentInNewTab = async (
		associatedId: number,
		fileName: string
	) => {
		const downloadLink = `${API_IP}/api/Attachments/DownloadDocument?fileName=${encodeURIComponent(
			fileName
		)}&associatedId=${associatedId}`;

		try {
			const usuariologtoken = localStorage.getItem('token');
			// const response = await fetch(downloadLink);
			// const response = await axios.get(downloadLink, {
			// 	responseType: 'blob',
			// });
			const response = await fetch(downloadLink, {
				headers: {
					Authorization: `Bearer ${usuariologtoken}`,
				},
			});
			const blob = await response.blob();

			// Create a URL for the blob
			const blobUrl = URL.createObjectURL(blob);

			// Open the blob URL in a new tab
			const newTab = window.open(blobUrl, '_blank');

			// Clean up the URL
			URL.revokeObjectURL(blobUrl);
		} catch (error) {
			console.error('Error opening document:', error);
		}
	};

	const fetchDocumentMetadataByAssociatedId = async (associatedId: number) => {
		try {
			const usuariologtoken = localStorage.getItem('token');
			const response = await axios.get(
				`${API_IP}/api/Attachments/${associatedId}`,
				{
					headers: {
						Authorization: `Bearer ${usuariologtoken}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			console.error('Error fetching document metadata:', error);
			return [];
		}
	};
	const handleExportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(amortizarData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		const excelBuffer = XLSX.write(workbook, {
			bookType: 'xlsx',
			type: 'array',
		});
		saveAs(
			new Blob([excelBuffer], { type: 'application/octet-stream' }),
			'table.xlsx'
		);
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
			destino: 'Seleccione un destino',
		};
		fetch(API_IP + '/api/Destino')
			.then((response) => response.json())
			.then((data: any) => {
				setDestinos([defaultDestino, ...data]);
			});
		const usuariologtoken = localStorage.getItem('token');
		axios
			.get(API_IP + '/api/Solicitudes/' + id, {
				headers: {
					Authorization: `Bearer ${usuariologtoken}`,
				},
			})
			.then((data: AxiosResponse<FormularioSolicitudes>) => {
				if (data.status === 404) {
					return navigate('/Login');
				}
				if (data.status === 401) {
					return navigate('/Login');
				}
				reset(data.data);
				const selectedDepartamento = departm.find(
					(item: Region) => item.nombre === data.data.departamento
				);
				changemunicipios(selectedDepartamento?.id || 0);
				setValue('municipio', data.data.municipio);
			})
			.catch((error) => {
				console.error('Error fetching user data:', error);
				if (
					error.response?.status === 401 ||
					error.response?.status === 403 ||
					error.response?.status === 404
				) {
					navigate('/Login');
				}
			});
		try {
			const usuariologtoken = localStorage.getItem('token');
			axios
				.get(`${API_IP}/api/SolicitudesDeudas/solicitud?id=${id}&tipo=false`, {
					headers: {
						Authorization: `Bearer ${usuariologtoken}`,
					},
				})
				.then((data: AxiosResponse<DataDeudas[]>) => {
					// console.log(data.data);
					setTableDeudas(data.data);
				});
		} catch (error) {
			console.log(error);
		}
		try {
			const usuariologtoken = localStorage.getItem('token');
			axios
				.get(`${API_IP}/api/SolicitudesDeudas/solicitud?id=${id}&tipo=true`, {
					headers: {
						Authorization: `Bearer ${usuariologtoken}`,
					},
				})
				.then((data: AxiosResponse<DataDeudasAnalista[]>) => {
					// console.log(data.data);
					setTableDeudasAnalista(data.data);
				});
		} catch (error) {
			console.log(error);
		}

		fetchDocumentMetadataByAssociatedId(Number(id)).then((documentMetadata) => {
			setDocumentMetadata(documentMetadata);
		});

		// set documents on selected files if there are fromm
	}, []);
	useEffect(() => {
		const destino = watch('destino_Credito');
		if (watch('destino_Credito')) {
			const selectedDestino = destinos.find(
				(item: any) => item.destino === destino
			);
			if (selectedDestino) {
				setValue('producto', selectedDestino.producto);
			}
		}
	}, [destinos]);
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
	function getYearsAndMonthsPassed(fromDate: Date): string {
		const currentDate = new Date();
		const newFromDate = new Date(fromDate);
		let yearsDiff = currentDate.getFullYear() - newFromDate.getFullYear();
		let monthsDiff = currentDate.getMonth() - newFromDate.getMonth();
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
		return false;
	};

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
	};

	const handleAgregarDeudaAnalista = (data: DataDeudasAnalista) => {
		// console.log(tableDeudasAnalista);
		if (data.tipo === '') {
			return toast.warn('Debe seleccionar un tipo de deuda');
		}
		if (data.refencia === '') {
			return toast.warn('Debe ingresar una referencia');
		}

		setTableDeudasAnalista([...tableDeudasAnalista, data]);
	};

	const handleEliminarDeuda = (id: string) => {
		const newTableDeudas = tableDeudas.filter((item) => item.id !== id);
		setTableDeudas(newTableDeudas);
	};

	const handleEliminarDeudaAnalista = (id: string) => {
		const newTableDeudasAnalista = tableDeudasAnalista.filter(
			(item) => item.id !== id
		);
		setTableDeudasAnalista(newTableDeudasAnalista);
	};
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [modalIsOpen2, setModalIsOpen2] = useState(false);
	const openModal2 = () => {
		setModalIsOpen2(true);
	};
	const closeModal2 = () => {
		setModalIsOpen2(false);
	};

	const openModal = () => {
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
	};
	const [comentarioAnalista, setComentarioAnalista] = useState<string>('');
	const handleSubmitDeudasAnalista = () => {
		//check  selected files
		if (Object.keys(selectedFiles).length < 2) {
			return toast.warn('Por favor adjunte los archivos solicitados');
		}

		toast.warn('Su solicitud esta siendo guardada, por favor espere.');
		try {
			const idSolicitudValue = id;
			const modifiedArray = tableDeudasAnalista.map((item) => {
				// Destructure the object to remove the "id" property
				const { id, ...rest } = item;

				// Add the "idSolicitud" property with the constant value
				return {
					...rest,
					tipoCreada: true,
					idSolicitud: idSolicitudValue,
				};
			});

			const usuariologtoken = localStorage.getItem('token');
			// axios
			// .post(`${API_IP}/api/SolicitudesDeudas`, modifiedArray)
			// .then((response) => {
			// 	// navigate('/Principal');
			// });
			axios
				.post(`${API_IP}/api/SolicitudesDeudas`, modifiedArray, {
					headers: {
						Authorization: `Bearer ${usuariologtoken}`,
					},
				})
				.then((response) => {
					// navigate('/Principal');
				});

			let newStatus = 'En Analisis';
			let formData = getValues();
			formData = {
				...formData,
				estatus: newStatus,
				pasoAgroMoney: true,
			};

			axios
				.patch(API_IP + '/api/Solicitudes/' + id, formData, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${usuariologtoken}`,
					},
				})
				.then((response) => {
					handleUpload2();
				});
		} catch (error) {
			toast.error('Error al guardar la solicitud, por favor intente de nuevo.');
			console.log(error);
		}
	};
	const handleUpload2 = () => {
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
		const usuariologtoken = localStorage.getItem('token');
		axios
			.post(`${API_IP}/api/AttachmentsDeudas?associatedId=${id || 0}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${usuariologtoken}`,
				},
			})
			.then((response) => {
				toast.success('Solicitud Creada Exitosamente.');
				navigate('/Principal');

				// Handle success
			})
			.catch((error) => {
				console.error('API Error:', error);
				// Handle error
			});
		// Now formData contains the selected files without changing their names.
	};
	return (
		<>
			<ModalRRHH
				isOpen={modalIsOpen}
				closeModal={closeModal}
				cuotaFormulario={getValues('cuota_Maxima')}
				nombre={getValues('nombre')}
				idSolicitud={id}
				formMethods={{
					register,
					handleSubmit,
					setValue,
					control,
					watch,
					formState: { errors },
					reset,
					getValues,
				}}
			/>
			<ModalExepcion
				isOpen={modalIsOpen2}
				closeModal={closeModal2}
				cuotaFormulario={getValues('cuota_Maxima')}
				nombre={getValues('nombre')}
				idSolicitud={id}
				formMethods={{
					register,
					handleSubmit,
					setValue,
					control,
					watch,
					formState: { errors },
					reset,
					getValues,
				}}
			/>
			<LayoutCustom>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex gap-y-2 flex-col items-center bg-gray-100 p-4 rounded-lg shadow-lg relative"
				>
					<div className="absolute end-2">
						{usuariolog?.perfil === 'R' &&
							(getValues('estatus') === 'Nueva' ||
								getValues('estatus') === 'En Analisis') && (
								<>
									<Button
										type="button"
										customClassName="bg-green-700 text-white font-semibold"
										onClick={openModal}
									>
										Analisis RRHH
									</Button>
								</>
							)}
						{usuariolog?.perfil === 'M' && getValues('estatus') === 'Excepción' && (
							<>
								<Button
									type="button"
									customClassName="bg-green-700 text-white font-semibold"
									onClick={openModal2}
								>
									Excepción
								</Button>
							</>
						)}
					</div>
					<div className="border-b-2 w-full flex justify-between items-center border-black">
						<p className="text-xl font-semibold flex-grow text-center">
							Precalificado
						</p>
					</div>

					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<Controller
								name="destino_Credito"
								control={control}
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<Select
										options={destinos.map((item: any) => ({
											label: item.destino,
											value: item.destino,
										}))}
										disabled
										value={value}
										placeholder="se"
										label="Destino"
										{...register('destino_Credito')}
										onChange={handleDestinoChange}
									/>
								)}
							/>
						</div>
						<div className="flex flex-col w-full">
							<Controller
								name="producto"
								control={control}
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput
										label="Producto"
										value={value}
										disabled
										{...register('producto')}
									/>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-row gap-2 gap-x-4 w-full flex-wrap sm:flex-nowrap">
						<TextInput label="Monto" disabled value={formatCurrency(watchMonto)} />
						<TextInput label="Plazo" disabled value={watchPlazo} />
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
								rules={{
									required: true,
								}}
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
								disabled
								{...register('observaciones')}
							/>
						</div>
						<div className="flex flex-col w-full ">
							<Controller
								name="total_Interes"
								control={control}
								rules={{
									required: true,
								}}
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
								rules={{
									required: true,
								}}
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
							<div className="flex flex-col ">
								<Button
									onClick={handleGenerarTabla}
									type="button"
									disabled={handleBotonAmortizarDisable()}
									customClassName={`font-semibold text-white ${
										handleBotonAmortizarDisable()
											? 'cursor-not-allowed bg-gray-300'
											: 'bg-green-700  '
									}`}
								>
									Amortizar <FaMoneyBill />
								</Button>
							</div>
							{amortizarData && amortizarData.length > 0 && (
								<div className="flex flex-row justify-end">
									<Button
										onClick={handleExportToExcel}
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
						<div className="flex flex-col w-full">
							<Controller
								name="nombre"
								control={control}
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput disabled label="Nombre" {...register('nombre')} />
								)}
							/>
							{errors.nombre && (
								<p className="text-xs mt-2 ml-2 text-red-600">El nombre es requerido</p>
							)}
						</div>
						<div className="flex flex-col w-full">
							<Controller
								name="segundoNombre"
								control={control}
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput
										disabled
										label="Segundo Nombre"
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput disabled label="Apellido" {...register('apellido')} />
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput
										disabled
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput disabled label="DNI" {...register('dni')} />
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput disabled label="Profesión" {...register('profesion')} />
								)}
							/>
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
								rules={{ required: true }}
								render={({ field: { value, onChange } }) => (
									<TextInput
										disabled
										label="Correo Personal"
										{...register('correoPersonal')}
									/>
								)}
							/>
							{errors.correoPersonal && (
								<p className="text-xs mt-2 ml-2 text-red-600">El correo es requerido</p>
							)}
						</div>
						<div className="flex flex-col w-full">
							<Controller
								name="telefono"
								control={control}
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput disabled label="Teléfono" {...register('telefono')} />
								)}
							/>
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
									<TextInput
										disabled
										label="Estado Civil"
										{...register('estadoCivil')}
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
										disabled
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
										disabled
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
								render={({ field: { value, onChange } }) => (
									<TextInput
										disabled
										label="Teléfono Cónyuge"
										{...register('telConyuge')}
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
										disabled
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<Select
										disabled
										options={paises.map((item: any) => ({
											label: item,
											value: item,
										}))}
										defaultValue={'Honduras'}
										placeholder="se"
										label="País"
										{...register('pais')}
										onChange={handlePaisChange}
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<Select
										disabled
										options={departm.map((item: any) => ({
											label: item.nombre,
											value: item.nombre,
										}))}
										label="Departamento"
										{...register('departamento')}
										onChange={handleDepartamentoChange}
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<Select
										disabled
										options={municipios.map((item: any) => ({
											label: item.nombre,
											value: item.nombre,
										}))}
										label="Municipio"
										{...register('municipio')}
										onChange={handleMunicipioChange}
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<DatePicker
										disabled
										className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
										maxDate={new Date()}
										showYearDropdown
										value={moment(value).format('DD/MM/YYYY')}
										selected={new Date(value)}
										onChange={(date) => {
											onChange(date);
										}}
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput
										disabled
										label="Nacionalidad"
										{...register('nacionalidad')}
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<Select
										disabled
										options={[
											{ label: 'Masculino', value: 'Masculino' },
											{ label: 'Femenino', value: 'Femenino' },
										]}
										label="Género"
										{...register('genero')}
									/>
								)}
							/>
							{errors.genero && (
								<p className="text-xs mt-2 ml-2 text-red-600">El genero es requerido</p>
							)}
						</div>
						{/* 
						<div className="flex flex-col w-full">
							<Controller
								name="tipoDePersona"
								control={control}
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<Select
										value={value}
										options={[
											{ label: 'Natural', value: 'Natural' },
											{ label: 'Juridica', value: 'Juridica' },
										]}
										label="Tipo de persona"
										{...register('tipoDePersona')}
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
					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<Controller
								name="direccion"
								control={control}
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput
										disabled
										label="Dirección de Vivienda"
										{...register('direccion')}
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput
										disabled
										label="Lugar de Trabajo"
										{...register('empresa')}
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<>
										<DatePicker
											className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
											maxDate={new Date()}
											disabled
											showYearDropdown
											value={moment(value).format('DD/MM/YYYY')}
											selected={new Date(value)}
											onChange={(date) => {
												onChange(date);
											}}
										/>
										<p className="text-xs mt-2 ml-2">{getYearsAndMonthsPassed(value)}</p>
									</>
								)}
							/>
						</div>
						<div className="flex flex-col w-full">
							<Controller
								control={control}
								name="cargo"
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput disabled label="Cargo que Ocupa" {...register('cargo')} />
								)}
							/>
							{errors.cargo && (
								<p className="text-xs mt-2 ml-2 text-red-600">El cargo es requerido</p>
							)}
						</div>
						<div className="flex flex-col w-full">
							<Controller
								control={control}
								name="telEmpresa"
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput
										disabled
										label="Telefono de Trabajo"
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput
										disabled
										label="Tipo de Contrato"
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput disabled label="Jefe Inmediato" {...register('jefeIn')} />
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<TextInput
										disabled
										label="Gerente de RRHH"
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
								rules={{
									required: true,
								}}
								render={({ field: { value, onChange } }) => (
									<input
										className="w-6 h-6 mr-1"
										disabled
										type="checkbox"
										checked={value}
										onChange={onChange}
									/>
								)}
							/>
							Soy Empleado de "Grupo Cadelga"
						</div>
						{watch('esCadelga') ? (
							<>
								<div className="flex flex-row w-full">
									<Controller
										control={control}
										name="telJefeIn"
										rules={{
											required: true,
										}}
										render={({ field: { value, onChange } }) => (
											<TextInput
												disabled
												label={'Telefono de Jefe Inmediato'}
												{...register('telJefeIn')}
											/>
										)}
									/>
								</div>
								<div className="flex flex-row w-full">
									<Controller
										control={control}
										name="correoJefeIn"
										rules={{
											required: true,
										}}
										render={({ field: { value, onChange } }) => (
											<TextInput
												disabled
												label={'Correo de Jefe Inmediato'}
												{...register('correoJefeIn')}
											/>
										)}
									/>
								</div>
							</>
						) : (
							<> </>
						)}
					</div>
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
										disabled
										{...register('referencia1')}
									/>
								)}
							/>
						</div>
						<div className="flex flex-col w-full">
							<Controller
								name="noReferencia1"
								control={control}
								rules={{ required: true }}
								render={({ field: { value, onChange } }) => (
									<TextInput
										label="Numero de Referencia Personal"
										disabled
										{...register('noReferencia1')}
									/>
								)}
							/>
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
										label="Referencia Laboral"
										disabled
										{...register('referencia2')}
									/>
								)}
							/>
						</div>
						<div className="flex flex-col w-full">
							<Controller
								name="noReferencia2"
								control={control}
								rules={{ required: true }}
								render={({ field: { value, onChange } }) => (
									<TextInput
										label="Numero de Referencia Laboral"
										disabled
										{...register('noReferencia2')}
									/>
								)}
							/>
						</div>
					</div>
					<div className="flex gap-2 w-full flex-wrap justify-center">
						<div className="mt-2 mb-2 border-b-2 w-full flex justify-center border-black">
							<p className="text-xl font-semibold">Adjuntar Archivos</p>
						</div>

						<div className="flex w-full mt-4 justify-center">
							<div className="flex flex-col justify-center">
								<table className="w-full border-collapse border">
									<colgroup>
										<col className="w-1/3" />
										<col className="w-1/3" />
										<col className="w-1/3" />
									</colgroup>
									<thead>
										<tr>
											<th className="py-2 border">Nombre</th>
											<th className="py-2 border">Ver</th>
											<th className="py-2 border">Descargar</th>
										</tr>
									</thead>
									<tbody>
										{documentMetadata.map((metadata: any) => (
											<tr key={metadata.id}>
												<td className="border p-2 truncate">{metadata.fileName}</td>
												<td className="border p-2 text-center">
													<button
														onClick={() =>
															openDocumentInNewTab(Number(id), metadata.fileName)
														}
													>
														<FaEye />
													</button>
												</td>
												<td className="border p-2 text-center">
													<button
														onClick={() => downloadDocument(Number(id), metadata.fileName)}
													>
														<FaFileDownload />
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<IngresarDeudas
						data={tableDeudas}
						id="tableDeudas"
						handleAgregarDeuda={handleAgregarDeuda}
						handleEliminarDeuda={handleEliminarDeuda}
						disabled
					/>
					{usuariolog?.perfil === 'M' &&
						(getValues('estatus') === 'Nueva' ||
							getValues('estatus') === 'En Analisis') && (
							<>
								<IngresarDeudasAnalista
									data={tableDeudasAnalista}
									id="tableDeudasAnalista"
									handleAgregarDeuda={handleAgregarDeudaAnalista}
									handleEliminarDeuda={handleEliminarDeudaAnalista}
									selectedFiles={selectedFiles}
									setSelectedFiles={setSelectedFiles}
									solicitudId={id || ''}
								/>
								{/* textinput that saves a coment */}
								<div className="flex flex-col w-full">
									<Controller
										name="comentariosAnalista"
										control={control}
										rules={{
											required: true,
										}}
										render={({ field: { value, onChange } }) => (
											<TextInput
												label="Comentarios"
												value={value}
												{...register('comentariosAnalista')}
											/>
										)}
									/>
								</div>
								<div className="flex flex-row gap-2 w-full justify-center flex-wrap sm:flex-nowrap">
									<Button
										type="button"
										customClassName={clsx('font-semibold text-white', 'bg-green-700 ')}
										onClick={() => handleSubmitDeudasAnalista()}
									>
										Salvar
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
							</>
						)}
				</form>
			</LayoutCustom>
		</>
	);
};

export default NuevaSlt2;
