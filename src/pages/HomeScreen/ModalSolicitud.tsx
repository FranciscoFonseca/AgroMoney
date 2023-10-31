import React, { useState } from 'react';
import Modal from 'react-modal';
import TextInput from '../../components/TextInput/TextInput';
import Button from '../../components/Button/Button';
import axios from 'axios';
import API_IP from '../../config';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');
interface ModalProps {
	isOpen: boolean;
	closeModal: () => void; // Define the type of closeModal function
}

const ModalSolicitud: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
	const [token, setToken] = useState('');
    const navigate = useNavigate();
	const handlerBuscar = (token: string) => {
		try {
			//remove all but numbers from token
			token = token.replace(/\D/g, '');

			axios
				.get(`${API_IP}/api/Solicitudes/SolicitudByDNI/${token}`)
				.then((res) => {
					if (res.status === 404) {
						return toast.error('Solictud no encontrada2');
					}
					
                    navigate(`/nueva-solicitud/${res.data}`);
					console.log(res.data);
				})
				.catch((error) => {
					console.log(error);
					toast.error('Solictud no encontrada3');
				});
		} catch (error) {
			console.log(error);
			toast.error('Solictud no encontrada4');
		}
	};
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			contentLabel="ModalSolicitud"
			style={{
				overlay: {
					backgroundColor: 'rgba(0,0,0,0.5)',
				},
				content: {
					backgroundColor: '#fff',
					margin: 'auto',
					width: '550px',
					height: '280px',
					border: '1px solid #ccc',
					borderRadius: '4px',
					outline: 'none',
					padding: '20px',
					overflow: 'hidden',
					justifyContent: 'space-between',
					//                     display: flex;
					// flex-direction: column;
					// justify-content: space-between;
					display: 'flex',
					flexDirection: 'column',
				},
			}}
		>
			<div className="w-full flex justify-between">
				<div className="flex items-center">
					<h1 className="text-3xl">Buscar Solicitud</h1>
				</div>
				<button onClick={closeModal} className="text-lg">
					X
				</button>
			</div>
			<div className="flex gap-y-2 flex-col mt-2">
				{/* <p className="text-xl">
					¿Está seguro de {titleText.toLowerCase()} la solicitud?
				</p>
				<div className="flex gap-y-2 flex-col mt-2">
					{flagExepcion && (
						<p className="text-sm text-red-700">
							Esta Solicitud fue marcada como excepción, por lo que tiene que evaluarse
							en una reunión de comité.
						</p>
					)}
				</div> */}
			</div>
			{/* textbox with a state */}

			<div className="flex flex-col">
				<TextInput
					id="motivo"
					value={token}
					onChange={(e) => setToken(e.target.value)}
					label="Numero de Identidad"
					placeholder="Numero de Identidad"
				/>
			</div>
			<div className="flex justify-end gap-2 mt-4">
				<Button
					type="button"
					customClassName="bg-red-700 font-semibold text-white"
					onClick={closeModal}
				>
					Cancelar
				</Button>

				<Button
					type="button"
					customClassName="bg-blue-700 font-semibold text-white"
					onClick={() => {
						handlerBuscar(token);
					}}
				>
					Buscar
				</Button>
			</div>
		</Modal>
	);
};

export default ModalSolicitud;
