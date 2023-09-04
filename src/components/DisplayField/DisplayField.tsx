import clsx from 'clsx';

interface DisplayFieldProps {
	label: string;
	customClassName?: string;
	text?: string;
	textCustomClassName?: string;
}

const DisplayField = ({
	label,
	customClassName,
	text,
	textCustomClassName,
}: DisplayFieldProps): JSX.Element => {
	return (
		<>
			<div className="flex flex-col gap-y-1 w-full">
				<label className={clsx('ml-1 font-bold', textCustomClassName)}>
					{label}:
				</label>
				<div className={'relative'}>
					<p
						className={clsx(
							customClassName,
							'block w-full px-4 text-1 leading-none text-dark '
						)}
					>
						{text}
					</p>
				</div>
			</div>
		</>
	);
};

export default DisplayField;
