import React, { useEffect, useState } from 'react';
import API_IP from '../../config';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '../../components/Button/Button';
import { jsPDF } from 'jspdf';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import axios, { AxiosResponse } from 'axios';
import {
	FormularioSolicitudes,
	FormularioSolicitudesDefault,
} from '../../tipos/formularioSolicitudes';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
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
import { handleDownloadReporteOficial } from '../../adjuntos/AddTextToPDF';
import ModalHabilitar from './components/ModalHabilitar';

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

	const downloadDocument = async (associatedId: number, fileName: string) => {
		const downloadLink = `${API_IP}/api/Attachments/DownloadDocument?fileName=${encodeURIComponent(
			fileName
		)}&associatedId=${associatedId}`;
		try {
			//	const usuariologtoken = localStorage.getItem('logtoken');
			// const response = await fetch(downloadLink);
			const response = await fetch(downloadLink, {
				headers: {
					Authorization: `Bearer ${usuarioToken}`,
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
		console.log('usuarioToken', usuarioToken);
		try {
			//const usuariologtoken = localStorage.getItem('logtoken');
			// const response = await fetch(downloadLink);
			const response = await fetch(downloadLink, {
				headers: {
					Authorization: `Bearer ${usuarioToken}`,
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
			const response = await axios.get(
				`${API_IP}/api/Attachments/${associatedId}`
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

		axios
			.get(API_IP + '/api/Solicitudes/' + id)
			.then((data: AxiosResponse<FormularioSolicitudes>) => {
				if (data.status === 404) {
					return navigate('/Login');
				}
				if (data.status === 401) {
					return navigate('/Login');
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
			fecha: moment().format('DD/MM/YYYY hh:mm'),
		});

		//check if all users voted. it will be 3 numbers 99999999 88888888 77777777

		data = {
			...data,
			votos: JSON.stringify(votos),
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
			fecha: moment().format('DD/MM/YYYY hh:mm'),
		});

		data = {
			...data,
			votos: JSON.stringify(votos),
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
		axios
			.post(`${API_IP}/api/Usuarios/FortiToken?telefono=${user}&token=${token}`)
			.then((response) => {
				if (response.status === 200) {
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
				console.log(data.data.encryptedData);
				handleDownloadReporteOficial(
					formularioSolicitudes,
					data.data.encryptedData
				);
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
								label="Numero de Referencia Personal"
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
								label="Numero de Referencia Familiar"
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
									text={formularioSolicitudes.comentariosAnalista}
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
									text={formularioSolicitudes.comentariosRRHH}
								/>
							</div>
						</div>
						{formularioSolicitudes.comentariosExcepcion.length > 0 && (
							<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
								<div className="flex flex-col w-full">
									<DisplayField
										label="Comentarios Excepción"
										text={formularioSolicitudes.comentariosExcepcion}
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
