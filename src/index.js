import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import './index.css';
import Login from './Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Principal from './Principal';
import NuevaSlt from './NuevaSlt';
import Usuarios from './Usuarios';
import Conocenos from './Conocenos';
import NuevaSlt2 from './pages/NuevaSlt/NuevaSlt';
import Login2 from './pages/Login/Login';
import HomeScreen from './pages/HomeScreen/HomeScreen';
import ControlUsuarios from './ControlUsuarios';
import RRHH from './RRHH';
import AnalisisAgro from './View/AnalisisAgro';
import VerSlt from './pages/NuevaSlt/VerSlt';
import ControlUsuariosMenu from './pages/ControlUsuarios/ControlUsuariosMenu';
import ControlUsuario from './pages/ControlUsuarios/ControlUsuario';
import VerSltComite from './pages/NuevaSlt/VerSltComite';
import VerificarSlt from './pages/NuevaSlt/VerificarSlt';
import setupAxiosInterceptors from './pages/Login/AxiosInterceptor';
const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Create the root using createRoot
setupAxiosInterceptors();
// Use root instead of ReactDOM.render
root.render(
	<Router>
		<Routes>
			<Route exact path="/" element={<HomeScreen />} />
			<Route exact path="/Login" element={<Login2 />} />
			<Route exact path="/Login2" element={<Login />} />
			<Route exact path="/Principal" element={<Principal />} />
			<Route exact path="/nueva-solicitud" element={<NuevaSlt2 />} />
			<Route exact path="/nueva-solicitud/:ids" element={<NuevaSlt />} />
			<Route exact path="/Usuarios" element={<Usuarios />} />
			<Route exact path="/Conocenos" element={<Conocenos />} />
			<Route exact path="/Revision" element={<RRHH />} />
			<Route exact path="/Analisis/:ida" element={<AnalisisAgro />} />
			<Route exact path="/control-usuarios/:id" element={<ControlUsuarios />} />
			<Route exact path="/control-usuario/:id" element={<ControlUsuario />} />
			<Route exact path="/control-usuarios" element={<ControlUsuariosMenu />} />
			<Route exact path="/solicitud/:id" element={<VerSlt />} />
			<Route exact path="/solicitud-reporte/:id" element={<VerSltComite />} />
			<Route exact path="/solicitudes/verificar/:id" element={<VerificarSlt />} />
		</Routes>
	</Router>
);
