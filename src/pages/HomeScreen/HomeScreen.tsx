import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import imagenLogin from '../../images/agromoney.png';
import { useEffect } from 'react';

const HomeScreen = (): JSX.Element => {
	const navigate = useNavigate();
	useEffect(() => {
		document.body.style.backgroundImage = 'url(/fondoAgro.jpg)';
		document.body.style.backgroundSize = 'auto 100%';
		document.body.style.backdropFilter = 'blur(8px)';
		return () => {
			// Clean up any other styles if necessary
			document.body.style.backgroundImage = '';
			document.body.style.backgroundSize = '';
			document.body.style.backdropFilter = '';
		};
	}, []);

	return (
		<div className="flex flex-col justify-center items-center w-full h-[90vh] gap-y-8">
			<img className="imagen-login" src={imagenLogin} alt="Imagen de login" />

			<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap justify-center items-end">
				<div className="flex flex-col w-48">
					<Button
						customClassName="bg-green-700 font-semibold text-white h-24 w-48"
						onClick={() => {
							navigate('/nueva-solicitud');
						}}
					>
						Nueva Solicitud
					</Button>
				</div>
				<div className="flex flex-col w-48 items-center gap-y-1">
					<h1>¿ Ya eres Cliente ?</h1>
					<Button
						customClassName="bg-green-700 font-semibold text-white h-24 w-48"
						onClick={() => {
							navigate('/Login');
						}}
					>
						Inicio de Sesión
					</Button>
				</div>
			</div>
		</div>
	);
};

export default HomeScreen;
