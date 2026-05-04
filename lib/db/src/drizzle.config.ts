import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/schema', // ✅ correct
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
  url: 'postgresql://postgres:120499@localhost:5432/postgres',
},
})