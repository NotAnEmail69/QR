import pkg from "pg";
const { Pool } = pkg;

let sslConfig = false;

if (process.env.DB_CA_CERT) {
  sslConfig = {
    rejectUnauthorized: true,
    ca: process.env.DB_CA_CERT.replace(/\\n/g, "\n"), // 👈 convierte los \n en saltos reales
  };
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});

export default pool;
