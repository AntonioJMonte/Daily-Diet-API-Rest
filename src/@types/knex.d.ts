import { Knex } from 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        snack: {
            id: string
            name: string,
            hour: number,
            created_at: string,
            onDiet: boolean, 
            session_id?: string
        }
    }
}