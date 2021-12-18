
exports.up= async function (knex) {
    return knex.schema.createTable('users', table => {
        table.string('email').primary();
        table.string('password').notNullable();
    })
};

exports.down = async function (knex){
    return knex.schema.dropTableIfExists('users')
}
