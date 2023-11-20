import axios from 'axios';
import { useParams } from 'react-router-dom';
import API_IP from '../../config';
import { useEffect, useState } from 'react';
import { FormularioSolicitudes } from '../../tipos/formularioSolicitudes';
import { set } from 'lodash';
import { formatCurrency } from '../../functions';

const VerificarSlt = (): JSX.Element => {
	const { id } = useParams();
	const [solicitud, setSolicitud] = useState({} as FormularioSolicitudes);
	useEffect(() => {
		axios
			.get(`${API_IP}/api/solicitudes/verificar/${id}`)
			.then((response) => {
				setSolicitud(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);
//Estimado " + solicitudes.Nombre + ", su solicitud de crédito por "+ solicitudes.Monto +" lps con un plazo de "+ solicitudes.Plazo +" meses ha sido recibida, le estaremos informando sobre el avance. AgroMoney
	return <h1>La solicitud No.{solicitud.idSolicitud} a nombre de {solicitud.nombre} {solicitud.segundoNombre} {solicitud.apellido} {solicitud.segundoApellido}, por un Monto de {formatCurrency(solicitud.monto)} con un plazo de {solicitud.plazo} meses ha sido aprobada.
         </h1>;
};
export default VerificarSlt;
