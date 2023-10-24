import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import TextInput from '../../../components/TextInput/TextInput';
import { get, set } from 'lodash';
import Button from '../../../components/Button/Button';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import axios, { AxiosResponse } from 'axios';
import API_IP from '../../../config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DataDeudasAnalista } from './TableDeudasAnalista';

Modal.setAppElement('#root');
interface ModalProps {
	isOpen: boolean;
	closeModal: () => void; // Define the type of closeModal function
}

export interface Profesion {
	idProfesion: string;
	profesionName: string;
}

const ModalProfesion: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
	const navigate = useNavigate();

	const [profesiones, setProfesiones] = useState<Profesion[]>([]);
	const [profesionStr, setProfesionStr] = useState('');

	const getProfesion = async () => {
		try {
			axios
				.get(`${API_IP}/api/Profesion`)
				.then((data: AxiosResponse<Profesion[]>) => {
					setProfesiones(data.data);
				});
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		getProfesion();
	}, []);
	const handleGuardar = async () => {
		try {
			await axios.post(`${API_IP}/api/Profesion`, {
				ProfesionName: profesionStr,
			});
			setProfesionStr('');
			getProfesion();
		} catch (error) {
			toast.error('Error al guardar la informacion');
			console.error(error);
		}
	};
	const handleDelete = async (id: string) => {
		try {
			await axios.delete(`${API_IP}/api/Profesion/${id}`);
			getProfesion();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			contentLabel="ModalProfesion"
			style={{
				overlay: {
					backgroundColor: 'rgba(0,0,0,0.5)',
				},
				content: {
					backgroundColor: '#fff',
					margin: 'auto',
					width: '520px',
					height: '500px',
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
					<h1 className="text-3xl">Administrador Lista Profesion</h1>
				</div>
				<button onClick={closeModal} className="text-lg">
					X
				</button>
			</div>
			<div className="flex gap-y-2 flex-col mt-2">
				<p className="text-xl">Ingrese una nueva profesion</p>
				<div className="flex w-full">
					<div className="flex w-full">
						<TextInput
							id="nombre"
							value={profesionStr}
							onChange={(e) => setProfesionStr(e.target.value)}
							label={'Profesion'}
						/>
					</div>
					<div className="flex w-1/4 justify-center items-end mb-1 ml-2">
						<Button
							type="button"
							customClassName="bg-green-700 font-semibold text-white"
							onClick={handleGuardar}
						>
							Agregar
						</Button>
					</div>
				</div>

				<div className="flex w-full mt-6">
					<p className="text-xl">Lista de Profesiones</p>
				</div>
				<div className="flex w-full flex-col overflow-y-auto h-56">
					{profesiones.map((profesion) => (
						<div className="flex w-full mt-1" key={profesion.idProfesion}>
							<div className="flex w-full justify-between items-center content-center border-b-gray border-b-2">
								<p className="text-xl">{profesion.profesionName}</p>

								<button
									onClick={() => handleDelete(profesion.idProfesion)}
									className="text-lg"
								>
									X
								</button>
							</div>
						</div>
					))}
				</div>
				<div className="w-full flex justify-between"></div>

				
			</div>
		</Modal>
	);
};

export default ModalProfesion;
