import { Knex } from "knex";
import path from "path";
import * as dotenv from 'dotenv';
dotenv.config();

export const development: Knex.Config = {
  client: 'pg',
  searchPath: ['knex', 'public'],
  connection: {
      host: 'localhost',
      database: 'posts',
      port: 5432,
      user: 'postgres',
      password: 'rchff0202'
  },
  migrations: {
    directory: path.resolve(__dirname, "..", "migrations"),
  }

};

export const teste: Knex.Config = {
    ...development,
    connection: ':memory:',
};

export const production: Knex.Config = {
    client: 'pg',
    searchPath: ['knex', 'public'],
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    },
    migrations: {
        directory: path.resolve(__dirname, "..", "migrations"),
    }
};

