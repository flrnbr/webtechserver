exports.up = async function(knex) {
    return knex.schema.createTable('benutzer', table => {
        table.string('email').primary();
        table.string('password').notNullable();
    })
};

exports.down = async function(knex) {
    return await knex.schema.dropTableIfExists('benutzer');
};

