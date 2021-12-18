const { table } = require("console");

exports.up = function(knex) {
    return knex.schema.createTable('session', table => {
        table.string('id');
        table.string('email').notNullable();
        table.timestamps(true,true);
    })
};

exports.down = async function(knex) {
    return await knex.schema.dropTableIfExists('session');
};
