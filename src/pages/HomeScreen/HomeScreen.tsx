import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import imagenLogin from '../../images/agromoney.png';

const HomeScreen = (): JSX.Element => {
	const navigate = useNavigate();
	return (
		<div className="flex flex-col justify-center items-center w-full h-[90vh] gap-y-8 ">
			<img className="imagen-login" src={imagenLogin} alt="Imagen de login" />

			<div className="flex flex-row gap-2 w-full flex-wrap sm:flex-nowrap justify-center items-end">
				<div className="flex flex-col w-48">
					<Button
						customClassName="bg-green-700 font-semibold text-white h-24"
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
						customClassName="bg-green-700 font-semibold text-white h-24"
						onClick={() => {
							navigate('/Login');
						}}
					>
						Inicio de Sesión/ Registrar
					</Button>
				</div>
			</div>
		</div>
	);
};

export default HomeScreen;
