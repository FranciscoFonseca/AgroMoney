import clsx from 'clsx';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useTable, Column } from 'react-table';

export type DataDeudasAnalista = {
	id: string;
	tipo: string;
	limite: number;
	saldoActual: number;
	formaDePago: string;
	valorCuota: number;
	fechaVencimiento: string;
	estatus: string;
	refencia: string;
	incluir: string;
	saldoEnMora: number;
	mora30: number;
	mora60: number;
	mora90: number;
	mora120: number;
};
interface TableComponentDeudasAnalistaProps {
	data: DataDeudasAnalista[];
	id: string; // Add the 'id' prop to the component's
	handleEliminarDeuda: (id: string) => void;
	handleAgregarDeuda: (deuda: DataDeudasAnalista) => void;
	setDeuda: React.Dispatch<React.SetStateAction<DataDeudasAnalista>>;
}
const TableComponentDeudasAnalista: React.FC<
	TableComponentDeudasAnalistaProps
> = ({ data, id, handleEliminarDeuda }) => {
	const columns: Column<DataDeudasAnalista>[] = React.useMemo(
		() => [
			{ Header: '', accessor: 'id' },
			{ Header: 'Tipo', accessor: 'tipo' },
			{ Header: 'Referencia', accessor: 'refencia' },
			{ Header: 'Limite', accessor: 'limite' },
			{ Header: 'Saldo Actual', accessor: 'saldoActual' },
			{ Header: 'Forma de Pago', accessor: 'formaDePago' },
			{ Header: 'Valor Cuota', accessor: 'valorCuota' },
			{ Header: 'Fecha de Vencimiento', accessor: 'fechaVencimiento' },
			{ Header: 'Estatus', accessor: 'estatus' },
			{ Header: 'Saldo en Mora', accessor: 'saldoEnMora' },
			{ Header: 'Incluir', accessor: 'incluir' },
			{ Header: 'Mora 30', accessor: 'mora30' },
			{ Header: 'Mora 60', accessor: 'mora60' },
			{ Header: 'Mora 90', accessor: 'mora90' },
			{ Header: 'Mora 120', accessor: 'mora120' },
			// Add other columns as needed
		],
		[]
	);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable({ columns, data });

	return (
		<>
			{rows && rows.length > 0 && (
				<div className="max-h-64 overflow-y-scroll w-full">
					<table
						{...getTableProps()}
						id={id}
						className="w-full"
						style={{ border: '1px solid black' }}
					>
						<thead>
							{headerGroups.map((headerGroup) => (
								<tr {...headerGroup.getHeaderGroupProps()}>
									{headerGroup.headers.map((column) => (
										<th
											{...column.getHeaderProps()}
											style={{ border: '1px solid black', padding: '8px' }}
										>
											{column.render('Header')}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody {...getTableBodyProps()}>
							{rows.map((row) => {
								prepareRow(row);
								return (
									<tr {...row.getRowProps()}>
										{row.cells.map((cell) => (
											<td
												{...cell.getCellProps()}
												style={{ border: '1px solid black', padding: '8px' }}
												className={clsx(
													typeof cell.value === 'number' ? 'text-right' : '',
													cell.column.Header === '' ? '' : ''
												)}
											>
												{cell.column.Header === '' ? (
													<>
														<FaTrash
															className="text-2xl cursor-pointer m-auto"
															onClick={handleEliminarDeuda.bind(null, cell.row.original.id)}
														/>
													</>
												) : (
													<>{cell.render('Cell')}</>
												)}
											</td>
										))}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</>
	);
};

export default TableComponentDeudasAnalista;
