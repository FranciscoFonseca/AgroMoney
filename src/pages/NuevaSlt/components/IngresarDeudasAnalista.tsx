import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/Button/Button';
import Select from '../../../components/Select/Select';
import { FaTrash } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TableComponentDeudasAnalista, {
	DataDeudasAnalista,
} from './TableDeudasAnalista';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import clsx from 'clsx';
import axios from 'axios';
import API_IP from '../../../config';
import { BotonesAdjuntarOptions } from './BotonesAdjuntar';
import {
	FaEye,
	FaFileDownload,
	FaFileExcel,
	FaFilePdf,
	FaMoneyBill,
} from 'react-icons/fa';
import { set } from 'lodash';
interface IngresarDeudasAnalistaProps {
	data: DataDeudasAnalista[];
	id: string;
	handleAgregarDeuda: (deuda: DataDeudasAnalista) => void;
	handleEliminarDeuda: (id: string) => void;
	disabled?: boolean;
	selectedFiles: Record<string, File[]>;
	setSelectedFiles: React.Dispatch<React.SetStateAction<Record<string, File[]>>>;
	solicitudId: string;
}

const tipoEstatus = [
	{ label: 'Seleccione', value: '0' },
	{ label: 'Vigente', value: 'Vigente' },
	{ label: 'Atrasado', value: 'Atrasado' },
	{ label: 'En Mora', value: 'En Mora' },
	{ label: 'Jurídico', value: 'Jurídico' },
	{ label: 'Castigo', value: 'Castigo' },
];
const defaultData: DataDeudasAnalista = {
	id: '',
	tipo: '',
	refencia: '',
	incluir: 'Si',
	limite: 0,
	saldoActual: 0,
	formaDePago: '',
	valorCuota: 0,
	fechaVencimiento: new Date().toISOString(),
	estatus: '',
	saldoEnMora: 0,
	mora30: 0,
	mora60: 0,
	mora90: 0,
	mora120: 0,
};

const IngresarDeudasAnalista: React.FC<IngresarDeudasAnalistaProps> = ({
	data,
	id,
	handleAgregarDeuda,
	handleEliminarDeuda,
	disabled,
	selectedFiles,
	setSelectedFiles,
	solicitudId,
}) => {
	const [deuda, setDeuda] = useState<DataDeudasAnalista>(defaultData);

	const agregarDeuda = (deuda: DataDeudasAnalista) => {
		if (deuda.tipo === '') {
			return toast.warn('Debe seleccionar un tipo de deuda');
		}
		if (deuda.refencia === '') {
			return toast.warn('Debe ingresar una referencia');
		}
		if (deuda.limite === 0) {
			return toast.warn('Debe ingresar un monto');
		}
		if (deuda.saldoActual === 0) {
			return toast.warn('Debe ingresar un monto');
		}
		if (deuda.formaDePago === '') {
			return toast.warn('Debe ingresar una forma de pago');
		}
		if (deuda.valorCuota === 0) {
			return toast.warn('Debe ingresar un monto');
		}
		if (deuda.fechaVencimiento === '') {
			return toast.warn('Debe ingresar una fecha de vencimiento');
		}
		if (deuda.estatus === '') {
			return toast.warn('Debe ingresar un estatus');
		}

		handleAgregarDeuda(deuda);
		setDeuda(defaultData);
	};

	// Calculate the sum of valorCuota for debts with incluir set to 'Si'
	const sumValorCuotaSi = data
		.filter((debt) => debt.incluir === 'Si')
		.reduce((sum, debt) => sum + debt.valorCuota, 0);

	// Calculate the sum of valorCuota for debts with incluir set to 'No'
	const sumValorCuotaNo = data
		.filter((debt) => debt.incluir === 'No')
		.reduce((sum, debt) => sum + debt.valorCuota, 0);

	// Total sum of valorCuota for both 'Si' and 'No'
	const totalSumValorCuota = sumValorCuotaSi + sumValorCuotaNo;

	// Calculate the sum of saldoActual for debts with incluir set to 'Si'
	const sumSaldoActualSi = data
		.filter((debt) => debt.incluir === 'Si')
		.reduce((sum, debt) => sum + debt.saldoActual, 0);

	// Calculate the sum of saldoActual for debts with incluir set to 'No'
	const sumSaldoActualNo = data
		.filter((debt) => debt.incluir === 'No')
		.reduce((sum, debt) => sum + debt.saldoActual, 0);

	// Total sum of saldoActual for both 'Si' and 'No'
	const totalSumSaldoActual = sumSaldoActualSi + sumSaldoActualNo;
	// Inside the IngresarDeudasAnalista component
	const [selectedButton, setSelectedButton] =
		useState<BotonesAdjuntarOptions | null>(null);
	// Initialize counters for mora periods
	// let countMoraTreintaInstitucion = 0;
	// let countMoraSesentaInstitucion = 0;
	// let countMoraNoventaInstitucion = 0;
	// let countMoraCientoVeinteInstitucion = 0;

	// let countMoraTreintaComercial = 0;
	// let countMoraSesentaComercial = 0;
	// let countMoraNoventaComercial = 0;
	// let countMoraCientoVeinteComercial = 0;

	// let countMoraTreintaInternos = 0;
	// let countMoraSesentaInternos = 0;
	// let countMoraNoventaInternos = 0;
	// let countMoraCientoVeinteInternos = 0;

	const [countMoraTreintaInstitucion, setCountMoraTreintaInstitucion] =
		useState(0);
	const [countMoraSesentaInstitucion, setCountMoraSesentaInstitucion] =
		useState(0);
	const [countMoraNoventaInstitucion, setCountMoraNoventaInstitucion] =
		useState(0);
	const [countMoraCientoVeinteInstitucion, setCountMoraCientoVeinteInstitucion] =
		useState(0);

	const [countMoraTreintaComercial, setCountMoraTreintaComercial] = useState(0);
	const [countMoraSesentaComercial, setCountMoraSesentaComercial] = useState(0);
	const [countMoraNoventaComercial, setCountMoraNoventaComercial] = useState(0);
	const [countMoraCientoVeinteComercial, setCountMoraCientoVeinteComercial] =
		useState(0);

	const [countMoraTreintaInternos, setCountMoraTreintaInternos] = useState(0);
	const [countMoraSesentaInternos, setCountMoraSesentaInternos] = useState(0);
	const [countMoraNoventaInternos, setCountMoraNoventaInternos] = useState(0);
	const [countMoraCientoVeinteInternos, setCountMoraCientoVeinteInternos] =
		useState(0);

	useEffect(() => {
		setCountMoraTreintaInstitucion(0);
		setCountMoraSesentaInstitucion(0);
		setCountMoraNoventaInstitucion(0);
		setCountMoraCientoVeinteInstitucion(0);
		setCountMoraTreintaComercial(0);
		setCountMoraSesentaComercial(0);
		setCountMoraNoventaComercial(0);
		setCountMoraCientoVeinteComercial(0);
		setCountMoraTreintaInternos(0);
		setCountMoraSesentaInternos(0);
		setCountMoraNoventaInternos(0);
		setCountMoraCientoVeinteInternos(0);

		data.forEach((debt) => {
			if (debt.tipo === 'Financiera') {
				setCountMoraTreintaInstitucion((prevCount) =>
					debt.mora30 > 0 ? prevCount + 1 : prevCount
				);
				setCountMoraSesentaInstitucion((prevCount) =>
					debt.mora60 > 0 ? prevCount + 1 : prevCount
				);
				setCountMoraNoventaInstitucion((prevCount) =>
					debt.mora90 > 0 ? prevCount + 1 : prevCount
				);
				setCountMoraCientoVeinteInstitucion((prevCount) =>
					debt.mora120 > 0 ? prevCount + 1 : prevCount
				);
			} else if (debt.tipo === 'Comercial') {
				setCountMoraTreintaComercial((prevCount) =>
					debt.mora30 > 0 ? prevCount + 1 : prevCount
				);
				setCountMoraSesentaComercial((prevCount) =>
					debt.mora60 > 0 ? prevCount + 1 : prevCount
				);
				setCountMoraNoventaComercial((prevCount) =>
					debt.mora90 > 0 ? prevCount + 1 : prevCount
				);
				setCountMoraCientoVeinteComercial((prevCount) =>
					debt.mora120 > 0 ? prevCount + 1 : prevCount
				);
			} else if (debt.tipo === 'Internos') {
				setCountMoraTreintaInternos((prevCount) =>
					debt.mora30 > 0 ? prevCount + 1 : prevCount
				);
				setCountMoraSesentaInternos((prevCount) =>
					debt.mora60 > 0 ? prevCount + 1 : prevCount
				);
				setCountMoraNoventaInternos((prevCount) =>
					debt.mora90 > 0 ? prevCount + 1 : prevCount
				);
				setCountMoraCientoVeinteInternos((prevCount) =>
					debt.mora120 > 0 ? prevCount + 1 : prevCount
				);
			}
		});
	}, [data]);

	// Display the counts for each tipo
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
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const handleFileRemove = (buttonName: string, index: number) => {
		setSelectedFiles((prevSelectedFiles) => ({
			...prevSelectedFiles,
			[buttonName]: prevSelectedFiles[buttonName].filter((_, i) => i !== index),
		}));
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

	const handleClick = (button: BotonesAdjuntarOptions) => {
		if (fileInputRef.current) {
			setSelectedButton(button);
			fileInputRef.current.click();
		}
	};
	const [documentMetadata, setDocumentMetadata] = useState([]);

	const fetchDocumentMetadataByAssociatedId = async (associatedId: string) => {
		try {
			const response = await axios.get(
				`${API_IP}/api/AttachmentsDeudas/${solicitudId}`
			);
			return response.data;
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		if (disabled) {
			fetchDocumentMetadataByAssociatedId(id).then((documentMetadata) => {
				setDocumentMetadata(documentMetadata);
			});
		}
	}, [disabled]);
	const downloadDocument = async (associatedId: number, fileName: string) => {
		const downloadLink = `${API_IP}/api/AttachmentsDeudas/DownloadDocument?fileName=${encodeURIComponent(
			fileName
		)}&associatedId=${solicitudId}`;

		try {
			const usuariologtoken = localStorage.getItem('token') || '';
			const response = await fetch(downloadLink, {
				headers: {
					Authorization: `Bearer ${usuariologtoken}`,
				},
			});
			const blob = await response.blob();

			// Create a URL for the blob
			const blobUrl = URL.createObjectURL(blob);

			// Create a temporary anchor element
			const anchor = document.createElement('a');
			anchor.href = blobUrl;
			anchor.download = fileName;

			// Simulate a click event on the anchor element
			anchor.click();

			// Clean up the URL and anchor element
			URL.revokeObjectURL(blobUrl);
			anchor.remove();
		} catch (error) {
			console.error('Error downloading document:', error);
		}
	};
	const openDocumentInNewTab = async (
		associatedId: number,
		fileName: string
	) => {
		const downloadLink = `${API_IP}/api/AttachmentsDeudas/DownloadDocument?fileName=${encodeURIComponent(
			fileName
		)}&associatedId=${solicitudId}`;

		try {
			const usuariologtoken = localStorage.getItem('token') || '';
			const response = await fetch(downloadLink, {
				headers: {
					Authorization: `Bearer ${usuariologtoken}`,
				},
			});
			const blob = await response.blob();

			// Create a URL for the blob
			const blobUrl = URL.createObjectURL(blob);

			// Open the blob URL in a new tab
			const newTab = window.open(blobUrl, '_blank');

			// Clean up the URL
			URL.revokeObjectURL(blobUrl);
		} catch (error) {
			console.error('Error opening document:', error);
		}
	};
	return (
		<>
			{!disabled && (
				<div className="mt-2 border-b-2 w-full flex justify-center border-black">
					<p className="text-xl font-semibold">Ingresar las Deudas (Analista)</p>
				</div>
			)}
			{disabled && (
				<div className="mt-2 border-b-2 w-full flex justify-center border-black">
					<p className="text-xl font-semibold">Deudas Ingresadas (Analista)</p>
				</div>
			)}
			{disabled && (
				<>
					<div className="flex w-full mt-4 justify-center">
						<div className="flex flex-col justify-center">
							<table className="w-full border-collapse border">
								<colgroup>
									<col className="w-1/3" />
									<col className="w-1/3" />
									<col className="w-1/3" />
								</colgroup>
								<thead>
									<tr>
										<th className="py-2 border">Nombre</th>
										<th className="py-2 border">Ver</th>
										<th className="py-2 border">Descargar</th>
									</tr>
								</thead>
								<tbody>
									{documentMetadata &&
										documentMetadata.length > 0 &&
										documentMetadata.map((metadata: any) => (
											<tr key={metadata.id}>
												<td className="border p-2 truncate">{metadata.fileName}</td>
												<td className="border p-2 text-center">
													<button
														onClick={() =>
															openDocumentInNewTab(Number(id), metadata.fileName)
														}
													>
														<FaEye />
													</button>
												</td>
												<td className="border p-2 text-center">
													<button
														onClick={() => downloadDocument(Number(id), metadata.fileName)}
													>
														<FaFileDownload />
													</button>
												</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}
			{!disabled && (
				<div className="flex content-between flex-row w-full justify-between mb-2">
					<div className="flex flex-col justify-start w-1/2 content-center items-center mt-4">
						<span
							className={clsx(
								'inline-flex w-38 h-12 text-center items-center justify-center gap-x-2 rounded-lg border px-4 text-2 focus:outline-none focus:ring-2 focus:ring-offset-2   font-semibold hover:cursor-pointer',
								'bg-green-700  text-white'
							)}
							onClick={() =>
								handleClick({
									nombre: 'Buro-de-Credito',
									label: 'Buro de Credito',
								})
							}
						>
							Buro de Credito
						</span>
						<span
							className={clsx(
								'inline-flex w-38 h-12 text-center items-center justify-center gap-x-2 rounded-lg border px-4 text-2 focus:outline-none focus:ring-2 focus:ring-offset-2   font-semibold hover:cursor-pointer',
								'bg-green-700  text-white'
							)}
							onClick={() =>
								handleClick({
									nombre: 'visto-bueno-jefe-inmediato',
									label: 'Visto Bueno Jefe Inmediato',
								})
							}
						>
							Visto Bueno Jefe Inmediato
						</span>
						<input
							type="file"
							ref={fileInputRef}
							name={'Adjuntar Archivos'}
							style={{ display: 'none' }}
							onChange={handleFileChange}
						/>
					</div>
					{selectedFiles && hasAnyFiles(selectedFiles) && (
						<div className="flex w-1/2 mt-4">
							<div className="flex flex-col">
								<table className="w-full border">
									<thead>
										<tr>
											<th>Nombre</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{selectedFiles &&
											Object.entries(selectedFiles).map(([buttonName, files]) => (
												<>
													{files.map((file, index) => (
														<tr key={file.name}>
															<td className="border p-2 truncate">{file.name}</td>
															<td className="border p-2 ">
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
				</div>
			)}
			{!disabled && (
				<>
					<div className="flex flex-row gap-2 w-full flex-wrap justify-center">
						<div className="flex flex-col  w-full sm:w-1/6">
							<Select
								options={[
									{ label: 'Seleccione', value: '0' },
									{ label: 'Financiera', value: 'Financiera' },
									{ label: 'Comercial', value: 'Comercial' },
									{ label: 'Deudas con Grupo Cadelga', value: 'Internos' },
								]}
								label="Tipo"
								name={'Tipo'}
								value={deuda.tipo}
								onChange={(e) => {
									setDeuda({ ...deuda, tipo: e.target.value });
								}}
							/>
						</div>
						<div className="flex flex-col w-full sm:w-1/6">
							<TextInput
								label="Referencia"
								value={deuda.refencia}
								onChange={(e) => {
									setDeuda({ ...deuda, refencia: e.target.value });
								}}
							/>
						</div>
						<div className="flex flex-col w-full sm:w-1/6 ">
							<TextInput
								label="Limite"
								onChange={(e) => {
									setDeuda({
										...deuda,
										limite: Number(e.target.value.replace(/[^0-9]/g, '')),
									});
								}}
								value={deuda.limite}
							/>
						</div>
						<div className="flex flex-col w-full sm:w-1/6 ">
							<TextInput
								label="Saldo Actual"
								onChange={(e) => {
									setDeuda({
										...deuda,
										saldoActual: Number(e.target.value.replace(/[^0-9]/g, '')),
									});
								}}
								value={deuda.saldoActual}
							/>
						</div>
						<div className="flex flex-col w-full sm:w-1/6 ">
							<TextInput
								label="Forma de Pago"
								onChange={(e) => {
									setDeuda({ ...deuda, formaDePago: e.target.value });
								}}
								value={deuda.formaDePago}
							/>
						</div>
						<div className="flex flex-col w-full sm:w-1/6 ">
							<TextInput
								label="Valor Cuota"
								onChange={(e) => {
									setDeuda({
										...deuda,
										valorCuota: Number(e.target.value.replace(/[^0-9]/g, '')),
									});
								}}
								value={deuda.valorCuota}
							/>
						</div>

						<div className="flex flex-col w-full sm:w-1/6 ">
							{/* <DatePicker
								className="block h-12 w-full rounded-lg border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
								maxDate={new Date()}
								showYearDropdown
								selected={new Date(deuda.fechaVencimiento)}
								onChange={(date) => {
									setDeuda({ ...deuda, fechaVencimiento: date?.toISOString() || '' });
								}}
							/> */}
							<label>Fecha de Vencimiento (DD/MM/AAAA)</label>
							<DatePicker
								className="block h-12 w-full rounded-lg mt-1 border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100"
								showYearDropdown
								dateFormat={'dd/MM/yyyy'}
								selected={new Date(deuda.fechaVencimiento)}
								onChange={(date) => {
									if (date)
										setDeuda({ ...deuda, fechaVencimiento: date?.toISOString() || '' });
								}}
							/>
						</div>
						<div className="flex flex-col w-full sm:w-1/6 ">
							<Select
								options={tipoEstatus}
								label="Estatus"
								name={'Estatus'}
								value={deuda.estatus}
								onChange={(e) => {
									setDeuda({ ...deuda, estatus: e.target.value });
								}}
							/>
							{/* <TextInput
								label="Estatus"
								onChange={(e) => {
									setDeuda({ ...deuda, estatus: e.target.value });
								}}
								value={deuda.estatus}
							/> */}
						</div>
						<div className="flex flex-col w-full sm:w-1/6 ">
							<TextInput
								label="Saldo en Mora"
								disabled={deuda.estatus === 'Vigente'}
								onChange={(e) => {
									setDeuda({
										...deuda,
										saldoEnMora: Number(e.target.value.replace(/[^0-9]/g, '')),
									});
								}}
								value={deuda.saldoEnMora}
							/>
						</div>

						{/* <div className="flex flex-col w-full">
					<TextInput
						label="Monto"
						onChange={(e) => {
							setDeuda({ ...deuda, monto: Number(e.target.value.replace(/[^0-9]/g, '')) });
						}}
						value={deuda.monto.toString()}
					/>
				</div> */}
						<div className="flex flex-col w-full sm:w-1/12 ">
							<Select
								options={[
									{ label: 'Si', value: 'Si' },
									{ label: 'No', value: 'No' },
								]}
								value={deuda.incluir}
								label="Incluir"
								name={'Incluir'}
								onChange={(e) => {
									setDeuda({ ...deuda, incluir: e.target.value });
								}}
							/>
						</div>
						<div className="flex flex-col justify-center mt-3 w-full sm:w-1/12 ">
							<Button
								type="button"
								customClassName="bg-green-700 font-semibold text-white"
								onClick={() => {
									agregarDeuda({ ...deuda, id: uuidv4() });
								}}
							>
								Agregar
							</Button>
						</div>
					</div>
					<div className="flex flex-row gap-2 w-full px-16 justify-center">
						<div className="flex flex-col justify-center w-full  ">
							<TextInput
								label="Mora 30"
								disabled={deuda.estatus === 'Vigente'}
								onChange={(e) => {
									setDeuda({
										...deuda,
										mora30: Number(e.target.value.replace(/[^0-9]/g, '')),
									});
								}}
								value={deuda.mora30}
							/>
						</div>
						<div className="flex flex-col justify-center w-full  ">
							<TextInput
								label="Mora 60"
								disabled={deuda.estatus === 'Vigente'}
								onChange={(e) => {
									setDeuda({
										...deuda,
										mora60: Number(e.target.value.replace(/[^0-9]/g, '')),
									});
								}}
								value={deuda.mora60}
							/>
						</div>
						<div className="flex flex-col justify-center w-full  ">
							<TextInput
								label="Mora 90"
								disabled={deuda.estatus === 'Vigente'}
								onChange={(e) => {
									setDeuda({
										...deuda,
										mora90: Number(e.target.value.replace(/[^0-9]/g, '')),
									});
								}}
								value={deuda.mora90}
							/>
						</div>
						<div className="flex flex-col justify-center w-full  ">
							<TextInput
								label="Mora 120"
								disabled={deuda.estatus === 'Vigente'}
								onChange={(e) => {
									setDeuda({
										...deuda,
										mora120: Number(e.target.value.replace(/[^0-9]/g, '')),
									});
								}}
								value={deuda.mora120}
							/>
						</div>
					</div>
				</>
			)}
			<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
				<div className="flex flex-col w-full">
					<TableComponentDeudasAnalista
						data={data}
						id={id}
						disabled={disabled}
						handleEliminarDeuda={handleEliminarDeuda}
						handleAgregarDeuda={handleAgregarDeuda}
						setDeuda={setDeuda}
					/>
				</div>
			</div>
			<div className="flex flex-row gap-3 w-full flex-wrap sm:flex-nowrap">
				<TextInput
					label="Monto de Cuotas a Consolidar"
					disabled
					value={sumValorCuotaSi}
				/>
				<TextInput
					label="Monto de Cuotas que no se Consolidaran"
					disabled
					value={sumValorCuotaNo}
				/>
			</div>
			<p>Conteos Historicos de Mora</p>
			<p>Financiera</p>
			<div className="flex flex-row gap-3 w-full flex-wrap sm:flex-nowrap">
				<TextInput label="30 Dias" disabled value={countMoraTreintaInstitucion} />
				<TextInput label="60 Dias" disabled value={countMoraSesentaInstitucion} />
				<TextInput label="90 Dias" disabled value={countMoraNoventaInstitucion} />
				<TextInput
					label="+ 120 Dias"
					disabled
					value={countMoraCientoVeinteInstitucion}
				/>
			</div>
			<p>Comercial</p>
			<div className="flex flex-row gap-3 w-full flex-wrap sm:flex-nowrap">
				<TextInput label="30 Dias" disabled value={countMoraTreintaComercial} />
				<TextInput label="60 Dias" disabled value={countMoraSesentaComercial} />
				<TextInput label="90 Dias" disabled value={countMoraNoventaComercial} />
				<TextInput
					label="+ 120 Dias"
					disabled
					value={countMoraCientoVeinteComercial}
				/>
			</div>
		</>
	);
};

export default IngresarDeudasAnalista;
