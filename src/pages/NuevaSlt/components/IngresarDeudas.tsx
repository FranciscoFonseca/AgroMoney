import TextInput from '../../../components/TextInput/TextInput';
import Button from '../../../components/Button/Button';
import Select from '../../../components/Select/Select';
import { FaTrash } from 'react-icons/fa';
import TableComponentDeudas, { DataDeudas } from './TableDeudas';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface IngresarDeudasProps {
	data: DataDeudas[];
	id: string;
	handleAgregarDeuda: (deuda: DataDeudas) => void;
	handleEliminarDeuda: (id: string) => void;
	disabled?: boolean;
}

const defaultData: DataDeudas = {
	id: '',
	tipo: '',
	refencia: '',
	monto: 0,
	incluir: 'Si',
};

const IngresarDeudas: React.FC<IngresarDeudasProps> = ({
	data,
	id,
	handleAgregarDeuda,
	handleEliminarDeuda,
	disabled,
}) => {
	const [deuda, setDeuda] = useState<DataDeudas>(defaultData);

	return (
		<>
			{!disabled && (
				<div className="mt-2 border-b-2 w-full flex justify-center border-black">
					<p className="text-xl font-semibold">Ingresar las Deudas</p>
				</div>
			)}
			{disabled && (
				<div className="mt-2 border-b-2 w-full flex justify-center border-black">
					<p className="text-xl font-semibold">Deudas Ingresadas</p>
				</div>
			)}
			{!disabled && (
				<>
					<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
						<div className="flex flex-col w-full">
							<Select
								options={[
									{ label: 'Seleccione', value: '0' },
									{ label: 'Financieras', value: 'Financieras' },
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
						<div className="flex flex-col w-full">
							<TextInput
								label="Referencia"
								value={deuda.refencia}
								onChange={(e) => {
									setDeuda({ ...deuda, refencia: e.target.value });
								}}
							/>
						</div>
						<div className="flex flex-col w-full">
							<TextInput
								label="Monto"
								onChange={(e) => {
									setDeuda({
										...deuda,
										monto: Number(e.target.value.replace(/[^0-9]/g, '')),
									});
								}}
								value={deuda.monto.toString()}
							/>
						</div>
						<div className="flex flex-col w-full sm:w-1/3">
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
						<div className="flex flex-col justify-center mt-3 w-full sm:w-1/12">
							<Button
								type="button"
								customClassName="bg-green-700 font-semibold text-white"
								onClick={() => {
									handleAgregarDeuda({ ...deuda, id: uuidv4() });
									setDeuda(defaultData);
								}}
							>
								Agregar
							</Button>
						</div>
					</div>
				</>
			)}
			<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap">
				<div className="flex flex-col w-full">
					<TableComponentDeudas
						data={data}
						id={id}
						handleEliminarDeuda={handleEliminarDeuda}
						handleAgregarDeuda={handleAgregarDeuda}
						setDeuda={setDeuda}
						disabled={disabled}
					/>
				</div>
			</div>
		</>
	);
};

export default IngresarDeudas;
