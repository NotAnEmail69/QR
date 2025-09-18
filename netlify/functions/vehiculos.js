import pool from "./db.js";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const result = await pool.query(
      `INSERT INTO vehiculos 
        (codigo, placa, tipo, marca, modelo, color, anio, chasis, expiracion, emision,
         rnc_importador, nombre_importador, rnc_comprador, nombre_comprador)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        body.codigo,
        body.placa,
        body.tipo,
        body.marca,
        body.modelo,
        body.color,
        body.anio,
        body.chasis,
        body.expiracion,
        body.emision,
        body.rnc_importador,
        body.nombre_importador,
        body.rnc_comprador,
        body.nombre_comprador,
      ]
    );

    return { statusCode: 201, body: JSON.stringify(result.rows[0]) };
  } catch (err) {
    console.error("❌ Error en vehiculos.js:", err);
    return { statusCode: 500, body: "Error al guardar vehículo" };
  }
};
