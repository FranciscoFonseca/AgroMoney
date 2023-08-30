import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { Nav, Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
//import { faUser, faInfo } from "@fortawesome/free-solid-svg-icons";
import "./NavbarStyle.css";
//import { Nav,  NavLink,  Bars,  NavMenu,  NavBtn,  NavBtnLink,} from "./NavbarElements";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function NavText(props) {
  return (
    <span style={{ marginLeft: "10px", marginRight: "10px" }}>
      Bienvenido, {props.userName}
    </span>
  );
}

function Layout(props) {
  const [perfil, setPerfil] = useState("");
  const [usuario, setUsuario] = useState("");

  useEffect(() => {
    const usuariolog = JSON.parse(localStorage.getItem("logusuario"));
    if (usuariolog) {
      setPerfil(usuariolog.perfil);
      setUsuario(usuariolog.nombre);
    }
  }, []);

  // const navigate = useNavigate();n

  const handleLogout = () => {
    const newurl = window.location.protocol + "//" + window.location.host;
    window.location.replace(newurl);
  };

  return (
    <div>
      <ToastContainer />

      <Navbar
        style={{
          backgroundColor: "#e3f2fd",
          fontSize: "17px",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
        variant="bg-dark"
        expand="sm"
      >
        {/* <Navbar className="NavBr" variant="bg-dark" expand="sm"> */}
        <Container fluid>
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => (window.location.href = "/Principal")}
          >
            <img
              src="/agromoney.png"
              alt="Logo"
              style={{ height: "45px", marginRight: "15px" }}
            />
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav.Link
              style={{ marginLeft: "1%" }}
              href="/Principal"
              className="nav-link"
            >
              Inicio
            </Nav.Link>
            {perfil === "A" && (
              <Nav.Link
                href="/Usuarios"
                className="nav-link"
                style={{ marginLeft: "10px" }}
              >
                Usuarios
              </Nav.Link>
            )}

            {/* <Nav.Link style={{marginLeft:"1%"}} href="/Conocenos" className="nav-link">
            Conócenos
          </Nav.Link> */}
            <Nav className="ms-auto">
              <div style={{ display: "block", marginTop: "10px" }}>
                <NavText userName={usuario} />
              </div>
              <Nav.Link
                style={{ backgroundColor: "blak" }}
                onClick={handleLogout}
                className="d-flex align-items-center"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Cerrar Sesión
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid style={{ marginTop: "70px" }}>
        {props.children}
      </Container>
    </div>
  );
}

export default Layout;
