import React, { useState, useEffect, useRef } from "react";
import Layout from "./components/shared/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import API_IP from "./config";

function RRHH() {
  const [Empresa, setCompany] = useState("NA");
  const [users, setUsers] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    fetch("http://"+API_IP+"/api/Usuarios/" + id)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);

        // Agrega información adicional a formData
        setFormData((prevFormData) => ({
          ...prevFormData,
          IdUsuario: data.idUsuario,
          Nombre: data.nombre,
          Apellido: data.apellido,
          Correo: data.correo,
          Empresa: data.empresa,
          Telefono: data.telefono,
          Perfil: data.perfil,
          fecha_Registro: data.fecha_Registro,
          Sync: data.sync,
          SMS: data.sms,
          Tipo: data.tipo,
          Password: data.password,
          Estatus: data.estatus,
        }));
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const companies = [
    "Cadelga",
    "Fertica",
    "AgroMoney",
    "CATV",
    "Chumbagua",
    "Fertiagrho",
    "Tres Valles",
    "ADN",
  ];

  const perfiles = [
    { id: "A", nombre: "Administrador" },
    { id: "E", nombre: "Empleado" },
    { id: "R", nombre: "RRHH" },
  ];

  const [formData, setFormData] = useState({
    IdUsuario: "",
    Nombre: "",
    Apellido: "",
    Correo: "",
    Telefono: "",
    Empresa: "",
    Perfil: "",
    Estatus: "",
    Tipo:"",
    fecha_Registro: "",
    Password: "",
    Sync: "",
    SMS: "",
  });

  const goBack = () => {
    window.history.back();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    e.preventDefault();

    try {
      const response = await axios.put(
        "http://"+API_IP+"/api/Usuarios/" + id,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("El registro se actualizo exitosamente.");

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div>
        <h5>Control de Usuarios</h5>

        <div className="principal principal-form">
          <form className="principal-form" onSubmit={handleSubmit}>
          <div >
              <div className="input-container">
                <label htmlFor="nombre">Solicitud:</label>
                <input
                  type="text"
                  id="nombre"
                  name="Nombre"
                  value={formData.Nombre}
                  onChange={handleChange}
                  readOnly="true"
                  required
                  style={{ width: "25%", marginBottom: "10px" }}
                />
              </div>
              </div>
            <div className="inputs-container">
              <div className="input-container">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  name="Nombre"
                  value={formData.Nombre}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", marginBottom: "10px" }}
                />
              </div>
              <div className="input-container">
                <label htmlFor="apellido">Apellido:</label>
                <input
                  type="text"
                  id="apellido"
                  name="Apellido"
                  value={formData.Apellido}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", marginBottom: "10px" }}
                />
              </div>


              <div className="input-container">
              <label htmlFor="Sgnombre">2do Nombre:</label>
              <input
                type="text"
                id="Sgnombre"
                name="SegundoNombre"
                required
                value={formData.SegundoNombre}
                onChange={handleChange}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Zñ ]/g, "");
                }}
              />
            </div>
            <div className="input-container">
              <label htmlFor="Sgapellido">2do Apellido:</label>
              <input
                type="text"
                id="Sgapellido"
                name="SegundoApellido"
                required
                value={formData.SegundoApellido}
                onChange={handleChange}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Zñ ]/g, "");
                }}
              />
            </div>
            </div>

            <div className="inputs-container">
            <div className="input-container">
              <label htmlFor="empresa">Empresa:</label>
              <input
                type="text"
                id="empresa"
                name="Empresa"
                value={formData.Empresa}
                onChange={handleChange}
              />
            </div>
            <div className="input-container">
              <label htmlFor="fecha">Fecha de ingreso:</label>
              <input
                type="text"
                id="cargo"
                name="Cargo"
                value={formData.Cargo}
                required
                onChange={handleChange}
              />
            </div>

            <div className="input-container">
              <label htmlFor="cargo">Cargo que ocupa:</label>
              <input
                type="text"
                id="cargo"
                name="Cargo"
                value={formData.Cargo}
                required
                onChange={handleChange}
              />
            </div>
          </div>

            <div
              className="principal-form"
              style={{
                display: "flex",
                fontSize: "12px",
                justifyContent: "flex-start",
              }}
            >
              <button onClick={() => handleSubmit()} type="submit">
                Guardar
              </button>
              <button style={{ marginLeft: "10px" }} type="button" onClick={() => goBack()}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default RRHH;
