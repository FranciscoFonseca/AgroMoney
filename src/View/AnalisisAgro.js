import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/shared/Layout";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import API_IP from "../config";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { v4 as uuidv4 } from "uuid";
import "../Principal.css";

function AnalisisAgro() {
  const [Empresa, setCompany] = useState("NA");
  const [users, setUsers] = useState([]);
  const [fechaVencimiento, setfechaVencimiento] = useState("");
  const [tabla, setTabla] = useState([]);
  const [tipo, setTipo] = useState("");

  const { ida } = useParams();

  const estatus = ["Vigente", "Atrasado", "En mora", "Juridico", "Castigo"];

  const Incluir = ["Si", "No"];

  const Tipos = ["Institucion", "Comercial"];

  const handleIncluirChange = (event) => {
    const incluir = event.target.value;
  };

  const handleTipoChange = (event) => {
    const tipo = event.target.value;
    formData.Tipo = tipo;
  };

  const handleEstatusChange = (event) => {
    const estatu = event.target.value;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("USA", {
      style: "currency",
      currency: "HNL",
    }).format(value);
  };

  const [formData, setFormData] = useState({
    Referencia: "",
    Limite: "",
    SaldoActual: "",
    Tipo: "",
    FormaPago: "",
    ValorCuota: "",
    Incluir: "",
    FechaVenc: "",
    Estatus: "",
    SaldoMora: "",
  });

  const goBack = () => {
    window.history.back();
  };

  const goAgregar = () => {
    const nuevoItem = { id: uuidv4(), ...formData };
    setTabla([...tabla, nuevoItem]);
  };

  const handleEliminar = (id) => {
    const nuevaTabla = tabla.filter((item) => item.id !== id);
    setTabla(nuevaTabla);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit =  (e) => {
    // e.preventDefault();
    // console.log(formData);
    // e.preventDefault();

    try {

      alert("El registro se actualizo exitosamente.");
      goBack();

      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFechaVcChange = (date) => {
    setfechaVencimiento(date);
    formData.FechaVenc = date;
  };

  const Table = ({ data }) => {
    return (
      <div>
        <div className="user-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th></th>
                <th>Referencia</th>
                <th>Tipo</th>
                <th>Limite</th>
                <th>Saldo Actual</th>
                <th>Forma de Pago</th>
                <th>Valor Cuota</th>
                <th>Incluir</th>
                <th>Fecha Vencimiento</th>
                <th>Estatus</th>
                <th>Saldo Mora</th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((item) => (
                <tr key={item.id}>
                  <td className="autosizefit">
                    <Link
                      style={{ fontSize: 12 }}
                      onClick={() => handleEliminar(item.id)}
                    >
                      Eliminar
                    </Link>
                  </td>
                  <td className="autosizefit">{item.Referencia}</td>
                  <td className="autosizefit">{item.Tipo}</td>
                  <td className="autosizefit">{item.Limite}</td>
                  <td className="align-left autosizefit">
                    {formatCurrency(item.SaldoActual)}
                  </td>
                  <td className="autosizefit">{item.FormaPago}</td>
                  <td className="autosizefit">
                    {formatCurrency(item.ValorCuota)}
                  </td>
                  <td className="autosizefit">{item.Incluir}</td>
                  <td className="autosizefit">{item.FechaVenc}</td>
                  <td className="autosizefit">{item.Estatus}</td>
                  <td className="autosizefit">
                    {formatCurrency(item.SaldoMora)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div>
        <h5>Analisis Agromoney</h5>

        <div className="principal principal-form">
          <form className="principal-form" onSubmit={handleSubmit}>
            <h6>Solicitud: #{ida}</h6>

            <div className="inputs-container">
              <div className="input-container">
                <label htmlFor="Monto">Destino:</label>
                <input
                  type="text"
                  id="monto"
                  name="monto"
                  value={FormData.Monto}
                  onChange={handleChange}
                />
              </div>
              <div className="input-container">
                <label htmlFor="Monto">Monto:</label>
                <input
                  type="text"
                  id="monto"
                  name="monto"
                  value={FormData.Monto}
                  onChange={handleChange}
                />
              </div>

              <div className="input-container">
                <label htmlFor="Monto">Plazo:</label>
                <input
                  type="text"
                  id="plazo"
                  name="plazo"
                  value={FormData.Plazo}
                  onChange={handleChange}
                />
              </div>

              <div className="input-container">
                <label htmlFor="Monto">Cuota:</label>
                <input
                  type="text"
                  id="cuota"
                  name="couta"
                  value={FormData.cuota}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="linea-h"></div>

            <div className="inputs-container">
              <div className="input-container">
                <label htmlFor="banco1">Referencia:</label>
                <input
                  type="text"
                  id="banco1"
                  name="Referencia"
                  value={FormData.Referencia}
                  onChange={handleChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, "");
                  }}
                />
              </div>

              <div className="input-container">
                <label htmlFor="banco1">Tipo:</label>
                <select
                  id="Tipo"
                  name="Tipo"
                  required
                  value={formData.Tipo}
                  className="select"
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  {Tipos.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-container">
                <label htmlFor="limite">Limite:</label>
                <input
                  type="text"
                  id="limite"
                  name="Limite"
                  style={{ textAlign: "right" }}
                  value={formData.Limite}
                  onChange={handleChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9. ]/g, "");
                  }}
                />
              </div>

              <div className="input-container">
                <label htmlFor="comercial1">Saldo actual:</label>
                <input
                  type="text"
                  id="SaldoActual"
                  name="SaldoActual"
                  style={{ textAlign: "right" }}
                  value={formData.SaldoActual}
                  onChange={handleChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9. ]/g, "");
                  }}
                />
              </div>
              <div className="input-container">
                <label htmlFor="montoc1">Forma de pago:</label>
                <input
                  type="text"
                  id="montoc1"
                  name="FormaPago"
                  style={{ textAlign: "right" }}
                  onChange={handleChange}
                  value={formData.FormaPago}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9. ]/g, "");
                  }}
                />
              </div>
            </div>

            <div className="inputs-container">
              <div className="input-container">
                <label htmlFor="montoc1">Valor cuota:</label>
                <input
                  type="text"
                  id="montoc1"
                  name="ValorCuota"
                  style={{ textAlign: "right" }}
                  value={formData.ValorCuota}
                  onChange={handleChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9. ]/g, "");
                  }}
                />
              </div>
              <div className="input-container">
                <label htmlFor="banco1">Incluir:</label>
                <select
                  id="incluir"
                  name="Incluir"
                  required
                  value={formData.Incluir}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="">Seleccione</option>
                  {Incluir.map((inclu) => (
                    <option key={inclu} value={inclu}>
                      {inclu}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-container">
                <label htmlFor="monto1">Fecha Vencimiento:</label>
                <DatePicker
                  placeholderText="Fecha vencimiento"
                  className="midatepicker"
                  selected={fechaVencimiento}
                  onChange={handleFechaVcChange}
                ></DatePicker>
              </div>

              <div className="input-container">
                <label htmlFor="comercial1">Estatus:</label>
                <select
                  id="estatus"
                  name="Estatus"
                  required
                  value={formData.Estatus}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="">Seleccione</option>
                  {estatus.map((estatu) => (
                    <option key={estatu} value={estatu}>
                      {estatu}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-container">
                <label htmlFor="montoc1">Saldo en mora:</label>
                <input
                  type="text"
                  id="montoc1"
                  name="SaldoMora"
                  style={{ textAlign: "right" }}
                  onChange={handleChange}
                  value={formData.SaldoMora}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9. ]/g, "");
                  }}
                />
              </div>
            </div>
            <button
              style={{ fontSize: "12px", marginLeft: "1%", margin: "10px" }}
              type="button"
              onClick={() => goAgregar()}
            >
              Agregar
            </button>

            <Table data={users} />

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
              <button
                style={{ marginLeft: "10px" }}
                type="button"
                onClick={() => goBack()}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AnalisisAgro;
