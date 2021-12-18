// Update with your config setting
const { Knex } = require("knex");

module.exports = {
  
  development: {
    client: 'pg',
    connection: {
      port: 5433,
      host: 'localhost',
      database: 'test',
      user: 'postgres',
      password: 'abcd1234!'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

};
