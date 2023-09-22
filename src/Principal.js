import React, { useState, useEffect, useRef } from 'react';
import './Principal.css';
import LayoutCustom from './components/Navbar/Layout';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
	Document,
	Page,
	Text,
	View,
	Image,
	StyleSheet,
	pdf,
} from '@react-pdf/renderer';
import { format, isValid } from 'date-fns';
import API_IP from './config';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Principal() {
	const navigate = useNavigate();

	const [users, setUsers] = useState([]);
	const [filtro, setFiltro] = useState('');
	const [filtroFecha, setFiltroFecha] = useState(new Date());
	const inputRef = useRef(null);
	const [fechaSeleccionada, setFechaSeleccionada] = useState('');
	const [resultadosFiltrados, setResultadosFiltrado] = useState([]);
	const [perfil, setPerfil] = useState('');

	const estatus = ['Nueva', 'Aprobada', 'En proceso', 'Rechazada', 'Cancelada'];

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, [filtro]);

	const Field = ({ label, value }) => (
		<View style={styles.field}>
			<Text style={styles.label}>{label}:</Text>
			<Text>{value}</Text>
		</View>
	);

	const usuariolog = JSON.parse(localStorage.getItem('logusuario'));
	useEffect(() => {
		if (!usuariolog) {
			return (window.location.href = '/Login');
		}
		setPerfil(usuariolog.perfil);

		// let url =
		// 	'http://' +
		// 		API_IP +
		// 		'/api/Solicitudes/BuscarPorUsuario?idusuario=' +
		// 		usuariolog.idUsuario +
		// 		'&perfil=' +
		// 		usuariolog.perfil ===
		// 	'R'
		// 		? 'A'
		// 		: usuariolog.perfil;
		const url = `http://${API_IP}/api/Solicitudes/BuscarPorUsuario?idusuario=${usuariolog.idUsuario}&perfil=${usuariolog.perfil}`;
		console.log('datadata', usuariolog.perfil);
		console.log('datadataurl', url);
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setUsers(data);
				setResultadosFiltrado(data);
			})
			.catch((error) => {
				console.error('Error fetching user data:', error);
			});
	}, []);

	const formatCurrency = (value) => {
		return new Intl.NumberFormat('USA', {
			style: 'currency',
			currency: 'HNL',
		}).format(value);
	};

	const styles = StyleSheet.create({
		container: {
			padding: 20,
		},
		page: {
			fontFamily: 'Helvetica',
			fontSize: 12,
			padding: 40,
		},
		header: {
			flexDirection: 'row',
			alignItems: 'center',
			textAlign: 'center',
			marginBottom: 10,
		},
		logo: {
			width: 90,
			height: 50,
			marginRigh: 10,
		},
		title: {
			textAlign: 'center',
			fontSize: 18,
			marginTop: 10,
			fontWeight: 'bold',
			marginBottom: 5,
		},
		content: {
			marginLeft: 20,
			fontSize: 11,
			flexDirection: 'row',
			justifyContent: 'center',
		},
		field: {
			borderBottom: '1pt solid black',
			flexDirection: 'column',
			width: '50%',
			marginRight: 10,
			marginTop: 20,
		},
		label: {
			marginRight: 10,
			marginBottom: 5,
		},
		line: {
			borderBottom: '2pt solid black',
			marginLeft: 20,
			marginRight: 10,
		},
		topline: {
			borderTop: '1pt solid black',
			width: '40%',
		},

		underline: {
			borderBottom: '1pt solid black',
			width: '100%',
		},

		checkbox: {
			width: 10,
			height: 10,
			border: '1pt solid black',
			borderRadius: 2,
			marginRight: 5,
		},
	});

	const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(0);

	const handleSeleccionarSolicitud = (solicitud) => {
		setSolicitudSeleccionada(solicitud);
	};

	const handleInputChange = (event) => {
		setFiltro(event.target.value);
		buscarPorData(filtro);
	};

	const buscarPorFecha = (filtroFecha) => {
		const fechavalida = filtroFecha && isValid(filtroFecha);

		const resultados = users.filter((dato) => {
			const fechaMatch =
				!fechavalida ||
				(filtroFecha &&
					format(new Date(dato.fecha_Registro), 'dd/MM/yyyy') ===
						format(new Date(filtroFecha), 'dd/MM/yyyy'));
			return fechaMatch;
		});

		setResultadosFiltrado(resultados);
	};

	const buscarPorData = (filtro) => {
		const resultados = users.filter((dato) => {
			const nombrefiltro = dato.nombre
				.toLowerCase()
				.includes(filtro.toLowerCase());
			return nombrefiltro;
		});

		setResultadosFiltrado(resultados);
	};

	const buscarPorEstatus = (filtro) => {
		const resultados = users.filter((dato) => {
			const estatus = dato.estatus.toLowerCase().includes(filtro.toLowerCase());
			return estatus;
		});

		setResultadosFiltrado(resultados);
	};

	const handleFechaChange = (date) => {
		setFechaSeleccionada(date);
		setFiltroFecha(date);
		buscarPorFecha(date);
	};

	const handleEstatusChange = (event) => {
		const estatus = event.target.value;
		buscarPorEstatus(estatus);
	};

	const Table = ({ data }) => {
		return (
			<div>
				<div className="user-table-container">
					<table className="user-table">
						<thead>
							<tr>
								<th></th>
								<th>Solicitud</th>
								<th>Fecha</th>
								<th>Nombre</th>
								<th>Apellido</th>
								<th>Telefono</th>
								<th>Destino</th>
								<th>Estatus</th>
								<th>Observación</th>
								<th>Monto</th>
								<th>Interés</th>
								<th>Cuota</th>
								<th>Total Pagar</th>
							</tr>
						</thead>
						<tbody>
							{resultadosFiltrados.map((user) => (
								<tr
									key={user.idSolicitud}
									className={user === solicitudSeleccionada ? 'selecionada' : ''}
									onClick={() => handleSeleccionarSolicitud(user)}
								>
									<td>
										{perfil === 'C' ? (
											<Link to={`/solicitud-reporte/${user.idSolicitud}`}>
												Ver Solicitud
											</Link>
										) : (
											<Link to={`/solicitud/${user.idSolicitud}`}>Ver Solicitud</Link>
										)}
									</td>
									<td>{user.idSolicitud}</td>
									{/* <td>{format(new Date(user.fecha_Registro), 'dd/MM/yyyy HH:mm:ss')}</td> */}
									<td>{format(new Date(user.fecha_Registro), 'dd/MM/yyyy')}</td>
									<td>{user.nombre}</td>
									<td>{user.apellido}</td>
									<td>{user.telefono}</td>
									<td>{user.destino_Credito}</td>
									<td>{user.estatus}</td>
									<td>{user.observaciones}</td>
									<td className="align-left">{formatCurrency(user.monto)}</td>
									<td className="align-left">{formatCurrency(user.total_Interes)}</td>
									<td className="align-left">{formatCurrency(user.cuota_Maxima)}</td>
									<td className="align-left">{formatCurrency(user.total_Pagar)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	};
	if (!usuariolog) {
		return <></>;
	}
	const MyDocument = ({ data }) => {
		return (
			<Document>
				<Page style={styles.section}>
					<View>
						<View>
							<Text style={styles.title}>
								<Image style={styles.logo} src="/agromoney.png" />
								Formulario de Solicitud de Crédito
							</Text>
							<View style={styles.line}></View>
						</View>

						<View style={{ marginLeft: 20, fontSize: 14, fontWeight: 'bold' }}>
							<Text>Información del financiamiento:</Text>
						</View>

						<View style={styles.content}>
							<Field label="Empresa" value={data.empresa} />
							<Field label="Destino del prestamo" value={data.destino_Credito} />
						</View>

						<View style={styles.content}>
							<Field label="Monto del credito" value={formatCurrency(data.monto)} />
							<Field label="Tasa de interes" value={data.tasa_Interes} />
							<Field label="Plazo (meses)" value={data.plazo} />
						</View>

						<View style={{ marginTop: 20 }}></View>
						<View style={styles.line}></View>
						<View style={{ marginLeft: 20, fontSize: 14, fontWeight: 'bold' }}>
							<Text>Información del colaborador:</Text>
						</View>

						<View style={styles.content}>
							<Field label="Nombre" value={data.nombre} />
							<Field label="Segundo Nombre" value={data.segundoNombre} />
							<Field label="Apellido" value={data.apellido} />
							<Field label="Segundo Apellido" value={data.segundoApellido} />
						</View>

						<View style={styles.content}>
							<Field
								label="Fecha de nacimiento"
								value={format(new Date(data.fechaNacimiento), 'dd/MM/yyyy')}
							/>
							<Field label="Lugar de nacimiento" value={data.lugarNacimiento} />
							<Field label="Numero de DNI" value={data.dni} />
							<Field label="Numero de celular" value={data.telefono} />
						</View>

						<View style={styles.content}>
							<Field label="Género" value={data.genero} />
							<Field label="Nacionalidad" value={data.nacionalidad} />
							<Field label="Profesión/Ocupación/Oficio" value={data.profesion} />
						</View>

						<View style={styles.content}>
							<Field label="País" value={data.pais} />
							<Field label="Departamento" value={data.departamento} />
							<Field label="Municipio" value={data.municipio} />
						</View>

						<View
							style={{
								marginLeft: 20,
								marginRight: 10,
								marginTop: 30,
								fontSize: 11,
								flexDirection: 'row',
								justifyContent: 'flex-start',
							}}
						>
							<Text>Dirección de residencia:</Text>
							<Text style={styles.underline}></Text>
						</View>

						<View style={{ marginTop: 20 }}></View>
						<View style={styles.line}></View>
						<View style={{ marginLeft: 20, fontSize: 14, fontWeight: 'bold' }}>
							<Text>Información profesional y laboral:</Text>
						</View>

						<View style={styles.content}>
							<Field
								label="Fecha de ingreso"
								value={format(new Date(data.antiguedad), 'dd/MM/yyyy')}
							/>
							<Field label="Tipo de contracto actual" value={data.contrato} />
							<Field label="Rango Salarial" value=" " />
						</View>

						<View style={styles.content}>
							<Field label="Antigüedad laboral ( en años)" value=" " />
							<Field label="Cargo actual" value={data.cargo} />
						</View>

						<View style={styles.content}>
							<Field label="Nombre del Gerente de RRHH de su empresa" value=" " />
							<Field label="Nombre de su Jefe inmediato" value=" " />
						</View>

						<View
							style={{
								marginLeft: 20,
								marginRight: 20,
								marginTop: 10,
								fontSize: 10,
								flexDirection: 'row',
								justifyContent: 'center',
							}}
						>
							<Text>
								Autorizo a la empresa a realizar las consultas que considere pertinentes
								en el sistema financiero, en los buro y centrales de riesgo crediticio,
								así como en casas comerciales, para verificar mi condición financiera,
								quedando la empresa facultada para negar la solicitud en caso que se
								compruebe la falsedad de la misma, o no cumpla con los requisitos del
								crédito.
							</Text>
						</View>

						<View
							style={{
								marginLeft: 20,
								marginRight: 20,
								marginTop: 60,
								fontSize: 10,
								flexDirection: 'row',
								justifyContent: 'space-between',
							}}
						>
							<Text style={styles.topline}></Text>
							<Text style={styles.topline}></Text>
						</View>

						<View
							style={{
								marginLeft: 20,
								marginRight: 20,
								fontSize: 10,
								flexDirection: 'row',
								justifyContent: 'space-between',
							}}
						>
							<Text style={{ marginLeft: 60 }}>Lugar y fecha</Text>

							<Text style={{ marginRight: 60 }}>Firma del solicitante</Text>
						</View>

						<View
							style={{
								marginRight: 20,
								fontSize: 7,
								marginTop: 10,
								flexDirection: 'row',
								justifyContent: 'flex-end',
							}}
						>
							<Text>Rev1 -2023</Text>
						</View>
					</View>
				</Page>
			</Document>
		);
	};

	const handleOpenPdf = () => {
		if (solicitudSeleccionada) {
			const pdfBlodPromise = pdf(
				<MyDocument data={solicitudSeleccionada} />
			).toBlob();
			pdfBlodPromise.then((blob) => {
				const url = URL.createObjectURL(blob);
				window.open(url);
			});
		}
	};

	const handleCancel = async () => {
		if (solicitudSeleccionada) {
			try {
				const response = await axios.put(
					'http://' +
						API_IP +
						'/api/Solicitudes/CancelarSolicitud?id=' +
						solicitudSeleccionada.idSolicitud +
						'&UsuarioID=' +
						solicitudSeleccionada.usuario_Registro
				);

				alert('La solicitud fue cancelada exitosamente.');

				//console.log(response.data);
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<LayoutCustom>
			<h5>Solicitudes</h5>
			<div className="principal principal-form" style={{ marginBottom: '1%' }}>
				<form className="principal-form">
					{/* <div className="inputs-container">
						<div className="input-container">
							<input
								type="text"
								id="buscar"
								name="buscar"
								ref={inputRef}
								value={filtro}
								onChange={handleInputChange}
								placeholder="Buscar"
								style={{ marginBottom: '5px' }}
							/>
						</div>
						<div className="input-container">
							<DatePicker
								placeholderText="Fecha"
								selected={fechaSeleccionada}
								onChange={handleFechaChange}
							></DatePicker>
						</div>

						<div className="input-container">
							<select
								id="genero"
								name="genero"
								required
								onChange={handleEstatusChange}
								className="select"
							>
								<option value="">Seleccionar estatus</option>
								{estatus.map((estatu) => (
									<option key={estatu} value={estatu}>
										{estatu}
									</option>
								))}
							</select>
						</div>
					</div> */}
					<Table data={users} />
				</form>
				{perfil === 'E' && (
					<button
						type="buttom"
						style={{ marginRight: '1%', fontSize: '12px' }}
						onClick={() => {
							navigate('/nueva-solicitud');
						}}
					>
						Nueva solicitud
					</button>
				)}
				{perfil === 'E' && (
					<button
						type="buttom"
						onClick={handleOpenPdf}
						style={{ marginRight: '1%', fontSize: '12px' }}
					>
						Imprimir solicitud
					</button>
				)}
				{perfil === 'A' && (
					<a
						href={`/Analisis/${solicitudSeleccionada.idSolicitud}`}
						rel="noopener noreferrer"
					>
						<button type="buttom" style={{ fontSize: '12px' }}>
							Analizar solicitud
						</button>
					</a>
				)}
				{perfil === 'E' && (
					<button type="buttom" onClick={handleCancel} style={{ fontSize: '12px' }}>
						Cancelar solicitud
					</button>
				)}
			</div>
		</LayoutCustom>
	);
}

export default Principal;
