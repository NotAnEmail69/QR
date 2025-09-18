import pool from "./db.js";

export const handler = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS vehiculos (
        id SERIAL PRIMARY KEY,
        codigo TEXT,
        placa TEXT,
        tipo TEXT,
        marca TEXT,
        modelo TEXT,
        color TEXT,
        anio INT,
        chasis TEXT,
        expiracion DATE,
        emision DATE,
        rnc_importador TEXT,
        nombre_importador TEXT,
        rnc_comprador TEXT,
        nombre_comprador TEXT
      )
    `;
    await pool.query(query);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, message: "Tabla creada o ya existía" }),
    };
  } catch (err) {
    console.error("❌ Error en createTable:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
