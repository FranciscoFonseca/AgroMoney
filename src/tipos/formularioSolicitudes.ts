export interface FormularioSolicitudes {
	idSolicitud: number;
	idUsuario: number;
	nombre: string;
	segundoNombre: string;
	apellido: string;
	segundoApellido: string;
	dni: string;
	telefono: string;
	empresa: string;
	antiguedad: Date; // Assuming this is a date string in the format "2023-08-03T21:27:18.520Z"
	fechaNacimiento: Date; // Assuming this is a date string in the format "2023-08-03T21:27:18.520Z"
	lugarNacimiento: string;
	nacionalidad: string;
	genero: string;
	comentarios: string;
	profesion: string;
	direccion: string;
	pais: string;
	cargo: string;
	jefeIn: string;
	gerenteRRHH: string;
	contrato: string;
	departamento: string;
	municipio: string;
	destino_Credito: string;
	monto: number;
	plazo: number;
	cuota_Maxima: number;
	total_Pagar: number;
	tasa_Interes: number;
	total_Interes: number;
	observaciones: string;
	estatus: string;
	usuario_Registro: number;
	fecha_Registro: Date; // Assuming this is a date string in the format "2023-08-03T21:27:18.521Z"
	usuarioUpd: number;
	fechaUpd: Date; // Assuming this is a date string in the format "2023-08-03T21:27:18.521Z"
	sms: string;
	sync: string;
	telEmpresa: string;
	salario?: number;
	telJefeIn: string;
	correoJefeIn: string;
	producto: string;
	esCadelga: boolean;
	tipoDePersona: string;
	///////////////
	estadoCivil: string;
	dependientes: number;
	profesionConyuge: string;
	nombreConyuge?: string;
	///
	fechaConstitucion: Date; // Assuming this is a date string in the format "2023-08-03T21:27:18.521Z"
	correo: string;
	RTN: string;
	contacto: string;
	comentariosAnalista: string;
	comentariosRRHH: string;
	pasoRRHH?: boolean;
	pasoAgroMoney?: boolean;
	votos?: string;
	porcentajeRRHH?: number;
	comentariosExcepcion: string;
	correoPersonal?: string;
	referencia1?: string;
	referencia2?: string;
	noReferencia1?: string;
	noReferencia2?: string;
	telConyuge?: string;
	relacionReferencia1?: string;
	relacionReferencia2?: string;
	excepcion?: boolean;
	habilitadoExcepcion?: boolean;
}
// const estatusSolicitud = [
// 	{ value: 'Nueva', label: 'Nueva' },
// 	{ value: 'En Proceso', label: 'En Proceso' },
// 	{ value: 'Aprobada', label: 'Aprobada' },
// 	{ value: 'Rechazada', label: 'Rechazada' },
// 	{ value: 'Cancelada', label: 'Cancelada' },
// 	{ value: 'Finalizada', label: 'Finalizada' },
// ];

export const FormularioSolicitudesDefault: FormularioSolicitudes = {
	idSolicitud: 0,
	idUsuario: 0,
	nombre: '',
	segundoNombre: '',
	apellido: '',
	segundoApellido: '',
	dni: '',
	telefono: '',
	empresa: '',
	antiguedad: new Date(),
	fechaNacimiento: new Date(),
	comentarios: '',
	genero: '',
	contrato: '',
	cargo: '',
	direccion: '',
	pais: '',
	departamento: '',
	municipio: '',
	destino_Credito: '',
	monto: 0,
	plazo: 0,
	cuota_Maxima: 0,
	total_Pagar: 0,
	tasa_Interes: 0,
	total_Interes: 0,
	observaciones: '',
	estatus: 'Nueva',
	usuario_Registro: 0,
	fecha_Registro: new Date(),
	usuarioUpd: 0,
	fechaUpd: new Date(),
	sms: 'Y',
	sync: 'N',
	telEmpresa: '',
	profesion: '',
	nacionalidad: '',
	jefeIn: '',
	gerenteRRHH: '',
	salario: 0,
	telJefeIn: '',
	correoJefeIn: '',
	lugarNacimiento: '',
	producto: '',
	esCadelga: true,
	tipoDePersona: 'Natural',
	///////
	estadoCivil: '',
	dependientes: 0,
	profesionConyuge: '',
	nombreConyuge: '',
	//
	fechaConstitucion: new Date(),
	correo: '',
	RTN: '',
	contacto: '',
	comentariosAnalista: '',
	pasoRRHH: false,
	pasoAgroMoney: false,
	comentariosRRHH: '',
	porcentajeRRHH: 0,
	comentariosExcepcion: '',
	correoPersonal: '',
	referencia1: '',
	referencia2: '',
	noReferencia1: '',
	noReferencia2: '',
	telConyuge: '',
	relacionReferencia1: '',
	relacionReferencia2: '',
	excepcion: false,
	habilitadoExcepcion: false,
};
