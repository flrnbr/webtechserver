
export function up(knex) {
    return knex.schema.createTable('users', table => {
        table.string('email').primary();
        table.string('password').notNullable();
    })
}

export function down(knex) {
    return knex.schema.dropTableIfExists('users')
}
