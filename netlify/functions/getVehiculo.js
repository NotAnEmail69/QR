import pool from "./db.js";
export const handler = async (event) => {
  const id = event.queryStringParameters?.id;
  if (!id) return { statusCode: 400, body: "Falta id" };

  try {
    const result = await pool.query("SELECT * FROM vehiculos WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0)
      return { statusCode: 404, body: "Vehículo no encontrado" };

    return { statusCode: 200, body: JSON.stringify(result.rows[0]) };
  } catch (err) {
    console.error("❌ Error en getVehiculo.js:", err);
    return { statusCode: 500, body: "Error al obtener vehículo" };
  }
};
