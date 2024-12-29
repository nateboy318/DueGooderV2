import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "postgresql",
  extensionsFilters: [
    // "postgis", // Uncomment if you need postgis
  ],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
