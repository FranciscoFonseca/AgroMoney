import React, { useState } from "react";
//import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import imagenLogin from "./images/agromoney.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API_IP from "./config";

function Login() {
  const [Nombre, setName] = useState("");
  const [Correo, setEmail] = useState("");
  const [Telefono, setPhone] = useState("");
  const [Password, setPassword] = useState("");
  const [Token, setToken] = useState("");
  const [Apellido, setApellido] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [Empresa, setCompany] = useState("NA");
  const [tipo, settipcliente] = useState("Empleado");
  const [isLoading, setIsLoading] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const navigate = useNavigate();
  const perfil = "E";
  const idUsuario = 0;
  const Estatus = "A";
  const SMS = "N";
  const Sync = "Y";
  const fecha_Registro = new Date();
  const [newPassword, setnewPassword] = useState("1234");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  // setnewPassword("1234")

  const companies = ["Natural", "Juridica"];

  const tipocliente = ["Cliente", "Empleado"];

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
  };

  const handleTipoClienteChange = (event) => {
    const value = event.target.value;
    settipcliente(value);
    setShowCompany(value === "Empleado");
    setCompany("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aquí iría tu lógica de autenticación para verificar las credenciales del usuario.
      // Si la autenticación es exitosa, podrías hacer lo siguiente para redirigir al usuario a la página principal:
      // history.push("/Principal"); // Cambia "/main" por la ruta de tu página principal. http://192.100.10.187/
      const response = await axios.post(
        "http://" + API_IP + "/api/Usuarios/login/",
        {
          Telefono,
          Password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem(
          "logusuario",
          JSON.stringify(response.data.usuario)
        );
        localStorage.setItem("token", response.data.token);
        setPassword("");
        navigate("Principal");
        window.close();
      } else {
        alert("Credenciales incorrectas.");
      }
    } catch (error) {
      alert("Credenciales incorrectas.");
      console.log(error);
    }
    setIsLoading(false);
    // Cierra la ventana actual de inicio de sesión.
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://" + API_IP + "/api/Usuarios/", {
        idUsuario,
        Nombre,
        Apellido,
        Password,
        Correo,
        Telefono,
        Empresa,
        tipo,
        perfil,
        Estatus,
        fecha_Registro,
        SMS,
        Sync,
      });
      // setSuccessMessage("El registro se completo exitosamente.");
      alert("El registro se completo exitosamente.");
      setIsLoading(false);
      setName("");
      setApellido("");
      setEmail("");
      setPhone("");
      settipcliente("");
      setPassword("");
      setActiveTab("login");

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePasswordReset = async () => {
    try {
      if (Telefono === "") {
        alert("Ingrese un telefono valido.");
      } else {
        const response = await axios.post(
          "http://" + API_IP + "/api/Usuarios/resetPassword/",
          {
            Telefono,
            newPassword,
          }
        );

        if (response.status === 200) {
          alert(
            "Se ha enviado un SMS a su numero celular con la nueva contraseña."
          );
        } else {
          alert("Ha ocurrido un error al enviar el correo electrónico.");
        }
      }
    } catch (error) {
      console.log(error);
      alert("Ha ocurrido un error al enviar el correo electrónico.");
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleApellidoChange = (event) => {
    setApellido(event.target.value);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  return (
    <div>
      <div className="contenedor-imagen">
        <img className="imagen-login" src={imagenLogin} alt="Imagen de login" />
      </div>

      <div className="login-container">
        <div className="login-tabs">
          <div
            className={`login-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => handleTabClick("login")}
          >
            Iniciar Sesión
          </div>
          <div
            className={`login-tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => handleTabClick("register")}
          >
            Registrar
          </div>
        </div>
        {activeTab === "login" && (
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="Telefono">Teléfono:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={Telefono}
                onChange={handlePhoneChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="Contraseña">Contraseña:</label>
              <div className="input-password">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={Password}
                  className="pass"
                  onChange={handlePasswordChange}
                  required
                />
                {passwordVisible ? (
                  <FaEyeSlash
                    className="toggle-password"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <FaEye
                    className="toggle-password"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>

              <label htmlFor="Token">Token:</label>
              <input
                type="number"
                id="token"
                name="token"
                value={Token}
                onChange={handleTokenChange}
              />
            </div>
            <button type="submit">
              {isLoading ? "Iniciando..." : "Iniciar sesión"}
            </button>

            <label
              type="button"
              onClick={() => handlePasswordReset()}
              style={{ marginLeft: "5%", fontSize: "14px" }}
            >
              ¿Olvidaste tu contraseña?
            </label>
          </form>
        )}
        {activeTab === "register" && (
          <div>
            <form className="login-form" onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <p style={{ fontSize: "14px" }}>
                  Llena los siguientes campos para crear tu cuenta.
                </p>

                <label htmlFor="Nombre">Nombre:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={Nombre}
                  onChange={handleNameChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="Apellido">Apellido:</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={Apellido}
                  onChange={handleApellidoChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="Correo">Correo:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={Correo}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="Telefono">Teléfono:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={Telefono}
                  onChange={handlePhoneChange}
                  required
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9+-]/g, "");
                  }}
                />
              </div>
              {/* <div className="form-group">
                <label htmlFor="tipcliente">Cliente:</label>
                <select
                  id="tipcliente"
                  name="tipcliente"
                  value={tipo}
                  onChange={handleTipoClienteChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccione tipo</option>
                  {tipocliente.map((tipcliente) => (
                    <option key={tipcliente} value={tipcliente}>
                      {tipcliente}
                    </option>
                  ))}
                </select>
              </div> */}

              {
                <div className="form-group">
                  <label htmlFor="company">Tipo de Persona:</label>
                  <select
                    id="tipo_de_persona"
                    name="tipo_de_persona"
                    value={Empresa}
                    onChange={handleCompanyChange}
                    className="form-select"
                    required
                  >
                    <option value="">Seleccione</option>
                    {companies.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>
              }

              <div className="form-group">
                <label htmlFor="Contraseña">Contraseña:</label>
                <div className="input-password">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    value={Password}
                    className="pass"
                    onChange={handlePasswordChange}
                    required
                  />
                  {passwordVisible ? (
                    <FaEyeSlash
                      className="toggle-password"
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <FaEye
                      className="toggle-password"
                      onClick={togglePasswordVisibility}
                    />
                  )}
                </div>
              </div>
              <button type="submit">
                {isLoading ? "Registrando..." : "Registrarse"}
              </button>
            </form>
          </div>
        )}
        {isLoading && <div className="spinner" />}
      </div>
    </div>
  );
}

export default Login;
