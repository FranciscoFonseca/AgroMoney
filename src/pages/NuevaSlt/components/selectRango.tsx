import { useEffect, useState } from 'react';
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
}

const SelectRango = (
	{
		label,
		montoRange,
		selectOnChange,
		control,
		register,
		step,
		ignoreDecimals = false,
		...props
	}: SelectRangoProps,
	ref: React.Ref<HTMLInputElement>
) => {
	const [watchMonto, setWatchMonto] = useState<number>(0);
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
				{label}: {watchMonto ? watchMonto : Number(0)}
				{ignoreDecimals ? '' : '.00'}
			</label>
			<Controller
				name="Monto"
				control={control}
				render={({ field: { value, onChange } }) => (
					<input
						{...props}
						type="range"
						step={step}
						min={montoRange.min}
						max={montoRange.max}
						{...register}
						onChange={handleOnChange}
						className="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
					/>
				)}
			/>
		</div>
	);
};

export default SelectRango;
