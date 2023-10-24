import { useEffect, useRef, useState } from 'react';
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

export interface BotonesAdjuntarOptions {
	nombre: string;
	label: string;
	adjunto?: (form: any) => Promise<void>;
}

interface BotonesAdjuntarProps {
	destino: string;
	selectedFiles: Record<string, File[]>;
	setSelectedFiles: React.Dispatch<React.SetStateAction<Record<string, File[]>>>;
	esCadelga: boolean;
	form?: any;
	setStep?: React.Dispatch<React.SetStateAction<number>>;
	step?: number;
}

const arrayBotones: BotonesAdjuntarOptions[] = [
	{ nombre: 'Cotizacion-O-Minuta', label: 'Cotizacion o Minuta' }, //0
	{ nombre: 'DNI', label: 'DNI' }, //1
	{
		nombre: 'Formulario-Banco',
		label: 'Formulario Banco',
		adjunto: handleDownloadBac,
		// handleDownloadBac(),
	}, //2
	{ nombre: 'Fotografia-Inmueble', label: 'Fotografia Inmueble' }, //3
	{ nombre: 'Estados-De-Cuenta', label: 'Estados De Cuenta' }, //4
	{ nombre: 'Cotizacion', label: 'Cotizacion' }, //5
	{ nombre: 'Avaluo', label: 'Avaluo' }, //6
	{ nombre: 'RTN', label: 'RTN' }, //7
	{ nombre: 'Boleta-De-Revision', label: 'Boleta De Revision' }, //8
	{ nombre: 'Lista-De-Utiles', label: 'Lista De Utiles' }, //9
	{ nombre: 'Receta', label: 'Receta/Orden' }, //10
	{
		nombre: 'Autorizacion-Persona-Juridica',
		label: 'Autorización Persona Juridica',
		adjunto: handleDownloadJuridica,
	}, //11
	{
		nombre: 'Autorizacion-Persona-natural',
		label: 'Autorización Persona Natural',
		adjunto: handleDownloadNatural,
	}, //12
	{
		nombre: 'Autorizacion-Debito',
		label: 'Autorización Debito',
		adjunto: handleDownloadAgroMoney,
	}, //13
	{
		nombre: 'ACH-PRONTO',
		label: 'ACH PRONTO',
		adjunto: handleDownloadAchPronto,
	}, //13
];

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

	const optionMappings: { [key: string]: number[] } = {
		'Compra de vehículo': [1, 2, 5, 6, 7, 8],
		'Consolidación de deuda': [1, 2, 4],
		'Mejoras de vivienda': [1, 2, 0, 3],
		'Gastos escolares': [1, 2, 9],
		'Gastos Medicos': [1, 2, 10],
		Vacaciones: [1, 2],
		'Gastos Personales': [1, 2],
	};
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
				<div
					className="flex flex-col justify-end w-52 items-start underline text-blue-700 hover:cursor-pointer"
					key={boton.nombre}
				>
					<button onClick={() => handleDownload(boton)} type="button">
						{boton.label}
					</button>
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
				<p className="text-xl font-semibold">Adjuntar Archivos</p>
			</div>
			<div className="w-11/12">
				<p className="text-lg ">
					<b>Instrucciones: </b>Primero, descarga los formularios necesarios. Una vez
					descargados, firmalos y luego adjúntalos utilizando el botón
					correspondiente. ¡Gracias!
				</p>
				<br />
				<p className="text-lg ">
					<b>Si no tienes cuenta en BAC: </b>Descarga el formulario ACH PRONTO y
					Adjuntalo en el boton de Formulario Banco. ¡Gracias!
				</p>
			</div>
			{step && step === 2 && (
				<div className="flex w-full">
					<div className="flex flex-col w-1/5  gap-2 justify-start">
						<p className="font-bold">Formularios a Descargar</p>
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

					<div className="flex w-4/5">
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
