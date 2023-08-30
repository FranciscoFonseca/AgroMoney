export interface LoginFormDto {
	Telefono: number;
	Password: string;
	Token: number;
}

export interface RegisterFormDto {
	idUsuario: number;
	nombre: string;
	apellido: string;
	correo: string;
	telefono: number;
	password: string;
	tipoPersona: string;
	Token: number;
	tipo: string;
	perfil: string;
	estatus: string;
	fecha_Registro: Date;
	sms: string;
	sync: string;
}

export const defaultRegisterFormDto: RegisterFormDto = {
	idUsuario: 0,
	nombre: '',
	apellido: '',
	correo: '',
	telefono: 0,
	password: '',
	tipoPersona: '',
	Token: 0,
	tipo: 'Empleado',
	perfil: 'E',
	estatus: 'A',
	fecha_Registro: new Date(),
	sms: 'N',
	sync: 'y',
};
