import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

interface SelectRangoProps
	extends React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	label: string;
	montoRange: {
		min: number;
		max: number;
	};
	selectOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	control: any;
	register: any;
	step: number;
	ignoreDecimals?: boolean;
	meses?: boolean;
	value: number;
}

const SelectRango = ({
	label,
	montoRange,
	selectOnChange,
	control,
	register,
	step,
	ignoreDecimals = false,
	meses = false,
	value = 0,
	...props
}: SelectRangoProps) => {
	const [watchMonto, setWatchMonto] = useState<number>(value);
	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		ignoreDecimals
			? setWatchMonto(Number(e.target.value))
			: setWatchMonto(Number(Number(e.target.value).toFixed(2)));
		selectOnChange(e);
	};
	useEffect(() => {
		if (montoRange.min > 0) {
			setWatchMonto(montoRange.min);
		}
	}, [montoRange]);
	return (
		<div className="flex flex-col w-full">
			<label className="mb-2 inline-block text-neutral-700">
				{label}: {value}
				{meses && ' meses'}
			</label>
			<Controller
				name="Monto"
				control={control}
				render={() => (
					<input
						{...props}
						type="range"
						step={step}
						value={value}
						min={montoRange.min}
						max={montoRange.max}
						{...register}
						onChange={handleOnChange}
						className="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200 mt-4 "
					/>
				)}
			/>
		</div>
	);
};

export default SelectRango;
