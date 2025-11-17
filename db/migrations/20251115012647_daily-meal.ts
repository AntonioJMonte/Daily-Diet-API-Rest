import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    
    await knex.schema.createTable('meal', (table) => {
        table.uuid('id').primary()
        table.string('name').notNullable()
        table.string('description').notNullable()
        table.date('date').defaultTo(knex.fn.now()).notNullable()
        table.time('hour').defaultTo(knex.fn.now()).notNullable()
        table.string('diet').notNullable()
        table.uuid('user_id').references('id').inTable('users')
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meal')
}

