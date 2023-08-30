import React, { useState, useEffect } from "react";
import "./Principal.css";
import Layout from "./components/shared/Layout";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import API_IP from "./config";

function Usuarios() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://"+API_IP+"/api/Usuarios")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  const handleSeleccionarSolicitud = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
  };

  return (
    <Layout>
      <h5>Usuarios</h5>
      <div className="principal principal-form" style={{ marginBottom: "1%" }}>
        <form className="principal-form">
          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Empresa</th>
                  <th>Telefono</th>
                  <th>Correo</th>
                  <th>Fecha</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.idUsuario}
                    className={
                      user === solicitudSeleccionada ? "selecionada" : ""
                    }
                    onClick={() => handleSeleccionarSolicitud(user)}
                  >
                    <td>{user.idUsuario}</td>
                    <td>{user.nombre}</td>
                    <td>{user.apellido}</td>
                    <td>{user.empresa}</td>
                    <td>{user.telefono}</td>
                    <td>{user.correo}</td>
                    <td>
                      {format(
                        new Date(user.fecha_Registro),
                        "dd/MM/yyyy HH:mm:ss"
                      )}
                    </td>
                    <td>
                      <Link to={`/control-usuarios/${user.idUsuario}`}>
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Usuarios;
