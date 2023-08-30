import { useForm } from 'react-hook-form';
import LayoutCustom from '../../components/Navbar/Layout';
import { Usuario } from '../../tipos/Usuario';
import { useEffect, useState } from 'react';
import axios from 'axios';
import API_IP from '../../config';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import ControlUsuarioModal from './ControlUsuarioModal';

const ControlUsuariosMenu = () => {
	const [usuarios, setUsuarios] = useState<Usuario[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10); // Change this according to your preference
	const [isOpenEditar, setIsOpenEditar] = useState(false);
	const [selectedUsuario, setSelectedUsuario] = useState<Usuario>();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Usuario>();

	useEffect(() => {
		const fetchUsuarios = async () => {
			const res = await axios.get(`http://${API_IP}/api/usuarios`);
			console.log(res.data);
			setUsuarios(res.data);
		};
		fetchUsuarios();
	}, []);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentUsuarios = usuarios.slice(indexOfFirstItem, indexOfLastItem);

	return (
		<>
			<LayoutCustom>
				<div>
					<h1>ControlUsuariosMenu</h1>
				</div>
				<div className="flex gap-y-2 flex-col items-center bg-gray-100 p-4 rounded-lg shadow-lg relative mb-2 mt-2">
					<div className="absolute end-2">
						<>
							<Button
								type="button"
								customClassName="bg-green-700 text-white font-semibold"
							>
								Nuevo Usuario
							</Button>
						</>
					</div>
					<div className="border-b-2 w-full flex justify-between items-center border-black">
						<p className="text-xl font-semibold flex-grow text-center">
							Control de Usuarios
						</p>
					</div>
					{/* ... rest of your form and layout ... */}
					<table className="table-auto w-full mt-4">
						<thead>
							<tr>
								<th className="border border-black">Nombre</th>
								<th className="border border-black">Apellido</th>
								<th className="border border-black">Correo</th>
								<th className="border border-black">Rol</th>
								<th className="border border-black"> </th>
							</tr>
						</thead>
						<tbody>
							{currentUsuarios.map((usuario) => (
								<tr key={usuario.idUsuario}>
									<td className="border border-black p-1">{usuario.nombre}</td>
									<td className="border border-black p-1">{usuario.apellido}</td>
									<td className="border border-black p-1">{usuario.correo}</td>
									<td className="border border-black p-1">{usuario.tipo}</td>
									<td className="border border-black p-1 justify-center align-middle">
										<Button
											customClassName="bg-green-700 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
											onClick={() => {
												//navigate(`/control-usuario/${usuario.idUsuario}`);
												setSelectedUsuario(usuario);
												setIsOpenEditar(true);
											}}
										>
											Editar
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="flex justify-center my-4 gap-x-4">
						<Button
							className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded"
							onClick={() => setCurrentPage(currentPage - 1)}
							disabled={currentPage === 1}
						>
							Anterior
						</Button>
						<Button
							className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded"
							onClick={() => setCurrentPage(currentPage + 1)}
							disabled={indexOfLastItem >= usuarios.length}
						>
							Siguiente
						</Button>
					</div>
				</div>
			</LayoutCustom>
			<ControlUsuarioModal
				isOpen={isOpenEditar}
				usuario={selectedUsuario}
				closeModal={() => setIsOpenEditar(false)}
			/>
		</>
	);
};

export default ControlUsuariosMenu;
