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

export const numeroATexto = (numero: number): string => {
	const unidades = [
		'',
		'uno',
		'dos',
		'tres',
		'cuatro',
		'cinco',
		'seis',
		'siete',
		'ocho',
		'nueve',
	];
	const decenas = [
		'',
		'diez',
		'veinte',
		'treinta',
		'cuarenta',
		'cincuenta',
		'sesenta',
		'setenta',
		'ochenta',
		'noventa',
	];
	const especiales = [
		'',
		'once',
		'doce',
		'trece',
		'catorce',
		'quince',
		'dieciséis',
		'diecisiete',
		'dieciocho',
		'diecinueve',
	];

	if (numero === 0) return 'cero';

	let texto = '';

	// Procesar millones
	if (numero >= 1000000) {
		texto += numeroATexto(Math.floor(numero / 1000000)) + ' millones ';
		numero %= 1000000;
	}

	// Procesar miles
	if (numero >= 1000) {
		texto += numeroATexto(Math.floor(numero / 1000)) + ' mil ';
		numero %= 1000;
	}

	// Procesar centenas
	if (numero >= 100) {
		texto += unidades[Math.floor(numero / 100)] + ' cien ';
		numero %= 100;
	}

	// Procesar decenas
	if (numero >= 10 && numero <= 99) {
		if (numero < 20) {
			texto += especiales[numero - 10];
			numero = 0;
		} else {
			texto += decenas[Math.floor(numero / 10)];
			numero %= 10;
		}
	}

	// Procesar unidades
	if (numero > 0) {
		texto += unidades[numero];
	}

	return texto.trim();
};

export const NumeroALetras = (function () {
	// Código basado en el comentario de @sapienman
	// Código basado en https://gist.github.com/alfchee/e563340276f89b22042a
	function Unidades(num: number): string {
		switch (num) {
			case 1:
				return 'UN';
			case 2:
				return 'DOS';
			case 3:
				return 'TRES';
			case 4:
				return 'CUATRO';
			case 5:
				return 'CINCO';
			case 6:
				return 'SEIS';
			case 7:
				return 'SIETE';
			case 8:
				return 'OCHO';
			case 9:
				return 'NUEVE';
		}

		return '';
	} //Unidades()

	function Decenas(num: number): string {
		let decena = Math.floor(num / 10);
		let unidad = num - decena * 10;

		switch (decena) {
			case 1:
				switch (unidad) {
					case 0:
						return 'DIEZ';
					case 1:
						return 'ONCE';
					case 2:
						return 'DOCE';
					case 3:
						return 'TRECE';
					case 4:
						return 'CATORCE';
					case 5:
						return 'QUINCE';
					default:
						return 'DIECI' + Unidades(unidad);
				}
			case 2:
				switch (unidad) {
					case 0:
						return 'VEINTE';
					default:
						return 'VEINTI' + Unidades(unidad);
				}
			case 3:
				return DecenasY('TREINTA', unidad);
			case 4:
				return DecenasY('CUARENTA', unidad);
			case 5:
				return DecenasY('CINCUENTA', unidad);
			case 6:
				return DecenasY('SESENTA', unidad);
			case 7:
				return DecenasY('SETENTA', unidad);
			case 8:
				return DecenasY('OCHENTA', unidad);
			case 9:
				return DecenasY('NOVENTA', unidad);
			case 0:
				return Unidades(unidad);
		}
		return '';
	} //Unidades()

	function DecenasY(strSin: string, numUnidades: number): string {
		if (numUnidades > 0) return strSin + ' Y ' + Unidades(numUnidades);

		return strSin;
	} //DecenasY()

	function Centenas(num: number): string {
		let centenas = Math.floor(num / 100);
		let decenas = num - centenas * 100;

		switch (centenas) {
			case 1:
				if (decenas > 0) return 'CIENTO ' + Decenas(decenas);
				return 'CIEN';
			case 2:
				return 'DOSCIENTOS ' + Decenas(decenas);
			case 3:
				return 'TRESCIENTOS ' + Decenas(decenas);
			case 4:
				return 'CUATROCIENTOS ' + Decenas(decenas);
			case 5:
				return 'QUINIENTOS ' + Decenas(decenas);
			case 6:
				return 'SEISCIENTOS ' + Decenas(decenas);
			case 7:
				return 'SETECIENTOS ' + Decenas(decenas);
			case 8:
				return 'OCHOCIENTOS ' + Decenas(decenas);
			case 9:
				return 'NOVECIENTOS ' + Decenas(decenas);
		}

		return Decenas(decenas);
	} //Centenas()

	function Seccion(
		num: number,
		divisor: number,
		strSingular: string,
		strPlural: string
	): string {
		let cientos = Math.floor(num / divisor);
		let resto = num - cientos * divisor;

		let letras = '';

		if (cientos > 0)
			if (cientos > 1) letras = Centenas(cientos) + ' ' + strPlural;
			else letras = strSingular;

		if (resto > 0) letras += '';

		return letras;
	} //Seccion()

	function Miles(num: number): string {
		let divisor = 1000;
		let cientos = Math.floor(num / divisor);
		let resto = num - cientos * divisor;

		let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
		let strCentenas = Centenas(resto);

		if (strMiles == '') return strCentenas;

		return strMiles + ' ' + strCentenas;
	} //Miles()

	function Millones(num: number): string {
		let divisor = 1000000;
		let cientos = Math.floor(num / divisor);
		let resto = num - cientos * divisor;

		let strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
		let strMiles = Miles(resto);

		if (strMillones == '') return strMiles;

		return strMillones + ' ' + strMiles;
	} //Millones()

	return function NumeroALetras(
		num: number,
		currency?: {
			plural?: string;
			singular?: string;
			centPlural?: string;
			centSingular?: string;
		}
	): string {
		currency = currency || {};
		let data = {
			numero: num,
			enteros: Math.floor(num),
			centavos: Math.round(num * 100) - Math.floor(num) * 100,
			letrasCentavos: '',
			letrasMonedaPlural: currency.plural || 'LEMPIRAS EXACTOS',
			letrasMonedaSingular: currency.singular || 'LEMPIRA',
			letrasMonedaCentavoPlural: currency.centPlural || 'Centavos',
			letrasMonedaCentavoSingular: currency.centSingular || 'Centavo',
		};

		if (data.centavos > 0) {
			data.letrasCentavos =
				'CON ' +
				(function () {
					if (data.centavos === 1)
						return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
					else return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
				})();
		}

		if (data.enteros === 0)
			return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
		if (data.enteros === 1)
			return (
				Millones(data.enteros) +
				' ' +
				data.letrasMonedaSingular +
				' ' +
				data.letrasCentavos
			);
		else
			return (
				Millones(data.enteros) +
				' ' +
				data.letrasMonedaPlural +
				' ' +
				data.letrasCentavos
			);
	};
})();
