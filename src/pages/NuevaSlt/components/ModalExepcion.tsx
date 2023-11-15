import React, { useState } from 'react';
import Modal from 'react-modal';
import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/Button/Button';
import axios from 'axios';
import API_IP from '../../../config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

Modal.setAppElement('#root');
interface ModalProps {
	isOpen: boolean;
	closeModal: () => void; // Define the type of closeModal function
	nombre?: string;
	cuotaFormulario?: number;
	formMethods: any;
	idSolicitud?: string;
}

const ModalExepcion: React.FC<ModalProps> = ({
	isOpen,
	closeModal,
	formMethods,
	idSolicitud = 0,
}) => {
	const { getValues } = formMethods;

	const [comment, setComment] = useState('');
	const navigate = useNavigate();

	const handleRechazar = async () => {
		if (comment === '' || comment === null || comment === undefined) {
			return toast.error('Debe agregar un comentario');
		}

		try {
			const data = {
				estatus: 'Rechazada',
				comentariosExcepcion: comment,
			};
			// axios.patch('http://localhost:3001/rrhh', data);
			let formData = getValues();
			formData = {
				...formData,
				...data,
			};
			await axios.patch(API_IP + '/api/Solicitudes/' + idSolicitud, formData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			toast.success('Solicitud actualizada con exito');
			setTimeout(() => {
				navigate('/Principal');
			}, 1000);
		} catch (error) {
			toast.error('Error al actualizar la solicitud');
			console.error(error);
		}
	};
	const handleGuardar = async () => {
		if (comment === '' || comment === null || comment === undefined) {
			return toast.error('Debe agregar un comentario');
		}

		try {
			const data = {
				estatus: 'En Comite',
				comentariosExcepcion: comment,
			};
			// axios.patch('http://localhost:3001/rrhh', data);
			let formData = getValues();
			formData = {
				...formData,
				...data,
			};
			await axios.patch(API_IP + '/api/Solicitudes/' + idSolicitud, formData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			toast.success('Solicitud actualizada con exito');
			setTimeout(() => {
				navigate('/Principal');
			}, 1000);
		} catch (error) {
			toast.error('Error al actualizar la solicitud');
			console.error(error);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			contentLabel="ModalExepcion"
			style={{
				overlay: {
					backgroundColor: 'rgba(0,0,0,0.5)',
				},
				content: {
					backgroundColor: '#fff',
					margin: 'auto',
					width: '520px',
					height: '300px',
					border: '1px solid #ccc',
					borderRadius: '4px',
					outline: 'none',
					padding: '20px',
					overflow: 'hidden',
				},
			}}
		>
			<div className="w-full flex justify-between">
				<div className="flex items-center">
					<h1 className="text-3xl">Excepción de Credito</h1>
				</div>
				<button onClick={closeModal} className="text-lg">
					X
				</button>
			</div>
			<div className="flex gap-y-2 flex-col mt-2">
				<p className="text-xl">
					Esta solicitud de crédito excede el 40% de relación Cuota/Salario. Desea
					enviarla al Comité de Crédito.
				</p>
				<div className="flex w-full">
					<div className="flex w-full">
						<TextInput
							label="Comentario"
							name="comentario"
							customClassName="w-full"
							onChange={(e) => setComment(e.target.value)}
						/>
					</div>
				</div>

				<div className="flex justify-end gap-2 mt-4">
					<Button
						type="button"
						customClassName="bg-green-700 font-semibold text-white"
						onClick={handleRechazar}
					>
						Rechazar
					</Button>

					<Button
						type="button"
						customClassName="bg-blue-700 font-semibold text-white"
						onClick={handleGuardar}
					>
						Enviar a Comite
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ModalExepcion;
