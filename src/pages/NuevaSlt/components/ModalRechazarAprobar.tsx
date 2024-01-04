import React, { useState } from 'react';
import Modal from 'react-modal';
import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/Button/Button';

Modal.setAppElement('#root');
interface ModalProps {
	isOpen: boolean;
	closeModal: () => void; // Define the type of closeModal function
	titleText?: string;
	subtitleText?: string;
	handler: (token: string) => void;
	flagExepcion?: boolean;
	comentarioVoto?: string;
	setComentarioVoto: (comentario: string) => void;
	monto: number;
	setMonto: (monto: number) => void;
	plazo: number;
	setPlazo: (plazo: number) => void;
	esLider: string;
	tamaño?: string;
}

const ModalRechazarAprobar: React.FC<ModalProps> = ({
	isOpen,
	closeModal,
	titleText = 'Aprobar',
	handler,
	flagExepcion = false,
	comentarioVoto = '',
	setComentarioVoto,
	monto,
	setMonto,
	plazo,
	setPlazo,
	tamaño = '400px',
	esLider = 'false',
}) => {
	const [token, setToken] = useState('');
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
					height: tamaño,
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
				<div className="flex gap-y-2 flex-col mt-2">
					{flagExepcion && (
						<p className="text-sm text-red-700">
							Esta Solicitud fue marcada como excepción, por lo que tiene que evaluarse
							en una reunión de comité.
						</p>
					)}
				</div>
			</div>
			{/* textbox with a state */}
			{esLider && (
				<>
					<TextInput
						id="monto"
						value={monto}
						onChange={(e) => setMonto(Number(e.target.value))}
						label="Monto"
						placeholder="Monto"
					/>

					<TextInput
						id="plazo"
						value={plazo}
						onChange={(e) => setPlazo(Number(e.target.value))}
						label="Plazo"
						placeholder="Plazo"
					/>
				</>
			)}
			<div className="flex flex-col">
				<TextInput
					id="motivo"
					value={comentarioVoto}
					onChange={(e) => setComentarioVoto(e.target.value)}
					label="Comentario"
					placeholder="Comentario"
				/>
			</div>
			<div className="flex flex-col">
				<TextInput
					id="motivo"
					value={token}
					onChange={(e) => setToken(e.target.value)}
					label="Token"
					placeholder="Token"
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
					onClick={() => handler(token)}
				>
					{titleText}
				</Button>
			</div>
		</Modal>
	);
};

export default ModalRechazarAprobar;
