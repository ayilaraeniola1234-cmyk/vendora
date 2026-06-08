import path from 'path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: 'postgresql://vendora:vendora123@localhost:5432/vendora_db',
  },
})