import { defineConfig } from "drizzle-kit";
import "dotenv/config";

if (!process.env.DB_HOST || !process.env.DB_DATABASE) {
  throw new Error("DB configuration must be set in .env file");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
  },
});
