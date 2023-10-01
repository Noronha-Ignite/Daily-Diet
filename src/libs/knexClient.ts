import knex, { Knex } from 'knex'
import { env } from '../env'

export const knexConfig: Knex.Config = {
  client: env.DB_CLIENT,
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/database/migrations',
    extension: 'ts',
  },
  connection: {
    filename: env.DB_URL ?? '',
  },
  useNullAsDefault: true,
}

export const knexClient = knex(knexConfig)
