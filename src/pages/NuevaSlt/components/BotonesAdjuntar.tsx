import React, { useEffect, useRef, useState } from 'react';
import { FaCaretRight, FaSyncAlt, FaTrash } from 'react-icons/fa';
import { generatePdf } from '../../../adjuntos/FuncionesAdjuntos';
import { Font, PDFDownloadLink } from '@react-pdf/renderer';
import MyDocument from '../../../adjuntos/PDFFormularioAgromoney';
import AddTextToPDF, {
	handleDownloadAchPronto,
	handleDownloadAgroMoney,
	handleDownloadBac,
	handleDownloadJuridica,
	handleDownloadNatural,
} from '../../../adjuntos/AddTextToPDF';
import Button from '../../../components/Button/Button';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';

export interface BotonesAdjuntarOptions {
	nombre: string;
	label: string;
	adjunto?: (form: any) => Promise<void>;
	tooltip: string;
}

export interface BotonesAdjuntarProps {
	destino: string;
	selectedFiles: Record<string, File[]>;
	setSelectedFiles: React.Dispatch<React.SetStateAction<Record<string, File[]>>>;
	esCadelga: boolean;
	form?: any;
	setStep?: React.Dispatch<React.SetStateAction<number>>;
	step?: number;
}

export const arrayBotones: BotonesAdjuntarOptions[] = [
	{
		nombre: 'Cotizacion-O-Minuta',
		label: 'Cotización o Minuta',
		tooltip:
			'Listado de materiales necesarios para hacer la mejora en la vivienda, debe incluir el precio de los materiales extendida por la ferretería quien venderá los materiales.',
	}, //0
	{
		nombre: 'DNI',
		label: 'DNI',
		tooltip: 'Copia revés y derecho de su documento de identificación.',
	}, //1
	{
		nombre: 'Formulario-Banco',
		label: 'Formulario Banco',
		adjunto: handleDownloadBac,
		tooltip:
			'Documento necesario para recibir la transferencia que hará AgroMoney a la cuenta del solicitante.',
		// handleDownloadBac(),
	}, //2
	{
		nombre: 'Fotografia-Inmueble',
		label: 'Fotografia Inmueble',
		tooltip:
			'Fotos del inmueble al cual se le hará la mejora (Cuarto, Techo, Muro, Fachada, Baño o Cocina)',
	}, //3
	{
		nombre: 'Estados-De-Cuenta',
		label: 'Estados De Cuenta',
		tooltip:
			'Documento emitido por la institución a la cual le debemos y queremos cancelar esa deuda con el crédito AgroMoney, este documento debe ser reciente.',
	}, //4
	{
		nombre: 'Cotizacion',
		label: 'Cotización',
		tooltip:
			'Cotización o promesa de venta, la misma debe contener las descripciones generales del vehículo, así como, la información general del vendedor.',
	}, //5
	{
		nombre: 'Avaluo',
		label: 'Avalúo',
		tooltip:
			'Es el dictamen del estado actual del vehículo que se desea adquirir, el mismo debe ser expedido por Avalúos Gibson.',
	}, //6
	{ nombre: 'RTN', label: 'RTN', tooltip: 'Documento expedido por El SAR.' }, //7
	{
		nombre: 'Boleta-De-Revision',
		label: 'Boleta De Revisión',
		tooltip:
			'Boleta de circulación del vehículo, la misma debe estar pagada antes de iniciar cualquier trámite con AgroMoney.',
	}, //8
	{
		nombre: 'Lista-De-Utiles',
		label: 'Lista De Útiles',
		tooltip:
			'Puede agregar una cotización del listado de útiles escolares que se necesitan comprar para la escuela de sus hijos o la lista de útiles que la escuela le brinda al padre, si lo que desea es pagar la matricula o mensualidades, agregar el estado de cuenta con los saldos a cancelar.',
	}, //9
	{
		nombre: 'Receta',
		label: 'Receta/Orden',
		tooltip:
			'Receta medica con los medicamentos que desea comprar, si tiene cotización de los medicamentos puede subir ese documento.',
	}, //10
	{
		nombre: 'Autorizacion-Persona-Juridica',
		label: 'Autorización Persona Juridica',
		adjunto: handleDownloadJuridica,
		tooltip: 'Autorización Persona Juridica',
	}, //11
	{
		nombre: 'Autorizacion-Persona-natural',
		label: 'Autorización Persona Natural',
		adjunto: handleDownloadNatural,
		tooltip: 'Autorización para revisar los buros de créditos.',
	}, //12
	{
		nombre: 'Autorizacion-Debito',
		label: 'Autorización Debito',
		adjunto: handleDownloadAgroMoney,
		tooltip:
			'Es el visto bueno que el empleado da a RRHH, para poder hacer la retención de la cuota o abonos extraordinarios y que los mismos sean pagados a AgroMoney como abonos al prestamos que el cliente tiene en esta institución.',
	}, //13
	{
		nombre: 'ACH-PRONTO',
		label: 'ACH PRONTO',
		adjunto: handleDownloadAchPronto,
		tooltip:
			'Documento necesario para que AgroMoney pueda enviar la transferencia del préstamo la cuenta del cliente no sea en Bac.',
	}, //13
];

export const optionMappings: { [key: string]: number[] } = {
	'Compra de vehículo': [1, 2, 5, 6, 7, 8],
	'Consolidación de deuda': [1, 2, 4],
	'Mejoras de vivienda': [1, 2, 0, 3],
	'Gastos escolares': [1, 2, 9],
	'Gastos Medicos': [1, 2, 10],
	Vacaciones: [1, 2],
	'Gastos Personales': [1, 2],
};
const BotonesAdjuntar = ({
	destino,
	selectedFiles,
	setSelectedFiles,
	esCadelga,
	form,
	step,
	setStep,
}: BotonesAdjuntarProps) => {
	const handleDownload = async (boton: BotonesAdjuntarOptions) => {
		if (boton.adjunto) {
			await boton.adjunto(form); // Now you can use await because handleDownload is declared as async
		}
	};
	const [tieneBAC, setTieneBAC] = useState<boolean>(false);

	function getOptionsByList(listName: string): BotonesAdjuntarOptions[] {
		const optionIndices = optionMappings[listName] || [];
		return optionIndices.map((index) => arrayBotones[index]);
	}
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	// const [selectedFiles, setSelectedFiles] = useState<Record<string, File[]>>({});
	const [selectedButton, setSelectedButton] =
		useState<BotonesAdjuntarOptions | null>(null);
	const [usuariolog, setUsuariolog] = useState<any>(null);
	const handleClick = (button: BotonesAdjuntarOptions) => {
		if (fileInputRef.current) {
			setSelectedButton(button);
			fileInputRef.current.click();
		}
	};
	const checkFilesSelectedForCategory = (listName: string): boolean => {
		let optionIndices = optionMappings[listName] || [];

		// {esCadelga && <>{renderButton(arrayBotones[13])}</>}
		// 					{form?.tipoDePersona === 'Juridica' ? (
		// 						<>{renderButton(arrayBotones[11])}</>
		// 					) : (
		// 						<></>
		// 					)}

		if (esCadelga) {
			optionIndices = [...optionIndices, 13];
		}
		if (form?.tipoDePersona === 'Juridica') {
			optionIndices = [...optionIndices, 11];
		}
		if (form?.tipoDePersona === 'Natural') {
			optionIndices = [...optionIndices, 12];
		}

		const haveFiles = optionIndices.every((index) => {
			const buttonName = arrayBotones[index].nombre;
			const filesForButton = selectedFiles[buttonName];
			return filesForButton && filesForButton.length > 0;
		});

		if (haveFiles) {
			return true;
		} else {
			toast.warn(
				'Por favor, adjunte todos los archivos necesarios para continuar.'
			);
			return false;
		}
		// return optionIndices.every((index) => {
		// 	const buttonName = arrayBotones[index].nombre;
		// 	const filesForButton = selectedFiles[buttonName];
		// 	return filesForButton && filesForButton.length > 0;
		// });
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && fileInputRef.current) {
			const buttonName = selectedButton?.nombre || '';
			setSelectedFiles((prevSelectedFiles) => ({
				...prevSelectedFiles,
				[buttonName]: prevSelectedFiles[buttonName]
					? [...prevSelectedFiles[buttonName], file]
					: [file],
			}));
		}
	};
	const handleFileRemove = (buttonName: string, index: number) => {
		setSelectedFiles((prevSelectedFiles) => ({
			...prevSelectedFiles,
			[buttonName]: prevSelectedFiles[buttonName].filter((_, i) => i !== index),
		}));
	};

	useEffect(() => {
		const locStorage = localStorage.getItem('logusuario');
		if (locStorage) {
			setUsuariolog(JSON.parse(locStorage));
		}
	}, [destino]);

	const renderButton = (boton: BotonesAdjuntarOptions) => {
		return (
			<div className="flex flex-col justify-end w-52" key={boton.nombre}>
				{/* {boton.adjunto && (
					<button onClick={() => handleDownload(boton)} type="button">
						Descargar
					</button>
				)} */}
				<span
					className={clsx(
						'inline-flex w-full h-12 text-center items-center justify-center gap-x-2 rounded-lg border px-4 text-2 focus:outline-none focus:ring-2 focus:ring-offset-2   font-semibold hover:cursor-pointer',
						step === 2 ? 'bg-green-700  text-white' : 'bg-gray-300 text-black'
					)}
					onClick={() => handleClick(boton)}
					data-tooltip-id="my-tooltip"
					data-tooltip-content={boton.tooltip}
				>
					{boton.label}
				</span>
				<input
					type="file"
					disabled={step !== 2}
					ref={fileInputRef}
					name={boton.nombre}
					style={{ display: 'none' }}
					onChange={handleFileChange}
				/>
				{/* {selectedFiles?.[boton.nombre]?.map((file, index) => (
					<div
						key={file.name}
						className="flex items-center mx-2 gap-1 justify-between "
					>
						<p className="truncate">{file.name}</p>
						<FaTrash
							className="hover:cursor-pointer "
							onClick={() => handleFileRemove(boton.nombre, index)}
						/>
					</div>
				))} */}
			</div>
		);
	};
	const renderDownload = (boton: BotonesAdjuntarOptions) => {
		if (boton.adjunto)
			return (
				// <div
				// 	className="flex flex-col justify-end w-52 items-start underline text-blue-700 hover:cursor-pointer"
				// 	key={boton.nombre}
				// >
				// 	<button onClick={() => handleDownload(boton)} type="button">
				// 		{boton.label}
				// 	</button>
				// </div>
				<div className="flex flex-col justify-end w-52" key={boton.nombre}>
					{/* {boton.adjunto && (
					<button onClick={() => handleDownload(boton)} type="button">
						Descargar
					</button>
				)} */}
					<span
						className={clsx(
							'inline-flex w-full h-12 text-center items-center justify-center gap-x-2 rounded-lg border px-4 text-2 focus:outline-none focus:ring-2 focus:ring-offset-2   font-semibold hover:cursor-pointer border-white ',
							step === 2 ? 'bg-blue-700  text-white' : 'bg-gray-300 text-black'
						)}
						onClick={() => handleDownload(boton)}
						data-tooltip-id="my-tooltip"
						data-tooltip-content={boton.tooltip}
					>
						{boton.label}
					</span>

					{/* <input
						type="file"
						disabled={step !== 2}
						ref={fileInputRef}
						name={boton.nombre}
						style={{ display: 'none' }}
						onChange={handleFileChange}
					/> */}
					{/* {selectedFiles?.[boton.nombre]?.map((file, index) => (
					<div
						key={file.name}
						className="flex items-center mx-2 gap-1 justify-between "
					>
						<p className="truncate">{file.name}</p>
						<FaTrash
							className="hover:cursor-pointer "
							onClick={() => handleFileRemove(boton.nombre, index)}
						/>
					</div>
				))} */}
				</div>
			);
	};
	const hasAnyFiles = (selectedFiles: Record<string, File[]>) => {
		for (const groupName in selectedFiles) {
			if (
				selectedFiles.hasOwnProperty(groupName) &&
				selectedFiles[groupName].length > 0
			) {
				return true;
			}
		}
		return false;
	};

	return (
		<div className="flex gap-2 w-full flex-wrap justify-center">
			<div className="mt-2 mb-2 border-b-2 w-full flex justify-center border-black">
				<p className="text-xl font-semibold">Documentos</p>
			</div>

			{step && step === 2 && (
				<div className="flex w-full flex-col">
					<div className="flex flex-col w-full  gap-2 justify-center items-center">
						<div className="mt-2 mb-2 w-full flex justify-center border-black border-b-2">
							<p className="text-xl font-semibold">Descargar documentos</p>
						</div>
						<div className="w-11/12">
							<p className="text-lg ">
								<b>Instrucciones: </b>Haz clic en cada botón azul de esta sección, esto
								permitirá que el documento se descargue en tu dispositivo; una vez
								realizado este paso debes imprimir cada documento descargado, realizado
								este paso, firma cada uno de ellos.
							</p>
							<p className="text-lg ">
								<b>Si no tienes cuenta en BAC: </b>Descarga el formulario ACH PRONTO y
								Adjuntalo en el boton de Formulario Banco. ¡Gracias!
							</p>
							<br />
						</div>
						<div className="flex flex-row gap-2 w-full flex-wrap justify-center">
							{getOptionsByList(destino).map((boton) => renderDownload(boton))}
							{esCadelga && <>{renderDownload(arrayBotones[13])}</>}
							{form?.tipoDePersona === 'Juridica' ? (
								<>{renderDownload(arrayBotones[11])}</>
							) : (
								<></>
							)}
							{form?.tipoDePersona === 'Natural' ? (
								<>{renderDownload(arrayBotones[12])}</>
							) : (
								<></>
							)}
							{<>{renderDownload(arrayBotones[14])}</>}
						</div>
					</div>

					<div className="flex flex-col w-full  gap-2 justify-center items-center">
						<div className="mt-2 mb-2 w-full flex justify-center border-black border-b-2">
							<p className="text-xl font-semibold">Cargar documentos</p>
						</div>
						<div className="w-11/12">
							<p className="text-lg ">
								<b>Instrucciones: </b>Para completar la solicitud de crédito, es
								necesario que cargues los documentos que se describe en cada botón de
								color verde.
							</p>
							<p className="text-lg ">
								Presiona cada botón verde para cargar los documentos, selecciona el
								archivo luego presiona ok, y el documento se habrá cargado.
							</p>
							<p className="text-lg ">
								Repite esta acción por cada archivo que se solicita.
							</p>
							<br />
						</div>
						<div className="flex flex-row gap-2 w-full flex-wrap justify-center">
							{getOptionsByList(destino).map((boton) => renderButton(boton))}

							{esCadelga && <>{renderButton(arrayBotones[13])}</>}
							{form?.tipoDePersona === 'Juridica' ? (
								<>{renderButton(arrayBotones[11])}</>
							) : (
								<></>
							)}
							{form?.tipoDePersona === 'Natural' ? (
								<>{renderButton(arrayBotones[12])}</>
							) : (
								<></>
							)}
							<Tooltip
								id="my-tooltip"
								className="w-48"
								style={{
									width: '300px',
								}}
							/>
						</div>
					</div>
				</div>
			)}

			{selectedFiles && hasAnyFiles(selectedFiles) && (
				<div className="flex w-full mt-4">
					<div className="flex flex-col">
						<table className="w-full border">
							<thead>
								<tr>
									<th>Nombre</th>
									<th>Tipo de Documento</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{Object.entries(selectedFiles).map(([buttonName, files]) => (
									<>
										{files.map((file, index) => (
											<tr key={file.name}>
												<td className="border p-2 truncate">{file.name}</td>
												<td className="border p-2 truncate">{buttonName}</td>
												<td className="border p-2">
													<FaTrash
														className="hover:cursor-pointer"
														onClick={() => handleFileRemove(buttonName, index)}
													/>
												</td>
											</tr>
										))}
									</>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
				<div className="flex flex-row w-full">
					<Button
						type="button"
						onClick={() => {
							if (checkFilesSelectedForCategory(destino)) {
								if (setStep) setStep(3);
							}
						}}
						customClassName={`font-semibold text-white ${
							step === 2 ? 'bg-green-700  ' : 'hidden bg-gray-300'
						}`}
					>
						Continuar <FaCaretRight />
					</Button>
				</div>
				<div className="flex flex-row w-full">
					<Button
						type="button"
						onClick={() => {
							if (setStep) setStep(2);
						}}
						customClassName={`font-semibold text-white ${
							step && step > 2 ? 'bg-green-700  ' : 'hidden bg-gray-300'
						}`}
					>
						Restablecer <FaSyncAlt />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default BotonesAdjuntar;
