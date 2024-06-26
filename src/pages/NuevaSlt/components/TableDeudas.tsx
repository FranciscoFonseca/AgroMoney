import clsx from 'clsx';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useTable, Column } from 'react-table';
import { formatCurrency2 } from '../../../functions';

export type DataDeudas = {
	id: string;
	tipo: string;
	refencia: string;
	monto: number;
	incluir: string;
};
interface TableComponentDeudasProps {
	data: DataDeudas[];
	id: string; // Add the 'id' prop to the component's
	handleEliminarDeuda: (id: string) => void;
	handleAgregarDeuda: (deuda: DataDeudas) => void;
	setDeuda: React.Dispatch<React.SetStateAction<DataDeudas>>;
	disabled?: boolean;
}
const TableComponentDeudas: React.FC<TableComponentDeudasProps> = ({
	data,
	id,
	handleEliminarDeuda,
	disabled,
}) => {
	const columns: Column<DataDeudas>[] = React.useMemo(
		() => [
			{ Header: '', accessor: 'id' },
			{ Header: 'Tipo', accessor: 'tipo' },
			{ Header: 'Referencia', accessor: 'refencia' },
			{ Header: 'Monto', accessor: 'monto' },
			{ Header: 'Incluir', accessor: 'incluir' },
			// Add other columns as needed
		],
		[]
	);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable({ columns, data });
	const handleCellRender = (cell: any) => {
		if (typeof cell.value === 'number') return formatCurrency2(cell.value);
		return cell.render('Cell');
	};
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
												{disabled ? (
													cell.column.Header === '' ? (
														<></>
													) : (
														handleCellRender(cell)
													)
												) : cell.column.Header === '' ? (
													<>
														<FaTrash
															className="text-2xl cursor-pointer m-auto"
															onClick={handleEliminarDeuda.bind(null, cell.row.original.id)}
														/>
													</>
												) : (
													handleCellRender(cell)
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

export default TableComponentDeudas;
