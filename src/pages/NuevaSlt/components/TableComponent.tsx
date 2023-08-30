import React from 'react';
import { useTable, Column } from 'react-table';
import { formatCurrency, formatNumber } from '../../../functions';

export type DataAmortizar = {
	id: number;
	fechaDePago: string;
	saldoInicial: number;
	pagoProgramado: number;
	pagoTotal: number;
	capital: number;
	interes: number;
	saldoFinal: number;
	interesAcumulativo: number;
	// Add other columns as needed
};
interface TableComponentProps {
	data: DataAmortizar[];
	id: string; // Add the 'id' prop to the component's props
}
const TableComponent: React.FC<TableComponentProps> = ({ data, id }) => {
	const columns: Column<DataAmortizar>[] = React.useMemo(
		() => [
			{ Header: 'No Pago', accessor: 'id' },
			{ Header: 'Fecha Pago', accessor: 'fechaDePago' },
			{ Header: 'Saldo Inicial', accessor: 'saldoInicial' },
			{ Header: 'Pago Programado', accessor: 'pagoProgramado' },
			{ Header: 'Pago Total', accessor: 'pagoTotal' },
			{ Header: 'Capital', accessor: 'capital' },
			{ Header: 'Interés', accessor: 'interes' },
			{ Header: 'Saldo Final', accessor: 'saldoFinal' },
			{ Header: 'Interes Acumulativo', accessor: 'interesAcumulativo' },
			// Add other columns as needed
		],
		[]
	);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable({ columns, data });

	return (
		<div className="max-h-64 overflow-y-scroll w-full">
			<table {...getTableProps()} id={id} style={{ border: '1px solid black' }}>
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
										className={typeof cell.value === 'number' ? 'text-right' : ''}
									>
										{typeof cell.value === 'number' ? (
											// Display a modified value for numbers
											<span>{formatNumber(cell.value.toFixed(2))}</span>
										) : (
											//<span>{cell.value * 2}</span>
											// Keep the original value for non-numbers
											cell.render('Cell')
										)}
									</td>
								))}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default TableComponent;
