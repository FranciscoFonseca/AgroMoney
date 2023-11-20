import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Button from '../../../components/Button/Button';
import clsx from 'clsx';

Modal.setAppElement('#root');

interface ModalProps {
	isOpen: boolean;
	closeModal: () => void;
	handler: () => void;
}

const ModalTyC: React.FC<ModalProps> = ({ isOpen, closeModal, handler }) => {
	const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
	const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
	const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
		const target = e.target as HTMLDivElement;
		const isAtBottom =
			target.scrollTop + target.clientHeight >= target.scrollHeight;

		setIsScrolledToBottom(isAtBottom);
	};

	useEffect(() => {
		if (isScrolledToBottom) setHasScrolledToBottom(true);
	}, [isScrolledToBottom]);
	useEffect(() => {
		const modalContent = document.getElementById(
			'modal-content'
		) as HTMLDivElement;
		// @ts-ignore
		modalContent?.addEventListener('scroll', handleScroll);

		return () => {
			// @ts-ignore
			modalContent?.removeEventListener('scroll', handleScroll);
		};
	}, []); // Run this effect only once on component mount
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			contentLabel="ModalTyC"
			style={{
				overlay: {
					backgroundColor: 'rgba(0,0,0,0.5)',
				},
				content: {
					backgroundColor: '#fff',
					margin: 'auto',
					width: '550px',
					height: '450px',
					border: '1px solid #ccc',
					borderRadius: '4px',
					outline: 'none',
					padding: '20px',
					overflow: 'hidden',
					justifyContent: 'space-between',
					display: 'flex',
					flexDirection: 'column',
				},
			}}
		>
			<div className="w-full flex justify-between">
				<div className="flex items-center">
					<h1 className="text-3xl">Terminos y Condiciones</h1>
				</div>
				<button onClick={closeModal} className="text-lg">
					X
				</button>
			</div>
			<div
				id="modal-content"
				className="flex gap-y-2 flex-col mt-2 whitespace-pre-wrap"
				onScroll={handleScroll}
				style={{ maxHeight: '250px', overflowY: 'auto' }}
			>
				{/* Terms and conditions */}
				{/* <p>
					1. CONFIDENCIALIDAD {'\n'}
					{'\t'}1. Toda la Información que “El CLIENTE” entregue a “LA EMPRESA” en
					ejecución de este Contrato, incluyendo de manera enunciativa y no
					limitativa, serán usadas para los fines que se establecen en el presente
					Contrato; y serán catalogadas como Confidencial (en adelante la
					“Información”). {'\n'}
					{'\t'}2. La obligación a que se refiere esta cláusula surtirá sus efectos a
					partir del suministro de la Información y continuará vigente por un periodo
					de 10 (diez) años contados a partir de la fecha de terminación del presente
					Contrato por cualquier causa. {'\n'}
					{'\t'}3. La obligación de confidencialidad sobre la Información no será
					aplicable en cualquiera de los siguientes casos y supuestos: {'\n'}
					a. Si fuera del dominio público al momento de recibirla de “El CLIENTE”, o
					que pasara a serlo sin infringir alguna de las obligaciones aquí
					establecidas; {'\n'}
					b. Si fuera conocida y puede ser demostrado que ha sido conocida por “LA
					EMPRESA” al momento de recibirla de “El CLIENTE” o que expresamente no haya
					sido adquirida directa o indirectamente de la primera sobre una base de
					confidencialidad; {'\n'}
					c. Llegue a ser del conocimiento de “LA EMPRESA” sobre una base de no
					confidencialidad, a través de una tercera fuente cuya adquisición y
					revelación fue enteramente independiente de “El CLIENTE”, sin infracción de
					ninguna de las obligaciones aquí establecidas; {'\n'}
					d. Su revelación sea aprobada por escrito por “El CLIENTE”; o {'\n'}
					e. Sea requerida por cualquier autoridad competente. {'\n'}
					{'\t'}4. En caso de que “LA EMPRESA” incumpla con su obligación de
					Confidencialidad aquí establecida, deberá pagar los daños y perjuicios que
					la divulgación de la Información le llegare a causar a “El CLIENTE”. 5. “LA
					EMPRESA” está obligado a tomar todas las medidas apropiadas para asegurar
					la confidencialidad de la Información.
				</p>
                 */}
				<pre style={{ whiteSpace: 'pre-wrap' }}>
					<b>1. CONFIDENCIALIDAD</b> {'\n'}
					{'\t'}<b>1.</b> Toda la Información que “El CLIENTE” entregue a “LA EMPRESA” en
					ejecución de este Contrato, incluyendo de manera enunciativa y no
					limitativa, serán usadas para los fines que se establecen en el presente
					Contrato; y serán catalogadas como Confidencial (en adelante la
					“Información”). {'\n'}
					{'\t'}<b>2.</b> La obligación a que se refiere esta cláusula surtirá sus efectos a
					partir del suministro de la Información y continuará vigente por un periodo
					de 10 (diez) años contados a partir de la fecha de terminación del presente
					Contrato por cualquier causa. {'\n'}
					{'\t'}<b>3.</b> La obligación de confidencialidad sobre la Información no será
					aplicable en cualquiera de los siguientes casos y supuestos: {'\n'}
					{'\t'}
					{'\t'}<b>a.</b> Si fuera del dominio público al momento de recibirla de “El
					CLIENTE”, o que pasara a serlo sin infringir alguna de las obligaciones
					aquí establecidas; {'\n'}
					{'\t'}
					{'\t'}<b>b.</b> Si fuera conocida y puede ser demostrado que ha sido conocida por
					“LA EMPRESA” al momento de recibirla de “El CLIENTE” o que expresamente no
					haya sido adquirida directa o indirectamente de la primera sobre una base
					de confidencialidad; {'\n'}
					{'\t'}
					{'\t'}<b>c.</b> Llegue a ser del conocimiento de “LA EMPRESA” sobre una base de no
					confidencialidad, a través de una tercera fuente cuya adquisición y
					revelación fue enteramente independiente de “El CLIENTE”, sin infracción de
					ninguna de las obligaciones aquí establecidas; {'\n'}
					{'\t'}
					{'\t'}<b>d.</b> Su revelación sea aprobada por escrito por “El CLIENTE”; o {'\n'}
					{'\t'}
					{'\t'}<b>e.</b> Sea requerida por cualquier autoridad competente. {'\n'}
					{'\t'}<b>4.</b> En caso de que “LA EMPRESA” incumpla con su obligación de
					Confidencialidad aquí establecida, deberá pagar los daños y perjuicios que
					la divulgación de la Información le llegare a causar a “El CLIENTE”. 5. “LA
					EMPRESA” está obligado a tomar todas las medidas apropiadas para asegurar
					la confidencialidad de la Información.
				</pre>

				{isScrolledToBottom && (
					<div style={{ textAlign: 'center', color: 'red' }}></div>
				)}
			</div>

			<div className="flex justify-end gap-2 mt-4">
				<Button
					type="button"
					customClassName="bg-red-700 font-semibold text-white"
					onClick={closeModal}
				>
					Cerrar
				</Button>
				<Button
					type="button"
					customClassName={clsx(
						' font-semibold text-white',
						!hasScrolledToBottom ? 'cursor-not-allowed bg-gray-300' : 'bg-green-700 '
					)}
					onClick={() => handler()}
					disabled={!hasScrolledToBottom}
				>
					Aceptar
				</Button>
			</div>
		</Modal>
	);
};

export default ModalTyC;
