import React from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import moment from 'moment';
import 'moment/locale/es';
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

	page.drawText(`${form?.dni || ''}`, {
		x: 155,
		y: page.getHeight() - 215,
		size: 16,
		color: rgb(0, 0, 0),
	});

	page.drawText(`${form?.empresa || ''}`, {
		x: 205,
		y: page.getHeight() - 235,
		size: 16,
		color: rgb(0, 0, 0),
	});

	page.drawText(`${form?.salario || ''}`, {
		x: 120,
		y: page.getHeight() - 300,
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
		x: 150,
		y: page.getHeight() - 134,
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
	link.download = 'F-BAC-Fórmula-De-Aceptación-De-Pago-BAC-BAC.pdf';
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
			y: page.getHeight() - 120,
			size: 14,
			color: rgb(0, 0, 0),
		}
	);

	page.drawText(`${form?.dni || ''}`, {
		x: 150,
		y: page.getHeight() - 134,
		size: 14,
		color: rgb(0, 0, 0),
	});

	const fecha = new Date();
	const dia = fecha.getDate();
	const mes = fecha.getMonth() + 1;
	const anio = fecha.getFullYear();
	const last2 = anio.toString().slice(2, 4);

	page.drawText(dia.toString(), {
		x: 190,
		y: page.getHeight() - 222,
		size: 16,
		color: rgb(0, 0, 0),
	});
	page.drawText(mes.toString(), {
		x: 245,
		y: page.getHeight() - 222,
		size: 16,
		color: rgb(0, 0, 0),
	});
	page.drawText(last2.toString(), {
		x: 290,
		y: page.getHeight() - 222,
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
		y: page.getHeight() - 158,
		size: 14,
		color: rgb(0, 0, 0),
	});

	const fecha = new Date();
	const dia = fecha.getDate();
	const mes = fecha.getMonth() + 1;
	const anio = fecha.getFullYear();
	const last2 = anio.toString().slice(2, 4);

	page.drawText(dia.toString(), {
		x: 190,
		y: page.getHeight() - 235,
		size: 16,
		color: rgb(0, 0, 0),
	});
	page.drawText(mes.toString(), {
		x: 245,
		y: page.getHeight() - 235,
		size: 16,
		color: rgb(0, 0, 0),
	});
	page.drawText(last2.toString(), {
		x: 292,
		y: page.getHeight() - 235,
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
	link.download = 'Autorizacion-Persona-Juridica.pdf';
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
