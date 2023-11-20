import clsx from 'clsx';
import React, { forwardRef, useState, useMemo } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	customClassName?: string;
	text?: string;
	textCustomClassName?: string;
}

const TextInput = forwardRef(
	(
		{
			label,
			customClassName,
			type = 'text',
			textCustomClassName,
			...props
		}: TextInputProps,
		ref: React.Ref<HTMLInputElement>
	): JSX.Element => {
		const [isPasswordVisible, setIsPasswordVisible] = useState(true);
		const handlePasswordVisible = () => {
			setIsPasswordVisible((prev: any) => !prev);
		};
		const inputType = useMemo(() => {
			if (type === 'password') {
				return isPasswordVisible ? 'password' : 'text';
			}
			return type;
		}, [isPasswordVisible, type]);
		return (
			<div className="flex flex-col gap-y-1 w-full">
				<label className={clsx('ml-1 ', textCustomClassName)}>{label}</label>
				<div className={'relative'}>
					<div className="flex items-center gap-x-[11px]">
						<input
							{...props}
							ref={ref}
							type={inputType}
							className={clsx(
								customClassName,
								'block h-12 w-full rounded-lg border border-gray-15  px-4 py-3 text-1 leading-none text-dark shadow-sm placeholder:text-gray-60 focus:border-yellow-100 focus:ring-yellow-100'
							)}
						/>
					</div>
					{type === 'password' && (
						<button
							type="button"
							className="absolute inset-y-0 right-0 flex items-center pr-4 top-[-3%]"
							onClick={() => handlePasswordVisible()}
						>
							{isPasswordVisible ? (
								<FaEye className="fill-gray-80 text-2xl " />
							) : (
								<FaEyeSlash className="fill-gray-80 text-2xl " />
							)}
						</button>
					)}
				</div>
			</div>
		);
	}
);
TextInput.displayName = 'TextInput';

export default TextInput;
