import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import TextInput from '../../../components/TextInput/TextInput';
import { get, set } from 'lodash';
import Button from '../../../components/Button/Button';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import API_IP from '../../../config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

Modal.setAppElement('#root');
interface ModalProps {
	isOpen: boolean;
	closeModal: () => void; // Define the type of closeModal function
	titleText?: string;
	subtitleText?: string;
    handler: () => void;
}

const ModalRechazarAprobar: React.FC<ModalProps> = ({
	isOpen,
	closeModal,
	titleText = 'Aprobar',
	subtitleText = '¿Está seguro de aprobar la solicitud?',
    handler
}) => {
	const [cuota, setCuota] = useState(0);
	const [salario, setSalario] = useState('');
	const [comisiones, setComisiones] = useState(0);
	const [total, setTotal] = useState('');
	const navigate = useNavigate();

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			contentLabel="ModalRechazarAprobar"
			style={{
				overlay: {
					backgroundColor: 'rgba(0,0,0,0.5)',
				},
				content: {
					backgroundColor: '#fff',
					margin: 'auto',
					width: '550px',
					height: '220px',
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
					<h1 className="text-3xl">{titleText} Solicitud</h1>
				</div>
				<button onClick={closeModal} className="text-lg">
					X
				</button>
			</div>
			<div className="flex gap-y-2 flex-col mt-2">
				<p className="text-xl">
					¿Está seguro de {titleText.toLowerCase()} la solicitud?
				</p>
				<div className="flex w-full"></div>
			</div>
			<div className="flex justify-end gap-2 mt-4">
				<Button
					type="button"
					customClassName="bg-green-700 font-semibold text-white"
					onClick={closeModal}
				>
					Cancelar
				</Button>

				<Button
					type="button"
					customClassName="bg-blue-700 font-semibold text-white"
					onClick={handler}
				>
					{titleText}
				</Button>
			</div>
		</Modal>
	);
};

export default ModalRechazarAprobar;
