import { env } from "./env/index.js"
import knex from "knex";
import { Knex } from "knex";

export const config: Knex.Config = {
    client: 'sqlite',
    connection: { 
        filename: env.DATABASE_URL,        
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations'
    }
}

export const db = knex(config)