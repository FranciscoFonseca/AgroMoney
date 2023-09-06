export interface Usuario {
	idUsuario: number;
	nombre: string;
	apellido: string;
	password: string;
	correo: string;
	telefono: string;
	tipoPersona: string;
	tipo: string;
	perfil: string;
	estatus: string;
	fecha_Registro: string;
	sms: string;
	sync: string;
	empresa?: string;
	token?: string;
}

export const exampleUsuario: Usuario = {
	idUsuario: 0,
	nombre: '',
	apellido: '',
	password: '123456',
	correo: '',
	telefono: '',
	tipoPersona: '',
	tipo: 'Empleado',
	perfil: 'E',
	estatus: 'A',
	fecha_Registro: new Date().toISOString(),
	sms: 'Y',
	sync: 'N',
	empresa: '',
};
