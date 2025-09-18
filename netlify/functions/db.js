// db.js
import pkg from "pg";
const { Pool } = pkg;

// Configuración SSL
let sslConfig = false;

// Si existe la variable DB_CA_CERT (Netlify/producción)
if (process.env.DB_CA_CERT) {
  sslConfig = {
    rejectUnauthorized: true, // ✅ Validar el certificado
    ca: process.env.DB_CA_CERT.replace(/\\n/g, "\n"), // Restaurar saltos de línea
  };
} else if (process.env.NODE_ENV === "production") {
  // Seguridad extra: evita conexión sin certificado en producción
  throw new Error(
    "DB_CA_CERT no definido en producción. Debes subir el ca.pem como variable de entorno."
  );
}

// Crear pool de conexiones
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // URI completa de Aiven
  ssl: sslConfig,
});

export default pool;
