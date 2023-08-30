import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Container from './Container';
import { ToastContainer } from 'react-toastify';
interface LayoutProps {
	children: ReactNode;
}

const LayoutCustom = ({ children }: LayoutProps) => {
	return (
		<div>
			<Navbar />
			<ToastContainer />
			<Container>{children}</Container>
		</div>
	);
};

export default LayoutCustom;
