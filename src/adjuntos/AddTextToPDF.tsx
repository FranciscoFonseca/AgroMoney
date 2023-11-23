import React from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import moment from 'moment';
import 'moment/locale/es';
import { FormularioSolicitudes } from '../tipos/formularioSolicitudes';
import { NumeroALetras, formatCurrency, numeroATexto } from '../functions';
import QRCode from 'qrcode';
export const handleDownloadAgroMoney = async (form: any) => {
	// Load the existing PDF
	const existingPdfBytes = await fetch(
		'/adjuntos/AUTORIZACION DE DEBITO -  AgroMoney.pdf'
	).then((res) => res.arrayBuffer());
	const pdfDoc = await PDFDocument.load(existingPdfBytes);

	// Get the first page of the PDF
	const page = pdfDoc.getPages()[0];

	// Add text to the existing page
	page.drawText(
		`${form?.nombre || ''} ${form?.segundoNombre || ''} ${form?.apellido || ''} ${
			form?.segundoApellido || ''
		}`,
		{
			x: 100,
			y: page.getHeight() - 190,
			size: 16,
			color: rgb(0, 0, 0),
		}
	);

	page.drawText(
		`Solicitud No. ${form?.idSolicitud || ''}`,
		{
			x: 390,
			y: page.getHeight() - 65,
			size: 16,
			color: rgb(0, 0, 0),
		}
	);

	page.drawText(`${form?.dni || ''}`, {
		x: 155,
		y: page.getHeight() - 215,
		size: 16,
		color: rgb(0, 0, 0),
	});
	page.drawText(`${form?.dni || ''}`, {
		x: 250,
		y: page.getHeight() - 710,
		size: 16,
		color: rgb(0, 0, 0),
	});

	page.drawText(`${form?.empresa || ''}`, {
		x: 205,
		y: page.getHeight() - 235,
		size: 16,
		color: rgb(0, 0, 0),
	});

	page.drawText(`${NumeroALetras(form.monto)}`, {
		x: 90,
		y: page.getHeight() - 300,
		size: 12,
		color: rgb(0, 0, 0),
	});

	page.drawText(`${formatCurrency(form.monto)}`, {
		x: 120,
		y: page.getHeight() - 325,
		size: 16,
		color: rgb(0, 0, 0),
	});
	// Save the modified PDF
	const modifiedPdfBytes = await pdfDoc.save();

	// Create a Blob from the bytes
	const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

	// Create a download link
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = 'AUTORIZACION DE DEBITO -  AgroMoney.pdf';
	link.click();
};

export const handleDownloadAchPronto = async (form: any) => {
	const existingPdfBytes = await fetch('/adjuntos/ACH-PRONTO.pdf').then((res) =>
		res.arrayBuffer()
	);
	const pdfDoc = await PDFDocument.load(existingPdfBytes);
	const modifiedPdfBytes = await pdfDoc.save();
	const page = pdfDoc.getPages()[0];

	// Create a Blob from the bytes
	const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

	// Create a download link
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = 'Autorizacion-ACH-PRONTO.pdf';
	link.click();
};

export const handleDownloadBac = async (form: any) => {
	// Load the existing PDF
	const existingPdfBytes = await fetch(
		'/adjuntos/F-BAC-Fórmula-De-Aceptación-De-Pago-BAC-BAC.pdf'
	).then((res) => res.arrayBuffer());
	const pdfDoc = await PDFDocument.load(existingPdfBytes);

	// Get the first page of the PDF
	const page = pdfDoc.getPages()[0];

	// Add text to the existing page
	page.drawText(
		`${form?.nombre || ''} ${form?.segundoNombre || ''} ${form?.apellido || ''} ${
			form?.segundoApellido || ''
		}`,
		{
			x: 120,
			y: page.getHeight() - 340,
			size: 14,
			color: rgb(0, 0, 0),
		}
	);
	const locStorage = localStorage.getItem('logusuario');
	if (locStorage) {
		const usuariolog = JSON.parse(locStorage || '{}');
		page.drawText(`${usuariolog?.correo || ''}`, {
			x: 120,
			y: page.getHeight() - 430,
			size: 14,
			color: rgb(0, 0, 0),
		});
	}

	//const usuariolog = JSON.parse(locStorage || '{}');

	page.drawText(`${form?.dni || ''}`, {
		x: 210,
		y: page.getHeight() - 505,
		size: 14,
		color: rgb(0, 0, 0),
	});
	page.drawText(`${form?.cargo || ''}`, {
		x: 210,
		y: page.getHeight() - 525,
		size: 14,
		color: rgb(0, 0, 0),
	});

	const fecha = new Date();
	moment.locale('es');
	const fecha_convertida = moment(fecha).format('DD / MMMM / YYYY');

	page.drawText(fecha_convertida, {
		x: 150,
		y: page.getHeight() - 170,
		size: 16,
		color: rgb(0, 0, 0),
	});

	// Save the modified PDF
	const modifiedPdfBytes = await pdfDoc.save();

	// Create a Blob from the bytes
	const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

	// Create a download link
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = 'Fórmulario-De-Aceptación-De-Pago-BAC.pdf';
	link.click();
};

export const handleDownloadNatural = async (form: any) => {
	// Load the existing PDF
	const existingPdfBytes = await fetch(
		'/adjuntos/Autorizacion-Persona-Natural.pdf'
	).then((res) => res.arrayBuffer());
	const pdfDoc = await PDFDocument.load(existingPdfBytes);

	// Get the first page of the PDF
	const page = pdfDoc.getPages()[0];

	// Add text to the existing page
	page.drawText(
		`${form?.nombre || ''} ${form?.segundoNombre || ''} ${form?.apellido || ''} ${
			form?.segundoApellido || ''
		}`,
		{
			x: 100,
			y: page.getHeight() - 195,
			size: 14,
			color: rgb(0, 0, 0),
		}
	);

	page.drawText(`${form?.dni || ''}`, {
		x: 150,
		y: page.getHeight() - 222,
		size: 14,
		color: rgb(0, 0, 0),
	});
	page.drawText(`Agromoney`, {
		x: 400,
		y: page.getHeight() - 222,
		size: 14,
		color: rgb(0, 0, 0),
	});

	const fecha = new Date();
	const dia = fecha.getDate();
	const mes = fecha.getMonth() + 1;
	const anio = fecha.getFullYear();
	const last2 = anio.toString().slice(2, 4);

	page.drawText(dia.toString(), {
		x: 160,
		y: page.getHeight() - 373,
		size: 16,
		color: rgb(0, 0, 0),
	});
	page.drawText(mes.toString(), {
		x: 200,
		y: page.getHeight() - 373,
		size: 16,
		color: rgb(0, 0, 0),
	});
	page.drawText(last2.toString(), {
		x: 260,
		y: page.getHeight() - 373,
		size: 16,
		color: rgb(0, 0, 0),
	});

	// Save the modified PDF
	const modifiedPdfBytes = await pdfDoc.save();

	// Create a Blob from the bytes
	const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

	// Create a download link
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = 'Autorizacion-Persona-Natural.pdf';
	link.click();
};
export const handleDownloadJuridica = async (form: any) => {
	// Load the existing PDF
	const existingPdfBytes = await fetch(
		'/adjuntos/Autorizacion-Persona-Juridica.pdf'
	).then((res) => res.arrayBuffer());
	const pdfDoc = await PDFDocument.load(existingPdfBytes);

	// Get the first page of the PDF
	const page = pdfDoc.getPages()[0];

	// Add text to the existing page
	page.drawText(
		`${form?.nombre || ''} ${form?.segundoNombre || ''} ${form?.apellido || ''} ${
			form?.segundoApellido || ''
		}`,
		{
			x: 100,
			y: page.getHeight() - 120,
			size: 14,
			color: rgb(0, 0, 0),
		}
	);
	page.drawText(`Agromoney `, {
		x: 100,
		y: page.getHeight() - 257,
		size: 14,
		color: rgb(0, 0, 0),
	});
	page.drawText(form.nombre, {
		x: 100,
		y: page.getHeight() - 230,
		size: 16,
		color: rgb(0, 0, 0),
	});
	const fecha = new Date();
	const dia = fecha.getDate();
	const mes = fecha.getMonth() + 1;
	const anio = fecha.getFullYear();
	const last2 = anio.toString().slice(2, 4);

	page.drawText(dia.toString(), {
		x: 165,
		y: page.getHeight() - 385,
		size: 14,
		color: rgb(0, 0, 0),
	});
	page.drawText(mes.toString(), {
		x: 210,
		y: page.getHeight() - 385,
		size: 14,
		color: rgb(0, 0, 0),
	});
	page.drawText(last2.toString(), {
		x: 265,
		y: page.getHeight() - 385,
		size: 14,
		color: rgb(0, 0, 0),
	});
	// Save the modified PDF
	const modifiedPdfBytes = await pdfDoc.save();

	// Create a Blob from the bytes
	const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

	// Create a download link
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = 'Autorizacion-Persona-Juridica.pdf';
	link.click();
};

const generateQRCode = async (data: any) => {
	try {
		const qrCodeDataURL = await QRCode.toDataURL(data);
		return qrCodeDataURL;
	} catch (error) {
		console.error('Error generating QR code:', error);
		return null;
	}
};
export const handleDownloadReporteOficial = async (
	form: FormularioSolicitudes,
	qrCodeData: string
) => {
	//const qrCodeData =		'$2a$11$FM4HD5o0eG3lYSTLXfy4dOIw.k/4IHgudIXAl9/djV4gLy07xWVT.'; // Replace with the data you want to encode
	const newQRCodeData = `https://agromoney.solucionescalidad.com:9500/solicitudes/verificar/${qrCodeData}`;
	const qrCodeDataURL = await generateQRCode(newQRCodeData);
	const existingPdfBytes = await fetch('/template-reporte2.pdf').then((res) =>
		res.arrayBuffer()
	);
	const pdfDoc = await PDFDocument.load(existingPdfBytes);
	let votos: any[] = [];
	if (form.votos) {
		votos = JSON.parse(form.votos);
	}
	// Get the first page of the PDF
	const page = pdfDoc.getPages()[0];
	const votosText = votos.map((voto) => {
		return ` ${voto.nombre}`;
	});
	page.drawText(`Resolución de Crédito`, {
		x: 190,
		y: page.getHeight() - 100,
		size: 18,
		color: rgb(0, 0, 0),
	});
	page.drawText(
		`Reunidos en comité de crédito${votosText}. Se resolvió aprobar la siguiente solicitud de crédito numero ${
			form.idSolicitud
		}, a nombre de ${form?.nombre || ''} ${form?.segundoNombre || ''} ${
			form?.apellido || ''
		} ${form?.segundoApellido || ''}.\nMonto: ${formatCurrency(
			form.monto
		)}\nPlazo: ${form.plazo} meses\nTasa: 15%\nDestino: ${
			form.destino_Credito
		}.\nDando fé de lo anterior firman los miembros del comité adjuntos.\nDado en la ciudad de San Pedro Sula, con fecha ${moment().format(
			'DD/MM/YYYY'
		)}`,
		{
			x: 50,
			y: page.getHeight() - 150,
			size: 14,
			color: rgb(0, 0, 0),
			maxWidth: 500,
		}
	);
	if (qrCodeDataURL) {
		const qrCodeImage = await pdfDoc.embedPng(qrCodeDataURL);
		page.drawImage(qrCodeImage, {
			x: 100, // Adjust the position as needed
			y: page.getHeight() - 795, // Adjust the position as needed
			width: 100, // Adjust the size as needed
			height: 100, // Adjust the size as needed
		});
	}

	page.drawText(
		`Escanee este código para validar la autenticidad de este documento.`,
		{
			x: 100,
			y: page.getHeight() - 800,
			size: 12,
			color: rgb(0, 0, 0),
		}
	);
	// page.drawImage(qrCodeImage, {
	//   x: 100, // Adjust the position as needed
	//   y: page.getHeight() - 400, // Adjust the position as needed
	//   width: 100, // Adjust the size as needed
	//   height: 100, // Adjust the size as needed
	// });
	// page.drawText(`${form.destino_Credito}`, {
	// 	x: 100,
	// 	y: page.getHeight() - 215,
	// 	size: 14,
	// 	color: rgb(0, 0, 0),
	// });

	// 	id: usuariolog?.idUsuario,
	// 	nombre: usuariolog?.nombre,
	// 	telefono: usuariolog?.telefono,
	// 	voto: 'Aprobado',
	// 	fecha: moment().format('DD/MM/YYYY hh:mm'),
	// });

	// votos.map((voto, index) => {
	// 	page.drawText(`${voto?.nombre || ''}`, {
	// 		x: 100,
	// 		y: page.getHeight() - 250 - index * 20,
	// 		size: 14,
	// 		color: rgb(0, 0, 0),
	// 	});
	// });
	//a map of votos where one is on the left and the other is on the right third would be down and so on
	let i = 0;
	let comentairo = '';
	votos.map((voto, index) => {
		if (index % 2 === 0) {
			page.drawText(`${voto?.nombre || ''}`, {
				x: 100,
				y: page.getHeight() - 420 - i * 80,
				size: 14,
				color: rgb(0, 0, 0),
			});
			page.drawText(`${voto?.fecha || ''}`, {
				x: 100,
				y: page.getHeight() - 435 - i * 80,
				size: 14,
				color: rgb(0, 0, 0),
			});
		} else {
			page.drawText(`${voto?.nombre || ''}`, {
				x: 400,
				y: page.getHeight() - 420 - i * 80,
				size: 14,
				color: rgb(0, 0, 0),
			});
			page.drawText(`${voto?.fecha || ''}`, {
				x: 400,
				y: page.getHeight() - 435 - i * 80,
				size: 14,
				color: rgb(0, 0, 0),
			});
			i = i + 1;
		}

		if (voto?.comentario) {
			// comentairo += voto?.comentario;
			comentairo += `${voto?.nombre || ''} - ${voto?.comentario || ''} \n`;
		}
		//
	});
	if (comentairo.length > 0) {
		page.drawText(`${comentairo}`, {
			x: 50,
			y: page.getHeight() - 600,
			size: 12,
			color: rgb(0, 0, 0),
			maxWidth: 500,
		});
	}
	const modifiedPdfBytes = await pdfDoc.save();

	// Create a Blob from the bytes
	const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

	// Create a download link
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = `Reporte-Solicitud#${form.idSolicitud}-${form.nombre}-${form.apellido}.pdf`;
	link.click();
};

const AddTextToPDF: React.FC = () => {
	return (
		<div>
			<button onClick={handleDownloadAgroMoney}>Add Text and Download PDF</button>
		</div>
	);
};

export default AddTextToPDF;
