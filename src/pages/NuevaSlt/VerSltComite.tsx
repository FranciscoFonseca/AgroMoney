import React, { useEffect, useState } from 'react';
import API_IP from '../../config';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '../../components/Button/Button';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import axios, { AxiosResponse } from 'axios';
import {
	FormularioSolicitudes,
	FormularioSolicitudesDefault,
} from '../../tipos/formularioSolicitudes';
import { saveAs } from 'file-saver';
import TableComponent, { DataAmortizar } from './components/TableComponent';
import { FaEye, FaFileDownload, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import IngresarDeudas from './components/IngresarDeudas';
import { DataDeudas } from './components/TableDeudas';
import LayoutCustom from '../../components/Navbar/Layout';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import IngresarDeudasAnalista from './components/IngresarDeudasAnalista';
import { DataDeudasAnalista } from './components/TableDeudasAnalista';
import { Usuario } from '../../tipos/Usuario';
import DisplayField from '../../components/DisplayField/DisplayField';
import ModalRechazarAprobar from './components/ModalRechazarAprobar';
import {
	handleDownloadAgroMoney,
	handleDownloadReporteOficial,
} from '../../adjuntos/AddTextToPDF';
import ModalHabilitar from './components/ModalHabilitar';
import { tasaDeInteres } from '../../constants/dataConstants';
import { getMimeType } from '../../tipos/shared';

const VerSltComite = (): JSX.Element => {
	const { id } = useParams();
	const [amortizarData, setAmortizarData] = useState<DataAmortizar[]>([]);
	const [destinos, setDestinos] = useState<any[]>([]);
	const [tableDeudas, setTableDeudas] = useState<DataDeudas[]>([]);
	const [formularioSolicitudes, setFormularioSolicitudes] =
		useState<FormularioSolicitudes>(FormularioSolicitudesDefault);
	const [tableDeudasAnalista, setTableDeudasAnalista] = useState<
		DataDeudasAnalista[]
	>([]);
	const [documentMetadata, setDocumentMetadata] = useState([]);

	const locStorage = localStorage.getItem('logusuario');
	const usuariologtoken = localStorage.getItem('token');
	const [usuarioToken, setUsuarioToken] = useState<string>('');
	const [usuariolog, setUsuariolog] = useState<Usuario>();
	const [selectedFiles, setSelectedFiles] = useState<Record<string, File[]>>({});
	const [comentarioVoto, setComentarioVoto] = useState<string>('');
	const [plazo, setPlazo] = useState<number>(0);
	const [monto, setMonto] = useState<number>(0);
	const navigate = useNavigate();
	useEffect(() => {
		// console.log(locStorage);
		if (locStorage) {
			const usuariolog = JSON.parse(locStorage);
			setUsuariolog(usuariolog);
		}
	}, [locStorage]);

	useEffect(() => {
		if (usuariologtoken) {
			setUsuarioToken(usuariologtoken);
		}
	}, [usuariologtoken]);

	const downloadDocument = async (
		associatedId: number,
		fileName: string,
		uniqueId: string
	) => {
		const downloadLink = `${API_IP}/api/Attachments/DownloadDocument?uniqueId=${encodeURIComponent(
			uniqueId
		)}`;

		try {
			const usuariologtoken = localStorage.getItem('token');
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
		fileName: string,
		uniqueId: string
	) => {
		const downloadLink = `${API_IP}/api/Attachments/DownloadDocument2?uniqueId=${encodeURIComponent(
			uniqueId
		)}`;

		try {
			const usuariologtoken = localStorage.getItem('token');

			const response = await axios.get(downloadLink, {
				method: 'GET',
				responseType: 'blob',
			});

			const contentType = response.headers['content-type'];
			const fileExtension = fileName.split('.').pop(); // Get the file extension from the filename

			// Determine the MIME type based on the file extension
			const mimeType =
				getMimeType(fileExtension || '') || 'application/octet-stream'; // Provide a default MIME type

			const file = new Blob([response.data], {
				type: mimeType,
			});

			const fileURL = URL.createObjectURL(file);
			window.open(fileURL);
		} catch (error) {
			console.error('Error:', error);
			// Handle the error as needed
		}
	};

	const fetchDocumentMetadataByAssociatedId = async (associatedId: number) => {
		try {
			const response = await axios.get(
				`${API_IP}/api/Attachments/${associatedId}`
			);
			return response.data;
		} catch (error) {
			console.error('Error fetching document metadata:', error);
			return [];
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

		axios
			.get(API_IP + '/api/Solicitudes/' + id)
			.then((data: AxiosResponse<FormularioSolicitudes>) => {
				if (data.status === 404) {
					return navigate('/');
				}
				if (data.status === 401) {
					return navigate('/');
				}
				const newFormulario: FormularioSolicitudes = {
					...data.data,
					producto: destinos.find(
						(item: any) => item.destino === data.data.destino_Credito
					)?.producto,
				};
				setFormularioSolicitudes(newFormulario);
			})
			.catch((error) => {
				console.log('error');
				console.log(error);
			});
		axios
			.get(`${API_IP}/api/SolicitudesDeudas/solicitud?id=${id}&tipo=false`)
			.then((data: AxiosResponse<DataDeudas[]>) => {
				// console.log(data.data);
				setTableDeudas(data.data);
			});
		axios
			.get(`${API_IP}/api/SolicitudesDeudas/solicitud?id=${id}&tipo=true`)
			.then((data: AxiosResponse<DataDeudasAnalista[]>) => {
				// console.log(data.data);
				setTableDeudasAnalista(data.data);
			});

		fetchDocumentMetadataByAssociatedId(Number(id)).then((documentMetadata) => {
			setDocumentMetadata(documentMetadata);
		});

		axios.get(`${API_IP}/api/Usuarios/esLider`).then((data) => {
			setEsLider(data.data);
		});
	}, []);

	const [esLider, setEsLider] = useState<string>('false');
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
	function calcularPago(tasa: number, nper: number, pv: number): number {
		const r = tasa / 12;
		const pago = (pv * r) / (1 - Math.pow(1 + r, -nper));
		if (!pago) return 0;
		return pago;
	}
	const handleAprobar = () => {
		let data = {
			...formularioSolicitudes,
			// estatus: 'Aprobado',
		};
		let votos = [];
		if (formularioSolicitudes.votos) {
			votos = JSON.parse(formularioSolicitudes.votos);
		}

		//check if user already voted
		const userAlreadyVoted = votos.find(
			(voto: any) => voto.id === usuariolog?.idUsuario
		);
		if (userAlreadyVoted) {
			return toast.warn('Ya ha votado por esta solicitud');
		}

		votos.push({
			id: usuariolog?.idUsuario,
			nombre: usuariolog?.nombre + ' ' + usuariolog?.apellido,
			telefono: usuariolog?.telefono,
			voto: 'Aprobado',
			comentario: comentarioVoto,
			fecha: moment().format('DD/MM/YYYY hh:mm'),
		});

		//check if all users voted. it will be 3 numbers 99999999 88888888 77777777
		//cuota_Maxima
		//total a pagar
		//total interes

		const cuota = calcularPago(tasaDeInteres / 100, Number(plazo), Number(monto));

		const totalPagar = cuota * Number(plazo);
		const totalInteres = totalPagar - Number(monto);

		data = {
			...data,
			monto: monto,
			plazo: plazo,
			votos: JSON.stringify(votos),
			cuota_Maxima: cuota,
			total_Pagar: totalPagar,
			total_Interes: totalInteres,
		};
		axios
			.patch(
				`${API_IP}/api/Solicitudes/${formularioSolicitudes.idSolicitud}`,
				data
			)
			.then((response) => {
				toast.success('Solicitud Aprobada');
				navigate('/Principal');
			})
			.catch((error) => {
				console.log(error);
				toast.error('Error al aprobar la solicitud');
			});
	};
	const handleRechazar = () => {
		let data = {
			...formularioSolicitudes,
			estatus: 'Rechazado',
		};
		let votos = [];
		if (formularioSolicitudes.votos) {
			votos = JSON.parse(formularioSolicitudes.votos);
		}
		const userAlreadyVoted = votos.find(
			(voto: any) => voto.id === usuariolog?.idUsuario
		);
		if (userAlreadyVoted) {
			return toast.warn('Ya ha votado por esta solicitud');
		}
		votos.push({
			id: usuariolog?.idUsuario,
			nombre: usuariolog?.nombre + ' ' + usuariolog?.apellido,
			telefono: usuariolog?.telefono,
			voto: 'Rechazado',
			comentario: comentarioVoto,
			fecha: moment().format('DD/MM/YYYY hh:mm'),
		});
		const cuota = calcularPago(tasaDeInteres / 100, Number(plazo), Number(monto));

		const totalPagar = cuota * Number(plazo);
		const totalInteres = totalPagar - Number(monto);
		data = {
			...data,
			monto: monto,
			plazo: plazo,
			votos: JSON.stringify(votos),
			cuota_Maxima: cuota,
			total_Pagar: totalPagar,
			total_Interes: totalInteres,
		};
		axios
			.patch(
				`${API_IP}/api/Solicitudes/${formularioSolicitudes.idSolicitud}`,
				data
			)
			.then((response) => {
				toast.success('Solicitud Rechazada');
				navigate('/Principal');
			})
			.catch((error) => {
				console.log(error);
				toast.error('Error al rechazar la solicitud');
			});
	};
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [modalIsOpen2, setModalIsOpen2] = useState(false);
	const [modalText, setModalText] = useState('');
	const openModal = () => {
		setMonto(formularioSolicitudes.monto);
		setPlazo(formularioSolicitudes.plazo);
		setModalIsOpen(true);
	};
	const closeModal = () => {
		setModalIsOpen(false);
	};
	const openModal2 = () => {
		setModalIsOpen2(true);
	};
	const closeModal2 = () => {
		setModalIsOpen2(false);
	};
	const handleModal = (token: string) => {
		const user = usuariolog?.telefono;
		if (
			comentarioVoto === '' ||
			comentarioVoto === null ||
			comentarioVoto === undefined
		) {
			return toast.error('Debe agregar un comentario');
		}
		//comentarioVoto
		if (token === '' || token === null || token === undefined) {
			return toast.error('Coloque su Token');
		}
		axios
			.post(`${API_IP}/api/Usuarios/FortiToken?telefono=${user}&token=${token}`)
			.then((response) => {
				if (response.status === 200) {
					if (modalText === 'Reunion') {
						handleReunion();
					}
					if (modalText === 'Aprobar') {
						handleAprobar();
					} else {
						handleRechazar();
					}
				} else {
					toast.error('Error al comprobar token');
				}
			})
			.catch((error) => {
				toast.error('Error al comprobar token');
			});
	};
	const handleImprimir = () => {
		axios
			.get(`${API_IP}/api/Solicitudes/EncryptNumber/${id}`)
			.then((data: AxiosResponse<any>) => {
				handleDownloadReporteOficial(
					formularioSolicitudes,
					data.data.encryptedData
				);
			});
	};
	const handleReunion = () => {
		const data = {
			...formularioSolicitudes,
			habilitadoExcepcion: false,
			excepcion: true,
			votos: null,
		};
		axios
			.patch(
				`${API_IP}/api/Solicitudes/${formularioSolicitudes.idSolicitud}`,
				data
			)
			.then((response) => {
				// navigate('/Principal');
				//location.reload();
				toast.success('Solicitud Llamada a Reunion');
				location.reload();
			})
			.catch((error) => {
				console.log(error);
				toast.error('Error al habilitar la solicitud');
			});
	};
	const handleHabilitar = () => {
		const data = {
			...formularioSolicitudes,
			habilitadoExcepcion: true,
		};
		axios
			.patch(
				`${API_IP}/api/Solicitudes/${formularioSolicitudes.idSolicitud}`,
				data
			)
			.then((response) => {
				// navigate('/Principal');
				//location.reload();
				toast.success('Solicitud Habilitada');
				location.reload();
			})
			.catch((error) => {
				console.log(error);
				toast.error('Error al habilitar la solicitud');
			});
	};
	return (
		<>
			<ModalRechazarAprobar
				isOpen={modalIsOpen}
				closeModal={closeModal}
				titleText={modalText}
				handler={handleModal}
				flagExepcion={formularioSolicitudes.excepcion}
				comentarioVoto={comentarioVoto}
				setComentarioVoto={setComentarioVoto}
				monto={monto}
				plazo={plazo}
				setMonto={setMonto}
				setPlazo={setPlazo}
				esLider={esLider}
				tamaño={esLider === 'True' ? '520px' : '400px'}
			/>
			<ModalHabilitar
				isOpen={modalIsOpen2}
				closeModal={closeModal2}
				handler={handleHabilitar}
			/>

			<LayoutCustom>
				<div className="flex gap-y-2 flex-col items-center bg-gray-100 p-4 rounded-lg shadow-lg relative">
					<div className="border-b-2 w-full flex justify-between items-center border-black">
						<p className="text-xl font-semibold flex-grow text-center">
							Precalificado
						</p>
						{formularioSolicitudes.estatus === 'En Comite' &&
							formularioSolicitudes.excepcion &&
							formularioSolicitudes.habilitadoExcepcion && (
								<div className="absolute end-2 gap-2 bg-gray-100">
									<Button
										type="button"
										customClassName="bg-red-700 text-white font-semibold "
										onClick={() => {
											setModalText('Rechazar');
											openModal();
										}}
										// onClick={handleRechazar}
									>
										Rechazar
									</Button>
									<Button
										type="button"
										customClassName="bg-green-700 text-white font-semibold ml-2"
										// onClick={openModal}
										// onClick={handleAprobar}
										onClick={() => {
											setModalText('Aprobar');
											openModal();
										}}
									>
										Aprobar
									</Button>
									<Button
										type="button"
										customClassName="bg-green-700 text-white font-semibold ml-2"
										// onClick={openModal}
										// onClick={handleAprobar}
										onClick={() => {
											setModalText('Reunion');
											openModal();
										}}
									>
										LLamar a Reunión
									</Button>
								</div>
							)}
						{formularioSolicitudes.estatus === 'En Comite' &&
							!formularioSolicitudes.excepcion && (
								<div className="absolute end-2 gap-2 bg-gray-100">
									{/* <Button
										type="button"
										customClassName="bg-blue-700 text-white font-semibold "
										onClick={() => {
											setModalText('Solicitar Reunión ');
											openModal();
										}}
										// onClick={handleRechazar}
									>
										Solicitar Reunion
									</Button> */}
									<Button
										type="button"
										customClassName="bg-red-700 text-white font-semibold "
										onClick={() => {
											setModalText('Rechazar');
											openModal();
										}}
										// onClick={handleRechazar}
									>
										Rechazar
									</Button>
									<Button
										type="button"
										customClassName="bg-green-700 text-white font-semibold ml-2"
										// onClick={openModal}
										// onClick={handleAprobar}
										onClick={() => {
											setModalText('Aprobar');
											openModal();
										}}
									>
										Aprobar
									</Button>
									<Button
										type="button"
										customClassName="bg-green-700 text-white font-semibold ml-2"
										// onClick={openModal}
										// onClick={handleAprobar}
										onClick={() => {
											setModalText('Reunion');
											openModal();
										}}
									>
										LLamar a Reunión
									</Button>
								</div>
							)}
						{formularioSolicitudes.estatus === 'En Comite' &&
							formularioSolicitudes.excepcion &&
							!formularioSolicitudes.habilitadoExcepcion &&
							esLider === 'True' && (
								<div className="absolute end-2 gap-2 bg-gray-100">
									<Button
										type="button"
										customClassName="bg-blue-700 text-white font-semibold ml-2"
										// onClick={openModal}
										// onClick={handleAprobar}
										onClick={() => {
											openModal2();
										}}
									>
										Habilitar
									</Button>
								</div>
							)}

						{formularioSolicitudes.estatus === 'Aprobado' && (
							<div className="absolute end-2 gap-2 bg-gray-100">
								<Button
									type="button"
									customClassName="bg-green-700 text-white font-semibold "
									onClick={() => {
										handleImprimir();
									}}
									// onClick={handleRechazar}
								>
									Imprimir
								</Button>
								<Button
									type="button"
									customClassName="bg-green-700 text-white font-semibold "
									onClick={() => {
										handleDownloadAgroMoney(formularioSolicitudes);
									}}
									// onClick={handleRechazar}
								>
									Imprimir Autorización Debito
								</Button>
							</div>
						)}
					</div>

					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<DisplayField
								label="Destino"
								text={formularioSolicitudes.destino_Credito}
							/>
						</div>
						{/* <div className="flex flex-col w-full">
							<DisplayField label="Producto" text={formularioSolicitudes.producto} />
						</div> */}
					</div>

					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<DisplayField
								label="Plazo"
								text={formularioSolicitudes.plazo.toString()}
							/>
						</div>
						<div className="flex flex-col w-full">
							<DisplayField
								label="Monto"
								text={formatCurrency(formularioSolicitudes.monto)}
							/>
						</div>
						<div className="flex flex-col w-full">
							<DisplayField
								label="Cuota Máxima"
								text={formatCurrency(formularioSolicitudes.cuota_Maxima)}
							/>
						</div>
					</div>
					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<DisplayField
								label="Observaciones"
								text={formularioSolicitudes.observaciones}
							/>
						</div>
						<div className="flex flex-col w-full ">
							<DisplayField
								label="Total Intereses"
								text={formatCurrency(formularioSolicitudes.total_Interes)}
							/>
						</div>
						<div className="flex flex-col w-full">
							<DisplayField
								label="Total a Pagar"
								text={formatCurrency(formularioSolicitudes.total_Pagar)}
							/>
						</div>
					</div>
					{formularioSolicitudes.votos && (
						<div className="border-b-2 w-full flex justify-between items-center border-black">
							<p className="text-xl font-semibold flex-grow text-center">Votos</p>
						</div>
					)}
					{formularioSolicitudes.votos &&
						JSON.parse(formularioSolicitudes.votos).map((item: any) => {
							console.log(item);
							return (
								<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
									<div className="flex flex-col w-1/6">
										<DisplayField label="Nombre" text={item.nombre} />
									</div>
									<div className="flex flex-col w-1/6 ">
										<DisplayField label="Voto" text={item.voto} />
									</div>
									<div className="flex flex-col w-1/6">
										<DisplayField label="Fecha" text={item.fecha} />
									</div>
									<div className="flex flex-col w-3/6">
										<DisplayField label="Comentario" text={item.comentario} />
									</div>
								</div>
							);
						})}
					<div className="flex flex-col gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-row w-full justify-between gap-x-2">
							{/* <div className="flex flex-col ">
								<Button
									onClick={handleGenerarTabla}
									type="button"
									customClassName={`font-semibold text-white bg-green-700}`}
								>
									Amortizar <FaMoneyBill />
								</Button>
							</div> */}
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
							<DisplayField
								label="Nombres"
								text={`${formularioSolicitudes.nombre} ${formularioSolicitudes.segundoNombre}`}
							/>
						</div>
						<div className="flex flex-col w-full">
							<DisplayField
								label="Apellidos"
								text={`${formularioSolicitudes.apellido} ${formularioSolicitudes.segundoApellido}`}
							/>
						</div>
					</div>

					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<DisplayField label="DNI" text={formularioSolicitudes.dni} />
						</div>
						<div className="flex flex-col w-full">
							<DisplayField label="Profesión" text={formularioSolicitudes.profesion} />
						</div>

						<div className="flex flex-col w-full">
							<DisplayField label="Teléfono" text={formularioSolicitudes.telefono} />
						</div>
					</div>
					<label className="flex w-full">Lugar y Fecha de Nacimiento</label>
					<div className="flex flex-row gap-2 w-full flex-wrap p-2 rounded-lg border sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<DisplayField label="País" text={formularioSolicitudes.pais} />
						</div>
						<div className="flex flex-col w-full">
							<DisplayField
								label="Departamento"
								text={formularioSolicitudes.departamento}
							/>
						</div>
						<div className="flex flex-col w-full">
							<DisplayField label="Municipio" text={formularioSolicitudes.municipio} />
						</div>
						<div className="flex flex-col w-full gap-y-1">
							<DisplayField
								label="Fecha de Nacimiento"
								text={moment(formularioSolicitudes.fechaNacimiento).format(
									'DD/MM/YYYY'
								)}
							/>
						</div>
					</div>
					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<DisplayField
								label="Nacionalidad"
								text={formularioSolicitudes.nacionalidad}
							/>
						</div>
						<div className="flex flex-col w-full">
							<DisplayField label="Género" text={formularioSolicitudes.genero} />
						</div>
						<div className="flex flex-col w-full">
							<DisplayField
								label="Tipo de Persona"
								text={formularioSolicitudes.tipoDePersona}
							/>
						</div>
					</div>
					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<DisplayField
								label="Estado Civil"
								text={formularioSolicitudes.estadoCivil}
							/>
						</div>
						<div className="flex flex-col w-full">
							<DisplayField
								label="Nombre Cónyuge"
								text={formularioSolicitudes.nombreConyuge}
							/>
						</div>
						<div className="flex flex-col w-full">
							<DisplayField
								label="Profesion Cónyuge"
								text={formularioSolicitudes.profesionConyuge}
							/>
						</div>
						<div className="flex flex-col w-full">
							<DisplayField
								label="Teléfono Cónyuge"
								text={formularioSolicitudes.telConyuge}
							/>
						</div>
						<div className="flex flex-col w-full">
							<DisplayField
								label="Dependientes"
								text={formularioSolicitudes.dependientes.toString()}
							/>
						</div>
					</div>
					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<DisplayField
								label="Dirección de Vivienda"
								text={formularioSolicitudes.direccion}
							/>
						</div>
					</div>
					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<DisplayField
								label="Lugar de Trabajo"
								text={formularioSolicitudes.empresa}
							/>
						</div>
						<div className="flex flex-col w-full">
							<DisplayField
								label="Fecha de Ingreso"
								text={moment(formularioSolicitudes.antiguedad).format('DD/MM/YYYY')}
							/>
						</div>
						<div className="flex flex-col w-full">
							<DisplayField
								label="Cargo que Ocupa"
								text={formularioSolicitudes.cargo}
							/>
						</div>
						<div className="flex flex-col w-full">
							<DisplayField
								label="Telefono de Trabajo"
								text={formularioSolicitudes.telEmpresa}
							/>
						</div>
					</div>
					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<DisplayField
								label="Tipo de Contrato"
								text={formularioSolicitudes.contrato}
							/>
						</div>
						<div className="flex flex-col w-full">
							<DisplayField
								label="Jefe Inmediato"
								text={formularioSolicitudes.jefeIn}
							/>
						</div>
						<div className="flex flex-col w-full">
							<DisplayField
								label="Gerente de RRHH"
								text={formularioSolicitudes.gerenteRRHH}
							/>
						</div>
					</div>
					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-row w-full items-center">
							<DisplayField
								label="Es empleado de Grupo Cadelga"
								text={formularioSolicitudes.esCadelga ? 'Si' : 'No'}
							/>
						</div>
						{formularioSolicitudes.esCadelga ? (
							<>
								<div className="flex flex-row w-full">
									<DisplayField
										label="Telefono de Jefe Inmediato"
										text={formularioSolicitudes.telJefeIn}
									/>
								</div>
								<div className="flex flex-row w-full">
									<DisplayField
										label="Correo de Jefe Inmediato"
										text={formularioSolicitudes.correoJefeIn}
									/>
								</div>
							</>
						) : (
							<> </>
						)}
					</div>
					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-row w-full">
							<DisplayField
								label="Referencia Personal"
								text={formularioSolicitudes.referencia1}
							/>
						</div>
						<div className="flex flex-row w-full">
							<DisplayField
								label="Numero de Telefono Referencia Personal"
								text={formularioSolicitudes.noReferencia1}
							/>
						</div>
						<div className="flex flex-row w-full">
							<DisplayField
								label="Relación Referencia Personal"
								text={formularioSolicitudes.relacionReferencia1}
							/>
						</div>
					</div>
					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-row w-full">
							<DisplayField
								label="Referencia Familiar"
								text={formularioSolicitudes.referencia2}
							/>
						</div>
						<div className="flex flex-row w-full">
							<DisplayField
								label="Numero de Telefono Referencia Familiar"
								text={formularioSolicitudes.noReferencia2}
							/>
						</div>
						<div className="flex flex-row w-full">
							<DisplayField
								label="Relación Referencia Familiar"
								text={formularioSolicitudes.relacionReferencia2}
							/>
						</div>
					</div>

					<div className="flex gap-2 w-full flex-wrap justify-center">
						<div className="mt-2 mb-2 border-b-2 w-full flex justify-center border-black">
							<p className="text-xl font-semibold">Documentos</p>
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
															openDocumentInNewTab(
																Number(id),
																metadata.fileName,
																metadata.filePath
															)
														}
													>
														<FaEye />
													</button>
												</td>
												<td className="border p-2 text-center">
													<button
														onClick={() =>
															downloadDocument(
																Number(id),
																metadata.fileName,
																metadata.filePath
															)
														}
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
					<IngresarDeudasAnalista
						data={tableDeudasAnalista}
						id="tableDeudasAnalista"
						handleAgregarDeuda={handleAgregarDeudaAnalista}
						handleEliminarDeuda={handleEliminarDeudaAnalista}
						disabled
						selectedFiles={selectedFiles}
						setSelectedFiles={setSelectedFiles}
						solicitudId={id || ''}
					/>
					<div className="flex gap-2 w-full flex-wrap justify-center mb-8">
						<div className="mt-2 mb-2 border-b-2 w-full flex justify-center border-black">
							<p className="text-xl font-semibold">Observaciones</p>
						</div>
						<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
							<div className="flex flex-col w-full">
								<DisplayField
									label="Comentarios Analista"
									text={formularioSolicitudes.comentariosAnalista || 'Sin comentarios'}
								/>
							</div>
						</div>
						<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
							<div className="flex flex-col w-full">
								<DisplayField
									label="Relación Cuota/Ingreso"
									text={formularioSolicitudes.porcentajeRRHH?.toString() + '%'}
								/>
							</div>
							<div className="flex flex-col w-full">
								<DisplayField
									label="Comentarios RRHH"
									text={formularioSolicitudes.comentariosRRHH || 'Sin comentarios'}
								/>
							</div>
						</div>
						{formularioSolicitudes.comentariosExcepcion.length > 0 && (
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full">
									<DisplayField
										label="Comentarios Excepción"
										text={formularioSolicitudes.comentariosExcepcion || 'Sin comentarios'}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</LayoutCustom>
		</>
	);
};

export default VerSltComite;
