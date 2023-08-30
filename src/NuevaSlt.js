import React, { useState, useEffect, useRef } from 'react';
import './Principal.css';
import Layout from './components/shared/Layout';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import API_IP from './config';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { departm, munic, paises } from './constants/departamentos';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Button from './components/Button/Button';
import { FaFileExcel } from 'react-icons/fa';

function Principal() {
	const [pais, setPais] = useState('');
	const [depart, setDepart] = useState('');
	const [muni, setMuni] = useState('');
	const [fechaSeleccionada, setFechaSeleccionada] = useState('');
	const [fechaNacimiento, setfechaNacimiento] = useState('');
	const [empresa, setEmpresa] = useState('');
	const [nombre, setNombre] = useState('');
	const [Sgnombre, setSgNombre] = useState('');
	const [apellido, setApellido] = useState('');

	const [destinos, setDestinos] = useState([]);
	const [selectedDestino, setSelectedDestino] = useState(null);
	const [producto, setProducto] = useState(null);
	const [plazo, setPlazo] = useState(1);
	const [minimo, setMinimo] = useState(0);
	const [maximo, setMaximo] = useState(0);
	const [tiempomx, setTiempomx] = useState(0);
	const [interes, setInteres] = useState(0);
	const [totalpg, setTotalpg] = useState(0);
	//   const [observacion, setObservacion] = useState("");

	const [rangeval, setRangeval] = useState(0);
	const [rangesal, setRangesal] = useState(0);
	const [rangecuo, setRangecuota] = useState(1);
	const [monthDifference, setMonthDifference] = useState(null);
	const [CuotaMx, setCuotaMx] = useState(0);
	const [genero, setGenero] = useState('');
	const [showReferencias, setShowReferencias] = useState(false);
	const [tablag, setTablag] = useState([]);
	const currentDate = new Date();
	const [validarAmortizacion, setValidarAmortizacion] = useState(true);

	//const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");

	const { ids } = useParams();

	useEffect(() => {
		fetch('http://' + API_IP + '/api/Destino')
			.then((response) => response.json())
			.then((data) => {
				setDestinos(data);
			});
	}, []);

	useEffect(() => {
		const usuariolog = JSON.parse(localStorage.getItem('logusuario'));
		if (usuariolog) {
			//setEmpresa(usuariolog.empresa);
			// setNombre(usuariolog.nombre);
			// setApellido(usuariolog.apellido);
			// Agrega información adicional a formData
			setFormData((prevFormData) => ({
				...prevFormData,
				IdUsuario: usuariolog.idUsuario,
				Nombre: usuariolog.nombre,
				Usuario_Registro: usuariolog.idUsuario,
				Empresa: usuariolog.empresa,
				Telefono: usuariolog.telefono,
			}));
		}
	}, []);

	const [formData, setFormData] = useState({
		IdSolicitud: '0',
		IdUsuario: '',
		Nombre: '',
		SegundoNombre: '',
		Apellido: '',
		SegundoApellido: '',
		DNI: '',
		Telefono: '',
		Empresa: '',
		Antiguedad: '',
		FechaNacimiento: '',
		Comentarios: '',
		Genero: '',
		Contrato: '',
		Cargo: '',
		Direccion: '',
		Pais: '',
		Departamento: '',
		Municipio: '',
		Destino_Credito: '',
		Monto: 0.0,
		Plazo: 0,
		Cuota_Maxima: 0,
		Total_Pagar: 0.0,
		Tasa_Interes: 0.0,
		Total_Interes: 0.0,
		Observaciones: '',
		Estatus: 'Nueva',
		Usuario_Registro: 0,
		Fecha_Registro: currentDate,
		UsuarioUpd: 0,
		FechaUpd: currentDate,
		SMS: 'Y',
		Sync: 'N',
		TelEmpresa: 0,
	});
	useEffect(() => {
		setTabla([]);
	}, [selectedDestino, tiempomx, interes, rangeval, rangesal, rangecuo]);

	useEffect(() => {
		formData.Cuota_Maxima = 0;
		formData.Total_Interes = 0;
		setTotalpg(0);
		setCuotaMx(0);
	}, [selectedDestino]);

	useEffect(() => {
		if (ids > 0) {
			fetch('http://' + API_IP + '/api/Solicitudes/' + ids)
				.then((response) => response.json())
				.then((data) => {
					// Agrega información adicional a formData
					setFormData((prevFormData) => ({
						...prevFormData,
						IdUsuario: data.idUsuario,
						Nombre: data.nombre,
						SegundoNombre: data.segundoNombre,
						Apellido: data.apellido,
						Correo: data.correo,
						Empresa: data.empresa,
						Telefono: data.telefono,
						Monto: data.monto,
						Perfil: data.perfil,
						fecha_Registro: data.fecha_Registro,
						Sync: data.sync,
						SMS: data.sms,
						Tipo: data.tipo,
						Password: data.password,
						Estatus: data.estatus,
					}));
					setRangeval(data.monto);
					setSelectedDestino(data.destino_Credito);
				})

				.catch((error) => {
					console.error('Error fetching user data:', error);
				});
		}
	}, []);

	const handleDestinoChange = (event) => {
		const idDestino = parseInt(event.target.value);
		const selected = destinos.find((dest) => dest.idDestino === idDestino);
		setShowReferencias(
			selected ? selected.destino === 'Consolidación de deuda' : false
		);

		formData.Destino_Credito = selected ? selected.destino : '';
		setSelectedDestino(selected);
		setProducto(selected ? selected.producto : '');
		setPlazo(selected ? selected.plazo : '0');
		setRangecuota(1);
		setMinimo(selected ? selected.minimo : '0');
		setMaximo(selected ? selected.maximo : '0');
		setTiempomx(selected ? selected.plazo : '0');
		setInteres(selected ? selected.interes + '%' : '0%');
		formData.Tasa_Interes = selected ? selected.interes : 0.0;
		setRangesal(0);
		setRangeval(0);
	};
	const Tipos = ['Institucion', 'Comercial', 'Internos'];

	const generos = ['Masculino', 'Femenino'];
	const incluir = ['Si', 'No'];
	const contratos = ['Permanente', 'Por contrato'];

	const handleDateChange = (date) => {
		setFechaSeleccionada(date);

		formData.Antiguedad = date;

		const differenceInMonths =
			(currentDate.getFullYear() - date.getFullYear()) * 12 +
			(currentDate.getMonth() - date.getMonth());

		if (differenceInMonths > 12) {
			setMonthDifference(
				`${Math.floor(differenceInMonths / 12)} año ${
					currentDate.getMonth() - date.getMonth()
				} mes${differenceInMonths !== 1 ? 'es' : ''}`
			);
		} else {
			setMonthDifference(
				`${differenceInMonths} mes${differenceInMonths !== 1 ? 'es' : ''}`
			);
		}
	};

	const handleFechaNcChange = (date) => {
		setfechaNacimiento(date);

		formData.FechaNacimiento = date;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleChangeG = (e) => {
		const { name, value } = e.target;

		setFormDataG({ ...formDataG, [name]: value });
	};

	const handleSalarioChange = (event) => {
		const value = parseInt(event.target.value);
		setRangesal(value);
		event.target.style.background = `linear-gradient(to right, #f38000 0%, #f38000 ${
			((rangesal - 0) / (100000 - 0)) * 100
		}%, #f5f5f5 ${((rangesal - 0) / (100000 - 0)) * 100}%, #f5f5f5 100%)`;

		const valor_pago = calcularPago(15 / 100, rangecuo, rangeval);
		formData.Cuota_Maxima = valor_pago;
		setCuotaMx(valor_pago);
		const valor_interes = totalInteres(valor_pago, rangecuo, rangeval);
		formData.Total_Interes = valor_interes;
		const pago_total = parseFloat(valor_interes) + parseFloat(rangeval);
		formData.Total_Pagar = pago_total;
		setTotalpg(pago_total);
	};

	const handlePlazoChange = (event) => {
		const value = parseInt(event.target.value);
		setRangecuota(value);
		event.target.style.background = `linear-gradient(to right, #f38000 0%, #f38000 ${
			((value - 0) / (plazo - 0)) * 100
		}%, #f5f5f5 ${((value - 0) / (plazo - 0)) * 100}%, #f5f5f5 100%)`;

		formData.Plazo = value;
		const valor_pago = calcularPago(15 / 100, value, rangeval);
		formData.Cuota_Maxima = valor_pago;
		setCuotaMx(valor_pago);
		const valor_interes = totalInteres(valor_pago, value, rangeval);
		formData.Total_Interes = valor_interes; // setTotali(valor_interes);
		const pago_total = parseFloat(valor_interes) + parseFloat(rangeval);
		formData.Total_Pagar = pago_total;
		setTotalpg(pago_total);
	};

	const handleProductoChange = (event) => {
		const value = event.target.value;
		setProducto(value);
	};

	const handlePaisChange = (event) => {
		const value = event.target.value;
		formData.Pais = value;
		setPais(value);
	};

	const handleDepartChange = (event) => {
		const depart = event.target.value;
		const nombre_depart = departm.find((dep) => dep.id === parseInt(depart));

		formData.Departamento = nombre_depart.nombre;
		setDepart(depart);
		setMuni('');
	};

	const handleMuniChange = (event) => {
		const value = event.target.value;
		const nombre_muni = munic.find((mun) => mun.id === parseInt(value));

		formData.Municipio = nombre_muni.nombre;
		setMuni(value);
	};

	const goBack = () => {
		window.history.back();
	};

	const handleGeneroChange = (event) => {
		const genero = event.target.value;
		setGenero(genero);
		formData.Genero = genero;
	};

	const handleContratoChange = (event) => {
		const contrato = event.target.value;
		setGenero(contrato);
		formData.Contrato = contrato;
	};

	const handleIncluirChange = (event) => {
		const incluir = event.target.value;
		// setIncluirMonto(incluir);
		formDataG.Incluir = incluir;
	};

	const formatCurrency = (value) => {
		const formatter = new Intl.NumberFormat('en-US');
		const currencySymbol = 'L';
		if (value < 0) return '';
		const newValue = Number(value);
		const formattedValue = newValue.toFixed(2);
		// Use toLocaleString to add commas for thousands and millions
		const formattedCurrency = formatter.format(Number(formattedValue));
		return `${currencySymbol} ${formattedCurrency}`;
	};

	const handleRangeChange = (event) => {
		const value = parseInt(event.target.value);
		setRangeval(value);
		event.target.style.background = `linear-gradient(to right, #f38000 0%, #f38000 ${
			((value - minimo) / (maximo - minimo)) * 100
		}%, #f5f5f5 ${((value - minimo) / (maximo - minimo)) * 100}%, #f5f5f5 100%)`;

		formData.Monto = value;
		const valor_pago = calcularPago(15 / 100, rangecuo, value);
		formData.Cuota_Maxima = valor_pago;
		setCuotaMx(valor_pago);
		const valor_interes = totalInteres(valor_pago, rangecuo, value);
		formData.Total_Interes = valor_interes; //setTotali(valor_interes);
		const pago_total = parseFloat(valor_interes) + parseFloat(value);
		formData.Total_Pagar = pago_total;
		setTotalpg(pago_total);
	};

	const handleInputChange = (name, value) => {};

	function calcularPago(tasa, nper, pv, fv = 0, tipo = 0) {
		console.log(tasa, nper, pv, fv, tipo);
		const r = tasa / 12;
		const q = Math.pow(1 + r, nper);
		const pago = (pv * r) / (1 - Math.pow(1 + r, -nper));
		return pago.toFixed(2);
	}

	function totalInteres(cuota, nmeses, monto) {
		const totalpay = cuota * nmeses;
		const interest = totalpay - monto;
		return interest.toFixed(1);
	}

	const filteredMunicipios = munic.filter(
		(muni) => muni.idDepartamento === parseInt(depart)
	);

	const [tabla, setTabla] = useState([]);

	const generarTabla = () => {
		let toastError = '';
		if (!selectedDestino) {
			toastError += 'Seleccione un destino';
		}
		if (rangeval == 0) {
			if (toastError.length > 0) {
				toastError += ', ';
			}
			toastError += 'Seleccione un monto';
		}
		if (rangecuo == 1) {
			if (toastError.length > 0) {
				toastError += ', ';
			}
			toastError += 'Seleccione un plazo';
		}
		if (CuotaMx / rangesal > 0.3) {
			if (toastError.length > 0) {
				toastError += ', ';
			}
			toastError += 'La cuota no puede ser mayor al 30% de su salario';
		}
		if (toastError !== '') {
			return toast.warn(`${toastError}.`, {
				hideProgressBar: true,
			});
		}

		if (
			!selectedDestino ||
			rangeval == 0 ||
			rangesal == 0 ||
			rangecuo == 1 ||
			CuotaMx / rangesal > 0.3
		) {
			return toast.warn('Complete la información solicitada.', {
				hideProgressBar: true,
			});
		}
		if (rangeval > 0) {
			const montoFloat = rangeval; //parseFloat(monto);
			const interesFloat = 15; //parseFloat(interes);
			const cuotaFloat = parseFloat(CuotaMx);
			const plazoInt = rangecuo; //parseInt(plazo);

			const tasaInteresMensual = 0.0125;
			const saldoInicial = montoFloat;
			let saldoFinal = saldoInicial;
			let interesAcumulativo = 0;

			const datosTabla = [];

			for (let i = 1; i <= plazoInt; i++) {
				const interesPago = saldoFinal * tasaInteresMensual;
				const capitalPago = cuotaFloat - interesPago;
				const saldoFinalPago = saldoFinal - capitalPago;

				interesAcumulativo += interesPago;

				const fechaPago = obtenerFechaPago(i); // Implementa la función para obtener la fecha de pago

				const fila = {
					numeroPago: i,
					fechaPago: fechaPago,
					saldoInicial: saldoFinalPago + capitalPago, //saldoInicial.toFixed(2),
					pagoProgramado: cuotaFloat,
					//pagoAdicional: 0,
					pagoTotal: cuotaFloat,
					capital: capitalPago.toFixed(2),
					interes: interesPago.toFixed(2),
					saldoFinal: saldoFinalPago.toFixed(2),
					interesAcumulativo: interesAcumulativo.toFixed(2),
				};

				datosTabla.push(fila);

				saldoFinal = saldoFinalPago;
			}

			setTabla(datosTabla);
		} else {
			toast.warn('Complete la información solicitada.', {
				hideProgressBar: true,
			});
		}
	};
	const handleExportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(tabla);
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
	const obtenerFechaPago = (numeroPago) => {
		const fechaInicial = new Date(); // Obtén la fecha inicial de tu lógica de amortización

		// Calcula la fecha de pago incrementando el mes según el número de pago
		const fechaPago = new Date(fechaInicial);
		fechaPago.setMonth(fechaPago.getMonth() + numeroPago);

		// Formatea la fecha de pago según tu preferencia
		return moment(fechaPago).format('DD/MM/YYYY');
		const options = { year: 'numeric', month: 'short', day: 'numeric' };
		const fechaPagoFormateada = fechaPago.toLocaleDateString('es-ES', options);

		return fechaPagoFormateada;
	};

	const handleSubmit = async (e) => {
		//e.preventDefault();
		console.log(formData);
		//e.preventDefault();

		try {
			currentDate.setHours(currentDate.getHours() - 6);
			formData.Fecha_Registro = currentDate;
			formData.FechaUpd = currentDate;
			const response = await axios.post(
				'http://' + API_IP + '/api/Solicitudes/',
				formData,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			toast('El registro se completo exitosamente.');
			goBack();

			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	const inputFileRef = useRef(null);

	const handleButtonClick = () => {
		inputFileRef.current.click();
	};

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		const formData = new FormData();
		formData.append('file', file);
		console.log(file);

		try {
			axios
				.post('http://' + API_IP + '/api/SubirArchivo', formData)
				.then((response) => console.log(response.data))
				.catch((error) => console.log(error));
		} catch (error) {
			console.log(error);
		}
	};
	const defaultDataG = {
		Referencia: '',
		Monto: '',
		Tipo: '',
		Incluir: '',
	};

	const [formDataG, setFormDataG] = useState(defaultDataG);

	const goAgregar = () => {
		const nuevoItem = { id: uuidv4(), ...formDataG };
		if (formDataG.Referencia == '') {
			return toast.warn('Ingrese una referencia.', {
				hideProgressBar: true,
			});
		}
		if (formDataG.Monto == '') {
			return toast.warn('Ingrese un monto.', {
				hideProgressBar: true,
			});
		}
		if (formDataG.Tipo == '') {
			return toast.warn('Ingrese un tipo.', {
				hideProgressBar: true,
			});
		}
		if (formDataG.Incluir == '') {
			return toast.warn('Ingrese si desea incluir el monto.', {
				hideProgressBar: true,
			});
		}
		setTablag([...tablag, nuevoItem]);
		setFormDataG(defaultDataG);
	};

	const handleEliminar = (id) => {
		const nuevaTabla = tablag.filter((item) => item.id !== id);
		setTablag(nuevaTabla);
	};

	const TablaG = () => {
		return (
			<div>
				<div className="user-table-container">
					<table className="user-table">
						<thead>
							<tr>
								<th></th>
								<th>Tipo</th>
								<th>Referencia</th>
								<th>Monto</th>
								<th>Incluir</th>
							</tr>
						</thead>
						<tbody>
							{tablag.map((item) => (
								<tr key={item.id}>
									<td className="autosizefit">
										<Link
											style={{ fontSize: 12 }}
											onClick={() => handleEliminar(item.id)}
										>
											Eliminar
										</Link>
									</td>
									<td className="autosizefit">{item.Tipo}</td>
									<td className="autosizefit">{item.Referencia}</td>
									<td className="autosizefit">{formatCurrency(item.Monto)}</td>
									<td className="autosizefit">{item.Incluir}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	};

	return (
		<Layout>
			<h4 style={{ display: 'flex', justifyContent: 'center' }}>
				Formulario de Solicitud
			</h4>

			<div className="principal principal-form" style={{ marginBottom: '1%' }}>
				<form className="principal-form" onSubmit={handleSubmit}>
					<div className="inputs-container">
						<div className="input-container">
							<label htmlFor="dest">Destino:</label>

							<select
								id="dest"
								name="dest"
								value={selectedDestino ? selectedDestino.idDestino : ''}
								onChange={handleDestinoChange}
								className="select"
								style={{ width: '100%', marginBottom: '10px' }}
							>
								<option value="">Seleccione un destino</option>
								{destinos.map((destino) => (
									<option key={destino.idDestino} value={destino.idDestino}>
										{destino.destino}
									</option>
								))}
							</select>
							{/* {selectedDestino && (
                <div>
                  <p>Producto: {selectedDestino.producto}</p>
                </div>
              )} */}
						</div>
						<div className="input-container">
							<label htmlFor="producto">Producto:</label>
							<input
								type="text"
								id="producto"
								readOnly="true"
								name="producto"
								value={producto}
								required
								style={{ width: '100%', marginBottom: '10px' }}
								onChange={handleProductoChange}
							/>
						</div>
					</div>
					<div className="inputs-container">
						<div className="input-container">
							<h6>Monto:{formatCurrency(rangeval)}</h6>
							<input
								type="range"
								min={minimo}
								max={maximo}
								step="50"
								value={rangeval}
								onChange={handleRangeChange}
								style={{
									background: `linear-gradient(to right, #f38000 0%, #f38000 ${
										((rangeval - minimo) / (maximo - minimo)) * 100
									}%, #f5f5f5 ${
										((rangeval - minimo) / (maximo - minimo)) * 100
									}%, #f5f5f5 100%)`,
								}}
							/>
						</div>
						<div className="input-container">
							<h6>Plazo: {rangecuo}</h6>
							<input
								type="range"
								min="1"
								max={plazo}
								step="1"
								onChange={handlePlazoChange}
								value={rangecuo}
								style={{
									background: `linear-gradient(to right, #f38000 0%, #f38000 ${
										((rangecuo - 1) / (plazo - 1)) * 100
									}%, #f5f5f5 ${((rangecuo - 1) / (plazo - 1)) * 100}%, #f5f5f5 100%)`,
								}}
							/>
						</div>
						<div className="input-container">
							<h6>Salario: {formatCurrency(rangesal)}</h6>
							<input
								type="range"
								min="0"
								max="100000"
								step="50"
								value={rangesal}
								onChange={handleSalarioChange}
								style={{
									background: `linear-gradient(to right, #f38000 0%, #f38000 ${
										((rangesal - 0) / (100000 - 0)) * 100
									}%, #f5f5f5 ${((rangesal - 0) / (100000 - 0)) * 100}%, #f5f5f5 100%)`,
								}}
							/>
							{
								<p style={{ color: 'black', fontSize: 11 }}>
									*Su salario es confidencial y no sera guardado, solo se utiliza para
									validar la cuota.
								</p>
							}
						</div>
					</div>
					<div className="inputs-container">
						<div className="input-container">
							<label htmlFor="tiempom">Tiempo Maximo:</label>
							<input
								type="text"
								id="tiempom"
								style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}
								readOnly="true"
								name="tiempom"
								placeholder="tiempo maximo"
								value={tiempomx}
							/>
						</div>

						<div className="input-container">
							<label htmlFor="tasai">Tasa de interes:</label>
							<input
								type="text"
								id="tasai"
								style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}
								readOnly="true"
								name="tasai"
								value={interes}
							/>
						</div>

						<div className="input-container">
							<label htmlFor="Cuota_Maxima">Cuota Maxima:</label>
							<input
								type="text"
								id="Cuota_Maxima"
								style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}
								name="Cuota_Maxima"
								readOnly="true"
								onChange={handleChange}
								value={formatCurrency(formData.Cuota_Maxima)}
							/>

							{CuotaMx / rangesal > 0.3 && (
								<p style={{ color: 'red', fontSize: 12 }}>
									Cuota excede el 30% del salario base
								</p>
							)}
						</div>
					</div>
					<div className="inputs-container">
						<div className="input-container">
							<label htmlFor="obsr">Observaciones:</label>
							<input
								type="text"
								id="Observaciones"
								style={{ fontSize: 14 }}
								name="Observaciones"
								onChange={handleChange}
								placeholder="observaciones"
								value={formData.Observaciones}
							/>
						</div>

						<div className="input-container">
							<label htmlFor="totali">Total interes:</label>
							<input
								type="text"
								id="totali"
								style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}
								readOnly="true"
								name="totali"
								value={formatCurrency(formData.Total_Interes)}
							/>
						</div>

						<div className="input-container">
							<label htmlFor="totalpg">Total a pagar:</label>
							<input
								type="text"
								id="totalpg"
								style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right' }}
								name="totalpg"
								value={formatCurrency(totalpg)}
							/>
						</div>
					</div>
					<div className="principal-form">
						<Button
							onClick={generarTabla}
							type="button"
							customClassName="bg-green-700 font-semibold text-white"
						>
							Amortizar
						</Button>
					</div>
					{tabla.length > 0 && (
						<div className="user-table-container">
							<div style={{ justifyContent: 'end', display: 'flex' }}>
								<Button
									onClick={handleExportToExcel}
									type="button"
									customClassName="bg-green-700 font-semibold text-white"
								>
									Exportar a Excel <FaFileExcel />
								</Button>
							</div>

							<div className="inputs-container">
								<h6>Tabla de amortización</h6>
							</div>

							<table className="user-table">
								<thead style={{ fontSize: '12px' }}>
									<tr>
										<th>Nº Pago</th>
										<th>Fecha de pago</th>
										<th>Saldo inicial</th>
										<th>Pago programado</th>
										<th>Pago total</th>
										<th>Capital</th>
										<th>Interés</th>
										<th>Saldo final</th>
										<th>Interés acumulativo</th>
									</tr>
								</thead>
								<tbody>
									{tabla.map((fila) => (
										<tr key={fila.numeroPago}>
											<td>{fila.numeroPago}</td>
											<td>{fila.fechaPago}</td>
											<td className="align-left">{formatCurrency(fila.saldoInicial)}</td>
											<td className="align-left">{formatCurrency(fila.pagoProgramado)}</td>
											<td className="align-left">{formatCurrency(fila.pagoTotal)}</td>
											<td className="align-left">{formatCurrency(fila.capital)}</td>
											<td className="align-left">{formatCurrency(fila.interes)}</td>
											<td className="align-left">{formatCurrency(fila.saldoFinal)}</td>
											<td className="align-left">
												{formatCurrency(fila.interesAcumulativo)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
					<h5
						style={{
							display: 'flex',
							marginTop: '1%',
							justifyContent: 'center',
						}}
					>
						Datos Generales
					</h5>
					<div className="linea-h"></div>
					<div className="inputs-container">
						<div className="input-container">
							<label htmlFor="nombre">Nombre:</label>
							<input
								type="text"
								id="nombre"
								name="Nombre"
								required
								value={formData.Nombre}
								onChange={handleChange}
								onInput={(e) => {
									e.target.value = e.target.value.replace(/[^a-zA-Zñ ]/g, '');
								}}
							/>
						</div>
						<div className="input-container">
							<label htmlFor="apellido">Apellido:</label>
							<input
								type="text"
								id="apellido"
								name="Apellido"
								required
								value={formData.Apellido}
								onChange={handleChange}
								onInput={(e) => {
									e.target.value = e.target.value.replace(/[^a-zA-Zñ ]/g, '');
								}}
							/>
						</div>
					</div>
					<div className="inputs-container">
						<div className="input-container">
							<label htmlFor="Sgnombre">2do Nombre:</label>
							<input
								type="text"
								id="Sgnombre"
								name="SegundoNombre"
								required
								value={formData.SegundoNombre}
								onChange={handleChange}
								onInput={(e) => {
									e.target.value = e.target.value.replace(/[^a-zA-Zñ ]/g, '');
								}}
							/>
						</div>
						<div className="input-container">
							<label htmlFor="Sgapellido">2do Apellido:</label>
							<input
								type="text"
								id="Sgapellido"
								name="SegundoApellido"
								required
								value={formData.SegundoApellido}
								onChange={handleChange}
								onInput={(e) => {
									e.target.value = e.target.value.replace(/[^a-zA-Zñ ]/g, '');
								}}
							/>
						</div>
					</div>
					<div className="inputs-container">
						<div className="input-container">
							<label htmlFor="dni">DNI:</label>
							<input
								type="text"
								id="dni"
								name="DNI"
								required
								placeholder="0000-0000-00000"
								value={formData.DNI}
								onChange={handleChange}
								onInput={(e) => {
									e.target.value = e.target.value.replace(/[^0-9-]/g, '');
								}}
							/>
						</div>
						<div className="input-container">
							<label htmlFor="Profesion">Profesión:</label>
							<input
								type="text"
								id="Prefesion"
								name="Profesion"
								required
								value={formData.Profesion}
								onChange={handleChange}
								onInput={(e) => {
									e.target.value = e.target.value.replace(/[^a-zA-Zñ ]/g, '');
								}}
							/>
						</div>
					</div>
					<div className="flex flex-col mx-2">
						<label htmlFor="Lugar y Fecha de Nacimiento">
							Lugar y Fecha de Nacimiento:
						</label>
						<div className="inputs-container border rounded-lg">
							<div className="input-container">
								<div>
									<label htmlFor="pais">Pais:</label>
									<select
										id="pais"
										name="Pais"
										required
										value={formData.Pais}
										onChange={handlePaisChange}
										className="select"
									>
										<option value="">Seleccione pais</option>
										{paises.map((pais) => (
											<option key={pais} value={pais}>
												{pais}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="input-container">
								<label htmlFor="depart">Departamento:</label>
								<select
									id="depart"
									name="Departamento"
									value={depart}
									required
									onChange={handleDepartChange}
									className="select"
								>
									<option value="">Seleccione un departamento</option>
									{departm.map((dep, index) => (
										<option key={index} value={dep.id}>
											{dep.nombre}
										</option>
									))}
								</select>
							</div>
							<div className="input-container">
								<label htmlFor="munic">Municipio:</label>

								<select value={muni} required onChange={handleMuniChange}>
									<option value="">Seleccione un municipio</option>
									{filteredMunicipios.map((mun, index) => (
										<option key={index} value={mun.id}>
											{mun.nombre}
										</option>
									))}
								</select>
							</div>
							<div className="input-container">
								<label htmlFor="Fechanc">Fecha Nacimiento:</label>
								<DatePicker
									placeholderText="Fecha nacimiento"
									className="midatepicker"
									selected={fechaNacimiento}
									onChange={handleFechaNcChange}
								></DatePicker>
								{/* <input
                type="date"
                id="date-picker"
                format="dd/mm/yyyy"
                required
                className="midatepicker"
                onChange={(e) => handleFechaNcChange(new Date(e.target.value))}
              /> */}
							</div>
							{/* <div className="input-container">
              <label htmlFor="Lugarnc">Lugar de Nacimiento:</label>
              <input
                type="text"
                id="LugarNacimiento"
                name="LugarNacimiento"
                required
                value={formData.LugarNacimiento}
                onChange={handleChange}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Zñ ]/g, "");
                }}
              />
            </div> */}
						</div>
					</div>
					<div className="inputs-container">
						<div className="input-container">
							<label htmlFor="Fechanc">Nacionalidad:</label>
							<input
								type="text"
								id="Nacionalidad"
								name="Nacionalidad"
								required
								value={formData.Nacionalidad}
								onChange={handleChange}
								onInput={(e) => {
									e.target.value = e.target.value.replace(/[^a-zA-Zñ ]/g, '');
								}}
							/>
						</div>

						<div className="input-container">
							<label htmlFor="Genero">Genero:</label>
							<select
								id="genero"
								name="genero"
								required
								value={formData.Genero}
								onChange={handleGeneroChange}
								className="select"
							>
								<option value="">Genero</option>
								{generos.map((genero) => (
									<option key={genero} value={genero}>
										{genero}
									</option>
								))}
							</select>
						</div>
					</div>
					{/* <div className="inputs-container">
            <div className="input-container">
              <label htmlFor="dni">DNI:</label>
              <input
                type="text"
                id="dni"
                name="DNI"
                required
                placeholder="0000-0000-00000"
                value={formData.DNI}
                onChange={handleChange}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9-]/g, "");
                }}
              />
            </div>
          </div>
          <div className="inputs-container"></div> */}
					<div className="input-container-direc">
						<label htmlFor="Direccion">Dirección de vivienda:</label>
						<input
							type="text"
							id="Direccion"
							name="Direccion"
							required
							value={formData.Direccion}
							onChange={handleChange}
						/>

						{/* <CustomInput
              type="text"
              name="Direccion"
              value={formData.Direccion}
              maxLength={10}
              onChange={handleInputChange}
            /> */}
					</div>
					<div className="inputs-container">
						<div className="input-container">
							<label htmlFor="empresa">Lugar de Trabajo:</label>
							<input
								type="text"
								id="empresa"
								name="Empresa"
								value={formData.Empresa}
								onChange={handleChange}
							/>
						</div>
						<div className="input-container">
							<label htmlFor="fecha">Fecha de ingreso:</label>
							{/* <input
                type="date"
                id="date-picker"
                required
                className="midatepicker"
                onChange={(e) => handleDateChange(new Date(e.target.value))}
              /> */}
							<DatePicker
								placeholderText="Fecha ingreso"
								className="midatepicker"
								selected={fechaSeleccionada}
								onChange={handleDateChange}
							></DatePicker>
							{fechaSeleccionada && <p>Antigüedad: {monthDifference}</p>}
						</div>

						<div className="input-container">
							<label htmlFor="cargo">Cargo que ocupa:</label>
							<input
								type="text"
								id="cargo"
								name="Cargo"
								value={formData.Cargo}
								required
								onChange={handleChange}
							/>
						</div>
						<div className="input-container">
							<label htmlFor="telEmpresa">Telefono:</label>
							<input
								type="text"
								id="telEmpresa"
								name="TelEmpresa"
								value={formData.TelEmpresa}
								required
								onChange={handleChange}
							/>
						</div>
					</div>
					<div className="inputs-container">
						<div className="input-container">
							<label htmlFor="Contrato">Tipo de contrato:</label>
							<select
								id="contrato"
								name="contrato"
								required
								value={formData.Contrato}
								onChange={handleContratoChange}
								className="select"
							>
								<option value="">Seleccione</option>
								{contratos.map((contrato) => (
									<option key={contrato} value={contrato}>
										{contrato}
									</option>
								))}
							</select>
						</div>
						<div className="input-container">
							<label htmlFor="jefe">Jefe inmediato:</label>
							<input
								type="text"
								id="jefein"
								name="JefeIn"
								value={formData.JefeIn}
								onChange={handleChange}
							/>
						</div>
						<div className="input-container">
							<label htmlFor="gerente">Gerente de RRHH:</label>
							<input
								type="text"
								id="gerenterrhh"
								name="Gerenterrhh"
								value={formData.GerenteRRHH}
								required
								onChange={handleChange}
							/>
						</div>
					</div>
					<input
						style={{ fontSize: '12px', marginLeft: '1%', margin: '10px' }}
						type="file"
						multiple
					/>

					{/* linea 2 */}
					<div>
						<h5
							style={{
								display: 'flex',
								justifyContent: 'center',
								marginTop: 20,
							}}
						>
							Ingresar las deudas
						</h5>
						<div className="linea-h"></div>

						<div className="inputs-container">
							<div className="input-container">
								<label htmlFor="banco1">Tipo:</label>
								<select
									id="Tipo"
									name="Tipo"
									required
									value={formDataG.Tipo}
									className="select"
									onChange={handleChangeG}
								>
									<option value="">Seleccione</option>
									{Tipos.map((tipo) => (
										<option key={tipo} value={tipo}>
											{tipo}
										</option>
									))}
								</select>
							</div>

							<div className="input-container">
								<label htmlFor="banco1">Referencia:</label>
								<input
									type="text"
									id="banco1"
									name="Referencia"
									value={formDataG.Referencia}
									onChange={handleChangeG}
									onInput={(e) => {
										e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, '');
									}}
								/>
							</div>
							<div className="input-container">
								<label htmlFor="monto1">Monto:</label>
								<input
									type="text"
									id="monto1"
									style={{ textAlign: 'right' }}
									name="Monto"
									value={formatCurrency(formDataG.Monto)}
									onChange={handleChangeG}
									onInput={(e) => {
										e.target.value = e.target.value.replace(/[^0-9. ]/g, '');
									}}
								/>
							</div>

							<div className="input-container">
								<label htmlFor="incluir">Incluir:</label>
								<select
									id="incluir"
									name="Incluir"
									required
									value={formDataG.Incluir}
									onChange={handleChangeG}
									className="select"
								>
									<option value="">Seleccione</option>
									{incluir.map((inclu) => (
										<option key={inclu} value={inclu}>
											{inclu}
										</option>
									))}
								</select>
							</div>
						</div>

						<button
							style={{ fontSize: '12px', marginLeft: '1%', margin: '5px' }}
							type="button"
							onClick={() => goAgregar()}
						>
							Agregar
						</button>

						<TablaG />

						{/* <div className="inputs-container">
                <div className="input-container">
                  <label htmlFor="banco1">Tipo:</label>
                  <select
                    id="Tipo"
                    name="Tipo"
                    required
                    value={formData.Tipo}
                    className="select"
                    onChange={handleChange}
                  >
                    <option value="">Seleccione</option>
                    {Tipos.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-container">
                  <label htmlFor="banco1">Referencia:</label>
                  <input
                    type="text"
                    id="banco1"
                    name="Referencia"
                    value={FormData.Referencia}
                    onChange={handleChange}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(
                        /[^a-zA-Z ]/g,
                        ""
                      );
                    }}
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="monto1">Monto:</label>
                  <input
                    type="text"
                    id="monto1"
                    style={{ textAlign: "right" }}
                    name="Monto1"
                    onChange={handleChange}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9. ]/g, "");
                    }}
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="gerente">Incluir:</label>

                  <select
                    id="incluir"
                    name="incluir"
                    required
                    value={formData.incluir}
                    onChange={handleIncluirChange}
                    className="select"
                  >
                    <option value="">Seleccione</option>
                    {incluir.map((inclu) => (
                      <option key={inclu} value={inclu}>
                        {inclu}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
   
              <div className="inputs-container">
                <div className="input-container">
                  <label htmlFor="banco1">Tipo:</label>
                  <select
                    id="Tipo"
                    name="Tipo"
                    required
                    value={formData.Tipo}
                    className="select"
                    onChange={handleChange}
                  >
                    <option value="">Seleccione</option>
                    {Tipos.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-container">
                  <label htmlFor="banco1">Referencia:</label>
                  <input
                    type="text"
                    id="banco1"
                    name="Referencia"
                    value={FormData.Referencia}
                    onChange={handleChange}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(
                        /[^a-zA-Z ]/g,
                        ""
                      );
                    }}
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="monto1">Monto:</label>
                  <input
                    type="text"
                    id="monto1"
                    style={{ textAlign: "right" }}
                    name="Monto1"
                    onChange={handleChange}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9. ]/g, "");
                    }}
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="gerente">Incluir:</label>

                  <select
                    id="incluir"
                    name="incluir"
                    required
                    value={formData.incluir}
                    onChange={handleIncluirChange}
                    className="select"
                  >
                    <option value="">Seleccione</option>
                    {incluir.map((inclu) => (
                      <option key={inclu} value={inclu}>
                        {inclu}
                      </option>
                    ))}
                  </select>
                </div>
              </div> */}
					</div>
					<div
						className="principal-form"
						style={{ display: 'flex', justifyContent: 'center' }}
					>
						<button onClick={() => handleSubmit()} type="submit">
							Enviar
						</button>
						<button
							style={{ marginLeft: '10px' }}
							onClick={() => (window.location.href = '/Principal')}
							type="submit"
						>
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</Layout>
	);
}

export default Principal;
