import React from 'react';
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Font,
} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
	page: {
		flexDirection: 'row',
		backgroundColor: '#E4E4E4',
	},
	section: {
		margin: 10,
		padding: 10,
		flexGrow: 1,
	},
});

Font.register({
	family: 'Verdana',
	fonts: [
		{
			src: '../adjuntos/pdfFonts/verdana.ttf',
		},
		{
			src: '../adjuntos/pdfFonts/verdana-bold.ttf',
			fontWeight: 'bold',
		},
	],
});
// Create Document Component
const MyDocument = () => (
	<Document>
		<Page size="LETTER" style={styles.page}>
			<View
				style={{
					position: 'absolute',
					top: '1.86in',
					left: '3.23in',
					width: '2.80in',
					lineHeight: '0.18in',
				}}
			>
				<Text
					style={{
						fontStyle: 'normal',
						fontWeight: 'bold',
						fontSize: '12pt',
						// fontFamily: 'Verdana',
						color: '#000000',
					}}
				>
					AUTORIZACION DE DEBITO
				</Text>
			</View>
			<View
				style={{
					position: 'absolute',
					top: '2.74in',
					left: '1.29in',
					width: '6.70in',
					lineHeight: '0.25in',
				}}
			>
				<Text
					style={{
						fontStyle: 'normal',
						fontWeight: 'bold',
						fontSize: '12pt',
						// fontFamily: 'Verdana',
						color: '#000000',
					}}
				>
					___________________________________________________,
				</Text>
				<br />
				<Text
					style={{
						fontStyle: 'normal',
						fontWeight: 'normal',
						fontSize: '12pt',
						// fontFamily: 'Verdana',
						color: '#000000',
					}}
				>
					con ID ___________________, actuando en mi condición de
				</Text>
			</View>
			<View style={styles.section}>
				<Text>Section #2</Text>
			</View>
		</Page>
	</Document>
);

export default MyDocument;
