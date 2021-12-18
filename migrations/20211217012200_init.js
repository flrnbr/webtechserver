
exports.up = async function(knex) {
    return knex.schema.createTable('sessions', table => {
        table.string('sessionid').primary();
        table.string('email').notNullable();
        table.datetime('check_out_time').defaultTo(knex.fn.now());
    })
};

exports.down = async function(knex) {
    return await knex.schema.dropTableIfExists('sessions');
};
