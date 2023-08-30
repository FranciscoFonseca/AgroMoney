import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/Button/Button';
import Select from '../../../components/Select/Select';
import { FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TableComponentDeudasAnalista, {
	DataDeudasAnalista,
} from './TableDeudasAnalista';
import { toast } from 'react-toastify';

interface IngresarDeudasAnalistaProps {
	data: DataDeudasAnalista[];
	id: string;
	handleAgregarDeuda: (deuda: DataDeudasAnalista) => void;
	handleEliminarDeuda: (id: string) => void;
}

const defaultData: DataDeudasAnalista = {
	id: '',
	tipo: '',
	referencia: '',
	incluir: 'Si',
	limite: 0,
	saldoActual: 0,
	formaDePago: '',
	valorCuota: 0,
	fechaDeVencimiento: '',
	estatus: '',
	saldoEnMora: 0,
	moraTreinta: 0,
	moraSesenta: 0,
	moraNoventa: 0,
	moraCientoVeinte: 0,
};

const IngresarDeudasAnalista: React.FC<IngresarDeudasAnalistaProps> = ({
	data,
	id,
	handleAgregarDeuda,
	handleEliminarDeuda,
}) => {
	const [deuda, setDeuda] = useState<DataDeudasAnalista>(defaultData);
	const agregarDeuda = (deuda: DataDeudasAnalista) => {
		if (deuda.tipo === '') {
			return toast.warn('Debe seleccionar un tipo de deuda');
		}
		if (deuda.referencia === '') {
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
		if (deuda.fechaDeVencimiento === '') {
			return toast.warn('Debe ingresar una fecha de vencimiento');
		}
		if (deuda.estatus === '') {
			return toast.warn('Debe ingresar un estatus');
		}
		if (deuda.saldoEnMora === 0) {
			return toast.warn('Debe ingresar un monto');
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

	// Initialize counters for mora periods
	let countMoraTreintaInstitucion = 0;
	let countMoraSesentaInstitucion = 0;
	let countMoraNoventaInstitucion = 0;
	let countMoraCientoVeinteInstitucion = 0;

	let countMoraTreintaComercial = 0;
	let countMoraSesentaComercial = 0;
	let countMoraNoventaComercial = 0;
	let countMoraCientoVeinteComercial = 0;

	let countMoraTreintaInternos = 0;
	let countMoraSesentaInternos = 0;
	let countMoraNoventaInternos = 0;
	let countMoraCientoVeinteInternos = 0;

	// Iterate through the debts to update the counters based on tipo
	data.forEach((debt) => {
		if (debt.incluir === 'Si') {
			if (debt.tipo === 'Institución') {
				countMoraTreintaInstitucion += debt.moraTreinta > 0 ? 1 : 0;
				countMoraSesentaInstitucion += debt.moraSesenta > 0 ? 1 : 0;
				countMoraNoventaInstitucion += debt.moraNoventa > 0 ? 1 : 0;
				countMoraCientoVeinteInstitucion += debt.moraCientoVeinte > 0 ? 1 : 0;
			} else if (debt.tipo === 'Comercial') {
				countMoraTreintaComercial += debt.moraTreinta > 0 ? 1 : 0;
				countMoraSesentaComercial += debt.moraSesenta > 0 ? 1 : 0;
				countMoraNoventaComercial += debt.moraNoventa > 0 ? 1 : 0;
				countMoraCientoVeinteComercial += debt.moraCientoVeinte > 0 ? 1 : 0;
			} else if (debt.tipo === 'Internos') {
				countMoraTreintaInternos += debt.moraTreinta > 0 ? 1 : 0;
				countMoraSesentaInternos += debt.moraSesenta > 0 ? 1 : 0;
				countMoraNoventaInternos += debt.moraNoventa > 0 ? 1 : 0;
				countMoraCientoVeinteInternos += debt.moraCientoVeinte > 0 ? 1 : 0;
			}
		}
	});

	// Display the counts for each tipo
	console.log('Institución - Count Mora 30:', countMoraTreintaInstitucion);
	console.log('Institución - Count Mora 60:', countMoraSesentaInstitucion);
	console.log('Institución - Count Mora 90:', countMoraNoventaInstitucion);
	console.log('Institución - Count Mora 120:', countMoraCientoVeinteInstitucion);

	console.log('Comercial - Count Mora 30:', countMoraTreintaComercial);
	console.log('Comercial - Count Mora 60:', countMoraSesentaComercial);
	console.log('Comercial - Count Mora 90:', countMoraNoventaComercial);
	console.log('Comercial - Count Mora 120:', countMoraCientoVeinteComercial);

	console.log('Internos - Count Mora 30:', countMoraTreintaInternos);
	console.log('Internos - Count Mora 60:', countMoraSesentaInternos);
	console.log('Internos - Count Mora 90:', countMoraNoventaInternos);
	console.log('Internos - Count Mora 120:', countMoraCientoVeinteInternos);

	return (
		<>
			<div className="mt-2 border-b-2 w-full flex justify-center border-black">
				<p className="text-xl font-semibold">Ingresar las Deudas (Analista)</p>
			</div>
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
						value={deuda.referencia}
						onChange={(e) => {
							setDeuda({ ...deuda, referencia: e.target.value });
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
					<TextInput
						label="Fecha de Vencimiento"
						textCustomClassName="truncate"
						onChange={(e) => {
							setDeuda({ ...deuda, fechaDeVencimiento: e.target.value });
						}}
						value={deuda.fechaDeVencimiento}
					/>
				</div>
				<div className="flex flex-col w-full sm:w-1/6 ">
					<TextInput
						label="Estatus"
						onChange={(e) => {
							setDeuda({ ...deuda, estatus: e.target.value });
						}}
						value={deuda.estatus}
					/>
				</div>
				<div className="flex flex-col w-full sm:w-1/6 ">
					<TextInput
						label="Saldo en Mora"
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
						onChange={(e) => {
							setDeuda({
								...deuda,
								moraTreinta: Number(e.target.value.replace(/[^0-9]/g, '')),
							});
						}}
						value={deuda.moraTreinta}
					/>
				</div>
				<div className="flex flex-col justify-center w-full  ">
					<TextInput
						label="Mora 60"
						onChange={(e) => {
							setDeuda({
								...deuda,
								moraSesenta: Number(e.target.value.replace(/[^0-9]/g, '')),
							});
						}}
						value={deuda.moraSesenta}
					/>
				</div>
				<div className="flex flex-col justify-center w-full  ">
					<TextInput
						label="Mora 90"
						onChange={(e) => {
							setDeuda({
								...deuda,
								moraNoventa: Number(e.target.value.replace(/[^0-9]/g, '')),
							});
						}}
						value={deuda.moraNoventa}
					/>
				</div>
				<div className="flex flex-col justify-center w-full  ">
					<TextInput
						label="Mora 120"
						onChange={(e) => {
							setDeuda({
								...deuda,
								moraCientoVeinte: Number(e.target.value.replace(/[^0-9]/g, '')),
							});
						}}
						value={deuda.moraCientoVeinte}
					/>
				</div>
			</div>
			<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
				<div className="flex flex-col w-full">
					<TableComponentDeudasAnalista
						data={data}
						id={id}
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
			<p>Banco</p>
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
