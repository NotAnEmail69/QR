import pkg from "pg";
import fs from "fs";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync(new URL("./ca.pem", import.meta.url)).toString(),
  },
});

export default pool;
