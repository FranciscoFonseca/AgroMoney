// PdfGenerator.js
import FormularioAgromoney from './FormularioAgromoney';
import ReactPDF from '@react-pdf/renderer';

export const generatePdf = async (title: string, content: string) => {
	ReactPDF.render(
		<FormularioAgromoney title={''} content={''} />,
		`${__dirname}/example.pdf`
	);
};
