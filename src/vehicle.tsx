import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

type Vehiculo = {
  codigo: string;
  placa: string;
  tipo: string;
  marca: string;
  modelo: string;
  color: string;
  anio: string;
  chasis: string;
  expiracion: string;
  emision: string;
  nombre_importador: string;
  rnc_importador: string;
  nombre_comprador: string;
  rnc_comprador: string;
};

export default function DocumentoVehiculo() {
  const { id } = useParams();
  const [data, setData] = useState<Vehiculo | null>(null);

  const formatDate = (fecha: string) => {
    if (!fecha) return "";

    // Si viene como DD/MM/YYYY → lo convertimos a YYYY-MM-DD
    const [day, month, year] = fecha.split("/");

    const d = new Date(`${year}-${month}-${day}`); // Formato válido para JS

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  };

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dm = params.get("dm"); // si viene de /c/cppp.aspx?dm=exg2c8d

    if (dm) {
      axios
        .get(`/api/${dm}`)
        .then((res) => setData(res.data))
        .catch(() => setData(null));
      return;
    }

    axios
      .get(`/api/${id}`)
      .then((res) => {
        setData(res.data);
        // redirigir a la URL deseada
        navigate(`/c/cppp.aspx?dm=${res.data.codigo}`, { replace: true });
      })
      .catch(() => setData(null));
  }, [id, location.search, navigate]);

  if (!data)
    return <h1 className="text-center mt-10">Vehículo no encontrado</h1>;

  return (
    <div
      style={{
        width: "100vw",

        background: "white",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "480px",
          margin: "0 auto",
          background: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header verde con franja negra */}
        <div
          id="header"
          style={{
            backgroundColor: "#7daf18",
            borderBottom: "5px solid #2d2d2d",
          }}
        >
          <span
            style={{
              color: "#006600",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "0.1em",
            }}
          >
            PLACA PROVISIONAL
          </span>
        </div>

        {/* Títulos */}
        <div id="title">
          <span className="title-orange">Sistema Datamatrix</span>
          <span className="title-green">Validación de Documentos</span>
        </div>

        {/* Tabla */}
        <div id="content">
          <table
            width="100%"
            border={0}
            cellPadding={5}
            cellSpacing={0}
            className="data_table"
          >
            <tbody>
              <tr>
                <td className="left-col">
                  <span>Código</span>
                </td>
                <td className="right-col">
                  <span>{data.codigo}</span>
                </td>
              </tr>
              <tr>
                <td className="left-col">
                  <span>Placa</span>
                </td>
                <td className="right-col">
                  <span>{data.placa}</span>
                </td>
              </tr>
              <tr>
                <td className="left-col">
                  <span>Tipo de Vehículo</span>
                </td>
                <td className="right-col">
                  <span>{data.tipo}</span>
                </td>
              </tr>
              <tr>
                <td className="left-col">
                  <span>Marca</span>
                </td>
                <td className="right-col">
                  <span>{data.marca}</span>
                </td>
              </tr>
              <tr>
                <td className="left-col">
                  <span>Modelo</span>
                </td>
                <td className="right-col">
                  <span>{data.modelo}</span>
                </td>
              </tr>
              <tr>
                <td className="left-col">
                  <span>Color</span>
                </td>
                <td className="right-col">
                  <span>{data.color}</span>
                </td>
              </tr>
              <tr>
                <td className="left-col">
                  <span>Año</span>
                </td>
                <td className="right-col">
                  <span>{data.anio}</span>
                </td>
              </tr>
              <tr>
                <td className="left-col">
                  <span>Chasis</span>
                </td>
                <td className="right-col">
                  <span>{data.chasis}</span>
                </td>
              </tr>
              <tr>
                <td className="left-col">
                  <span>Fecha Emision</span>
                </td>
                <td className="right-col">
                  <span>{formatDate(data.emision)}</span>
                </td>
              </tr>
              <tr>
                <td className="left-col">
                  <span>Fecha Expiración</span>
                </td>
                <td className="right-col">
                  <span>{formatDate(data.expiracion)}</span>
                </td>
              </tr>
              <tr>
                <td className="left-col">
                  <span>Razón Social / Nombre Importador</span>
                </td>
                <td className="right-col">
                  <span>{data.nombre_importador}</span>
                </td>
              </tr>
              <tr>
                <td className="left-col">
                  <span>Rnc/Cédula Importador</span>
                </td>
                <td className="right-col">
                  <span>{data.rnc_importador}</span>
                </td>
              </tr>
              <tr>
                <td className="left-col">
                  <span>Razón Social / Nombre Comprador</span>
                </td>
                <td className="right-col">
                  <span>{data.nombre_comprador}</span>
                </td>
              </tr>
              <tr>
                <td className="left-col">
                  <span>Rnc/Cédula Comprador</span>
                </td>
                <td className="right-col">
                  <span>{data.rnc_comprador}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer gris */}
        <div id="footer">Dirección General de Impuestos Internos.</div>
      </div>
    </div>
  );
}
