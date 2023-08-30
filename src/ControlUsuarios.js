import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/shared/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import API_IP from './config';

function ControlUsuarios(props) {
	const [Empresa, setCompany] = useState('NA');
	const [users, setUsers] = useState([]);

	const { id } = useParams();

	useEffect(() => {
		fetch('http://' + API_IP + '/api/Usuarios/' + id)
			.then((response) => response.json())
			.then((data) => {
				setUsers(data);

				// Agrega información adicional a formData
				setFormData((prevFormData) => ({
					...prevFormData,
					IdUsuario: data.idUsuario,
					Nombre: data.nombre,
					Apellido: data.apellido,
					Correo: data.correo,
					Empresa: data.empresa,
					Telefono: data.telefono,
					Perfil: data.perfil,
					fecha_Registro: data.fecha_Registro,
					Sync: data.sync,
					SMS: data.sms,
					Tipo: data.tipo,
					Password: data.password,
					Estatus: data.estatus,
				}));
			})
			.catch((error) => {
				console.error('Error fetching user data:', error);
			});
	}, [id]);

	const companies = [
		'Cadelga',
		'Fertica',
		'AgroMoney',
		'CATV',
		'Chumbagua',
		'Fertiagrho',
		'Tres Valles',
		'ADN',
	];

	const perfiles = [
		{ id: 'A', nombre: 'Administrador' },
		{ id: 'E', nombre: 'Empleado' },
		{ id: 'R', nombre: 'RRHH' },
		{ id: 'M', nombre: 'AgroMoney' },
	];

	const [formData, setFormData] = useState({
		IdUsuario: '',
		Nombre: '',
		Apellido: '',
		Correo: '',
		Telefono: '',
		Empresa: '',
		Perfil: '',
		Estatus: '',
		Tipo: '',
		fecha_Registro: '',
		Password: '',
		Sync: '',
		SMS: '',
	});

	const goBack = () => {
		window.history.back();
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		//e.preventDefault();
		console.log(formData);
		//e.preventDefault();

		try {
			const response = await axios.put(
				'http://' + API_IP + '/api/Usuarios/' + id,
				formData,
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			alert('El registro se actualizo exitosamente.');

			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<h5>Control de Usuarios</h5>

			<div className="principal principal-form">
				<form className="principal-form" onSubmit={handleSubmit}>
					<div className="inputs-container">
						<div className="input-container">
							<label htmlFor="nombre">Nombre:</label>
							<input
								type="text"
								id="nombre"
								name="Nombre"
								value={formData.Nombre}
								onChange={handleChange}
								required
								style={{ width: '100%', marginBottom: '10px' }}
							/>
						</div>
						<div className="input-container">
							<label htmlFor="apellido">Apellido:</label>
							<input
								type="text"
								id="apellido"
								name="Apellido"
								value={formData.Apellido}
								onChange={handleChange}
								required
								style={{ width: '100%', marginBottom: '10px' }}
							/>
						</div>
					</div>

					<div className="inputs-container">
						<div className="input-container">
							<label htmlFor="correo">Correo:</label>
							<input
								type="email"
								id="correo"
								name="Correo"
								value={formData.Correo}
								onChange={handleChange}
								style={{ width: '100%', marginBottom: '10px' }}
							/>
						</div>
						<div className="input-container">
							<label htmlFor="telefono">Telefono:</label>
							<input
								type="text"
								id="telefono"
								name="Telefono"
								value={formData.Telefono}
								onChange={handleChange}
								required
								onInput={(e) => {
									e.target.value = e.target.value.replace(/[^0-9+-]/g, '');
								}}
								style={{ width: '100%', marginBottom: '10px' }}
							/>
						</div>
					</div>

					<div className="inputs-container">
						<div className="input-container">
							<div className="form-group">
								<label htmlFor="company">Empresa:</label>
								<select
									id="company"
									name="Empresa"
									value={formData.Empresa}
									onChange={handleChange}
									className="form-select"
									required
								>
									<option value="">Seleccione una Empresa</option>
									{companies.map((company) => (
										<option key={company} value={company}>
											{company}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="input-container">
							<label htmlFor="perfil">Perfil:</label>
							<select
								id="company"
								name="Perfil"
								value={formData.Perfil}
								onChange={handleChange}
								className="form-select"
								required
							>
								<option value="">Seleccione una perfil</option>
								{perfiles.map((perfil, index) => (
									<option key={index} value={perfil.id}>
										{perfil.nombre}
									</option>
								))}
							</select>
						</div>
					</div>
					<div
						className="principal-form"
						style={{
							display: 'flex',
							fontSize: '12px',
							justifyContent: 'flex-start',
						}}
					>
						<button onClick={() => handleSubmit()} type="submit">
							Guardar
						</button>
						<button
							style={{ marginLeft: '10px' }}
							type="button"
							onClick={() => goBack()}
						>
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ControlUsuarios;
