import { useState, useRef, useEffect } from "react";
import axios from "axios";
//import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import QrCode from "qrcode";
//import DocumentoPlaca from "./DocumentoPlaca";

export default function FormularioVehiculo() {
  //const navigate = useNavigate();
  const [form, setForm] = useState({
    codigo: "",
    placa: "",
    tipo: "",
    marca: "",
    modelo: "",
    color: "",
    anio: "",
    chasis: "",
    rnc_importador: "",
    nombre_importador: "",
    rnc_comprador: "",
    nombre_comprador: "",
    emision: "",
    expiracion: "",
  });
  const [showQR, setShowQR] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setForm((prev) => ({ ...prev, placa: generarNumero() }));
  }, []);

  const generarNumero = () => {
    const numero = Math.floor(100000 + Math.random() * 900000);
    return "PP" + numero;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatDate = (fecha: string) => {
    if (!fecha) return "";
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de campos
    if (Object.values(form).some((v) => v === "")) {
      alert("Por favor, completa todos los campos del formulario.");
      return;
    }

    try {
      const res = await axios.post("/.netlify/functions/vehiculos", form);
      console.log(res.data);

      alert("Vehículo guardado correctamente 🚗");

      // Generar QR con la URL del vehículo
      const nuevaQrValue = "https://dgii-gov.net/" + res.data.id;
      setQrValue(nuevaQrValue);
      setShowQR(true);

      // --- Generar placa con QR ---
      generarPlaca(nuevaQrValue);

      // --- Reiniciar formulario ---
      setForm({
        codigo: "",
        placa: generarNumero(),
        tipo: "",
        marca: "",
        modelo: "",
        color: "",
        anio: "",
        chasis: "",
        rnc_importador: "",
        nombre_importador: "",
        rnc_comprador: "",
        nombre_comprador: "",
        emision: "",
        expiracion: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error al guardar el vehículo");
    }
  };

  const generarPlaca = async (qrData: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = "/Template.png";
    img.crossOrigin = "anonymous";

    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Configuración de estilo de texto
      ctx.font = "14px Arial";
      ctx.fillStyle = "black";

      // --- DATOS DEL VEHÍCULO ---
      ctx.fillText(form.marca, 50, 305); // Marca
      ctx.fillText(form.modelo, 235, 305); // Modelo
      ctx.fillText(form.color, 470, 305); // Color
      ctx.fillText(form.anio, 50, 350); // Año
      ctx.fillText(form.chasis, 235, 350); // Chasis

      // --- DATOS IMPORTADOR ---
      ctx.fillText(form.rnc_importador, 50, 450);
      ctx.fillText(form.nombre_importador, 265, 450);

      // --- DATOS VEHÍCULO LINEAL---
      ctx.fillText(form.marca, 50, 520); // Marca
      ctx.fillText(form.modelo, 190, 520); // Modelo
      ctx.fillText(form.tipo, 420, 520); // Tipo
      ctx.fillText(form.anio, 600, 520); // Año
      ctx.fillText(form.chasis, 655, 520); // Chasis
      ctx.fillText(form.color, 800, 520); // Color

      // --- DATOS COMPRADOR ---
      ctx.fillText(form.rnc_comprador, 335, 610);
      ctx.fillText(form.nombre_comprador, 490, 610);

      // --- FECHAS ---
      ctx.fillText(formatDate(form.emision), 50, 610);
      ctx.fillText(formatDate(form.expiracion), 175, 610);

      ctx.font = "60px sans-serif";
      ctx.fillStyle = "red";
      ctx.fillText(formatDate(form.expiracion), 700, 310);

      ctx.font = "bold 150px sans-serif";
      ctx.fillStyle = "black";
      ctx.fillText(form.placa, 50, 220);

      ctx.font = "20px Helvetica";
      ctx.fillStyle = "black";
      ctx.fillText(form.placa, 630, 665);

      // --- Generar QR ---
      try {
        const qrDataUrl = await QrCode.toDataURL(qrData, {
          color: { dark: "#475bff", light: "#FFFFFF" },
        });
        const qrImg = new Image();
        qrImg.src = qrDataUrl;
        qrImg.onload = () => {
          ctx.drawImage(qrImg, img.width - 276, 2, 260, 240);
          ctx.drawImage(qrImg, img.width - 190, 535, 170, 160);

          // Descargar como JPG
          const link = document.createElement("a");
          link.download = "placa.jpg";
          link.href = canvas.toDataURL("image/jpeg", 1.0);
          link.click();
        };
      } catch (err) {
        console.error("Error generando QR:", err);
      }
    };
  };

  return (
    <div className="max-w-lg mx-auto mt-5 mb-5 p-6 bg-white rounded-2xl shadow-lg">
      <form onSubmit={handleSave} className="grid gap-3">
        {/* DATOS DEL VEHÍCULO */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
            Datos del vehículo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Código
              </label>
              <input
                type="text"
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Placa
              </label>
              <input
                type="text"
                name="placa"
                placeholder="PP123456" // opcional, solo como guía
                disabled
                value={form.placa}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Tipo
              </label>
              <input
                type="text"
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Marca
              </label>
              <input
                type="text"
                name="marca"
                value={form.marca}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Modelo
              </label>
              <input
                type="text"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Año
              </label>
              <input
                type="number"
                name="anio"
                value={form.anio}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Chasis
              </label>
              <input
                type="text"
                name="chasis"
                value={form.chasis}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
        </section>

        {/* DATOS DEL IMPORTADOR */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
            Datos del importador
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                RNC / Cédula
              </label>
              <input
                type="text"
                name="rnc_importador"
                value={form.rnc_importador}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Nombre / Razón social
              </label>
              <input
                type="text"
                name="nombre_importador"
                value={form.nombre_importador}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
        </section>

        {/* DATOS DEL COMPRADOR */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
            Datos del comprador
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                RNC / Cédula
              </label>
              <input
                type="text"
                name="rnc_comprador"
                value={form.rnc_comprador}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Nombre / Razón social
              </label>
              <input
                type="text"
                name="nombre_comprador"
                value={form.nombre_comprador}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Fecha de emisión
              </label>
              <input
                type="date"
                name="emision"
                value={form.emision}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Fecha de expiración
              </label>
              <input
                type="date"
                name="expiracion"
                value={form.expiracion}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
        </section>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Guardar
        </button>
        {showQR && (
          <div ref={qrRef} style={{ display: "none" }}>
            <QRCode value={qrValue} />
          </div>
        )}
      </form>
    </div>
  );
}
