import pool from "./db.js";

export const handler = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, time: result.rows[0].now }),
    };
  } catch (err) {
    console.error("❌ Error en testConnection:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
