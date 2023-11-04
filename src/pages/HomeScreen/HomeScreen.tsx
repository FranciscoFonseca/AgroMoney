import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import imagenLogin from '../../images/agromoney.png';
import { useEffect, useState } from 'react';
import ModalSolicitud from './ModalSolicitud';
import { ToastContainer } from 'react-toastify';
import Select from '../../components/Select/Select';
import API_IP from '../../config';
import {
	BotonesAdjuntarOptions,
	arrayBotones,
	optionMappings,
} from '../NuevaSlt/components/BotonesAdjuntar';

const HomeScreen = (): JSX.Element => {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const [destinos, setDestinos] = useState<any[]>([]);
	const [selectedDestino, setSelectedDestino] = useState<any>(null); // [1
	const toggleModal = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		const defaultDestino: any = {
			idDestino: 0,
			destino: 'Seleccione un destino',
		};
		fetch(API_IP + '/api/Destino')
			.then((response) => response.json())
			.then((data: any) => {
				setDestinos([defaultDestino, ...data]);
			});
		document.body.style.backgroundImage = 'url(/fondoAgro.jpg)';
		document.body.style.backgroundSize = 'auto 100%';
		document.body.style.backdropFilter = 'blur(8px)';
		return () => {
			// Clean up any other styles if necessary
			document.body.style.backgroundImage = '';
			document.body.style.backgroundSize = '';
			document.body.style.backdropFilter = '';
		};
	}, []);

	const handleDestinoChange = (e: any) => {
		const selected = destinos.find(
			(item: any) => item.destino === e.target.value
		);
		setSelectedDestino(selected.destino);
	};
	function getOptionsByList(listName: string): BotonesAdjuntarOptions[] {
		const optionIndices = optionMappings[listName] || [];
		return optionIndices.map((index) => arrayBotones[index]);
	}

	return (
		<>
			<ToastContainer />
			<ModalSolicitud isOpen={isOpen} closeModal={toggleModal} />
			<div className="flex flex-col justify-center items-center w-full h-[90vh] gap-y-8">
				<img className="imagen-login" src={imagenLogin} alt="Imagen de login" />

				<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap justify-center items-end">
					<div className="flex flex-col w-60 bg-slate-100 h-48 rounded-lg p-2 absolute top-10 left-10">
						<Select
							options={destinos.map((item: any) => ({
								label: item.destino,
								value: item.destino,
							}))}
							placeholder="se"
							label="Requisitos para Solicitud"
							name={'DestinoSolicitud'}
							onChange={handleDestinoChange}
						/>
						<div className="flex flex-row gap-2 w-full mb-2 flex-wrap justify-center">
							{/* if there is a destino selected, show optionmappins from botonesAdjintar, and show the text from arrayBotones
							 */}

							{getOptionsByList(selectedDestino).map((item) => (
								<p className="text-xs mt-1 ml-2 text-red-600">{item.label}</p>
							))}
						</div>
					</div>
					<div className="flex flex-col w-48">
						<Button
							customClassName="bg-green-700 font-semibold text-white h-24 w-48"
							onClick={() => {
								navigate('/nueva-solicitud');
							}}
						>
							Nueva Solicitud
						</Button>
					</div>

					<div className="flex flex-col w-48">
						<Button
							customClassName="bg-green-700 font-semibold text-white h-24 w-48"
							onClick={() => {
								// navigate('/nueva-solicitud');
								toggleModal();
							}}
						>
							Completar Solicitud
						</Button>
					</div>
					<div className="flex flex-col w-48 items-center gap-y-1">
						{/* <h1>¿ Ya eres Cliente ?</h1> */}
						<Button
							customClassName="bg-green-700 font-semibold text-white h-24 w-48"
							onClick={() => {
								navigate('/Login');
							}}
						>
							Inicio de Sesión
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default HomeScreen;
