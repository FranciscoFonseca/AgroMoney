import React, { useState } from 'react';
import imagenLogin from '../../images/agromoney2.png';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import ModalProfesion from '../../pages/NuevaSlt/components/ModalProfesion';

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const openModal = () => {
		setModalIsOpen(true);
	};
	const closeModal = () => {
		setModalIsOpen(false);
	};
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};
	const handleLogout = () => {
		localStorage.clear();
		const newurl = window.location.protocol + '//' + window.location.host;
		window.location.replace(newurl);
	};
	const storedValue = localStorage.getItem('logusuario');
	let usuariolog;

	if (storedValue !== null) {
		try {
			usuariolog = JSON.parse(storedValue);
		} catch (error) {
			console.error('Error parsing JSON:', error);
		}
	}
	const navigate = useNavigate();
	return (
		<>
			{usuariolog && usuariolog.perfil === 'A' && (
				<ModalProfesion
					isOpen={modalIsOpen}
					closeModal={closeModal}
				></ModalProfesion>
			)}
			<nav className="bg-gray-800 w-full top-0 z-10 relative">
				<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="relative flex items-center justify-between h-16">
						<div className="flex items-center justify-start sm:items-stretch sm:justify-start">
							<div className="flex-shrink-0 text-white font-bold text-xl">
								{usuariolog ? (
									<img
										className="object-contain h-12 hover:cursor-pointer"
										src={imagenLogin}
										alt="Imagen de login"
										onClick={() => {
											navigate('/Principal');
										}}
									/>
								) : (
									<img
										className="object-contain h-12 hover:cursor-pointer"
										src={imagenLogin}
										alt="Imagen de login"
										onClick={() => {
											navigate('/');
										}}
									/>
								)}
							</div>
						</div>
						<div className="hidden sm:block sm:ml-6">
							{usuariolog && (
								<div className="flex space-x-4">
									<p className="text-white px-3 py-2 rounded-md text-sm font-medium">
										Bienvenido, {usuariolog.nombre} {usuariolog.apellido}
									</p>
									<a
										href="/Principal"
										className="text-white px-3 py-2 rounded-md text-sm font-medium"
									>
										Inicio
									</a>
									{usuariolog.perfil === 'A' && (
										<>
											<a
												href="/control-usuarios"
												className="text-white px-3 py-2 rounded-md text-sm font-medium"
											>
												Control Usuarios
											</a>
											<a
												onClick={openModal}
												className="text-white px-3 py-2 rounded-md text-sm font-medium hover:cursor-pointer"
											>
												Control Profesiones
											</a>
										</>
									)}

									<a
										className="text-white px-3 py-2 rounded-md text-sm font-medium flex flex-row gap-x-1 hover:cursor-pointer"
										onClick={handleLogout}
									>
										<FaSignOutAlt className="text-xl" />
										Cerrar Sesión
									</a>
								</div>
							)}
						</div>
						{usuariolog && (
							<div className="block sm:hidden">
								<button
									onClick={toggleMenu}
									className="flex items-center px-3 py-2 border rounded text-white border-white"
								>
									<svg
										className="h-4 w-4 fill-current"
										viewBox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											d="M3.293 5.293a1 1 0 011.414 0L10 10.586l5.293-5.293a1 1 0 111.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							</div>
						)}
					</div>
				</div>
				{/* Mobile menu */}
				{isMenuOpen && (
					<div className="sm:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1">
							<a
								href="/Principal"
								className="text-white block px-3 py-2 rounded-md text-base font-medium"
							>
								Inicio
							</a>
							<a
								className="text-white px-3 py-2 rounded-md text-sm font-medium flex flex-row gap-x-1 hover:cursor-pointer"
								onClick={handleLogout}
							>
								<FaSignOutAlt className="text-xl" />
								Cerrar Sesión
							</a>
						</div>
					</div>
				)}
			</nav>
		</>
	);
};

export default Navbar;
