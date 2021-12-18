
exports.up = function(knex) {
    return knex.schema.createTable('reisenT', table => {
        table.string('rid').primary();
        table.string('email').notNullable();
        table.string('rname');
        table.string('rland');
        table.string('sdate');
        table.string('edate');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('reisenT');
};
