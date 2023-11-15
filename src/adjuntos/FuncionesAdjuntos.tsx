// PdfGenerator.js
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import FormularioAgromoney from './FormularioAgromoney';
import html2canvas from 'html2canvas';
import ReactPDF from '@react-pdf/renderer';
import MyDocument from './PDFFormularioAgromoney';

interface PdfGeneratorProps {
	title: string;
	content: string;
}

export const generatePdf = async (title: string, content: string) => {
	ReactPDF.render(<FormularioAgromoney title={''} content={''} />, `${__dirname}/example.pdf`);
};
