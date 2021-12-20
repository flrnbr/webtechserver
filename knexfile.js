// Update with your config setting
const { Knex } = require("knex");

module.exports = {

  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.DB_URI,
      ssl:
        true
          ? { rejectUnauthorized: false } // allow self-signed certificate for Heroku/AWS
          : false, // if we run locally, we don't want SSL at all
      /*port: 5433,
      host: 'localhost',
      database: 'test',
      user: 'postgres',
      password: 'abcd1234!'*/
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
