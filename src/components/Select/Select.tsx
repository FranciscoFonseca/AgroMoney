/* react imports */
import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';

let COUNT = 0;
export interface Option {
	label: string;
	value: string;
	disabled?: boolean;
}
export interface Props
	extends React.DetailedHTMLProps<
		React.SelectHTMLAttributes<HTMLSelectElement>,
		HTMLSelectElement
	> {
	options: Option[];
	name: string;
	label?: string | JSX.Element;
	error?: boolean;
	errorText?: string;
	infoOnClick?: () => void;
	timeSelector?: boolean;
	selectorHeight?: number;
	highlight?: boolean;
	isLoading?: boolean;
}

const Select = forwardRef(
	(
		{
			options,
			name,
			label,
			error,
			errorText,
			infoOnClick,
			className = '',
			timeSelector = false,
			disabled,
			defaultValue,
			selectorHeight,
			highlight = false,
			isLoading = false,
			...props
		}: Props,
		ref: React.Ref<HTMLSelectElement>
	): JSX.Element => {
		const [id] = useState(`Select${COUNT++}`);

		return (
			<div className={clsx('flex flex-col gap-y-1 w-full', className)}>
				<label htmlFor={id} className="flex items-center gap-x-2 text-2 text-dark">
					{label}
				</label>
				<div className="relative flex flex-row items-center justify-between gap-x-2 transition-all">
					<select
						{...props}
						ref={ref}
						id={id}
						name={name}
						disabled={disabled}
						defaultValue={defaultValue}
						className={clsx(
							'text-base ... relative block h-12 w-full overflow-hidden text-ellipsis rounded-lg border-gray-15 px-4 py-3 text-1 text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100',
							disabled && 'bg-gray-100',
							error && 'border-red-100',
							selectorHeight && `h-12`,
							highlight && !error && 'border-2 border-yellow-100'
						)}
					>
						{options.map((option, i) => (
							<option
								key={`option-${option.value}-${id}-${i + 0}`}
								value={option.value}
								disabled={option.disabled}
							>
								{option.label}
							</option>
						))}
					</select>
				</div>
				{errorText && (
					<p
						className={clsx(errorText ? 'text-red-80' : 'text-gray-80', 'text-2')}
						id={`${name}-description`}
					>
						{errorText}
					</p>
				)}
			</div>
		);
	}
);
Select.displayName = 'Select';

export default Select;
