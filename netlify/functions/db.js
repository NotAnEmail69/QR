import pkg from "pg";
import fs from "fs";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_CA_CERT, // aquí pones el contenido de ca.pem
  },
});

export default pool;
