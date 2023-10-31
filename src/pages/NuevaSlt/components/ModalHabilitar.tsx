import React, { useState } from 'react';
import Modal from 'react-modal';
import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/Button/Button';

Modal.setAppElement('#root');
interface ModalProps {
	isOpen: boolean;
	closeModal: () => void; // Define the type of closeModal function
	handler: () => void;
}

const ModalHabilitar: React.FC<ModalProps> = ({
	isOpen,
	closeModal,
	handler,
}) => {
	const [token, setToken] = useState('');
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			contentLabel="ModalHabilitar"
			style={{
				overlay: {
					backgroundColor: 'rgba(0,0,0,0.5)',
				},
				content: {
					backgroundColor: '#fff',
					margin: 'auto',
					width: '550px',
					height: '200px',
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
					<h1 className="text-3xl">Solicitud</h1>
				</div>
				<button onClick={closeModal} className="text-lg">
					X
				</button>
			</div>
			<div className="flex gap-y-2 flex-col mt-2">
				<p className="text-xl">¿Está seguro de habilitar la solicitud?</p>
			</div>
			{/* textbox with a state */}

			<div className="flex justify-end gap-2 mt-4">
				<Button
					type="button"
					customClassName="bg-red-700 font-semibold text-white"
					onClick={closeModal}
				>
					Cerrar
				</Button>

				<Button
					type="button"
					customClassName="bg-blue-700 font-semibold text-white"
					onClick={() => handler()}
				>
					Habilitar
				</Button>
			</div>
		</Modal>
	);
};

export default ModalHabilitar;
