export const formatCurrency = (value: number | string): string => {
	const formatter = new Intl.NumberFormat('en-US');
	const currencySymbol = 'L';
	if (typeof value === 'string') {
		value = parseFloat(value);
	}
	if (isNaN(value) || value < 0) return '';
	const newValue = Number(value);
	const formattedValue = newValue.toFixed(2);
	const formattedCurrency = formatter.format(Number(formattedValue));
	return `${currencySymbol} ${formattedCurrency}`;
};
export const formatCurrency2 = (value: number | string): string => {
	const formatter = new Intl.NumberFormat('en-US');
	const currencySymbol = 'L';
	if (typeof value === 'string') {
		value = parseFloat(value);
	}
	if (isNaN(value) || value < 0) return '';
	const newValue = Number(value);
	const formattedValue = newValue.toFixed(2);
	const formattedCurrency = formatter.format(Number(formattedValue));
	return `${currencySymbol}${formattedCurrency}`;
};

export const formatNumber = (value: number | string): string => {
	const formatter = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

	if (typeof value === 'string') {
		value = parseFloat(value);
	}

	if (isNaN(value) || value < 0) return '';

	const newValue = Number(value);
	const formattedValue = formatter.format(newValue);

	return `${formattedValue}`;
};
