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
}

const exampleUsuario: Usuario = {
    idUsuario: 1002,
    nombre: "empleado",
    apellido: "empleado",
    password: "$2a$11$vLZdsgXSbRU6Dk7LFk2N8ulLU8aSq1rtK.1JgDCvpL9vBbj8TXXPW",
    correo: "admin",
    telefono: "99999999",
    tipoPersona: "Natural",
    tipo: "Empleado",
    perfil: "E",
    estatus: "A",
    fecha_Registro: "2023-06-16T17:28:47.817",
    sms: "Y",
    sync: "Y"
};
