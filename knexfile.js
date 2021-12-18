// Update with your config setting
const { Knex } = require("knex");

module.exports = {

  development: {
    client: 'pg',
    connection: {
      connectionString: 'postgres://hjvtvdaqwbctgc:7a412bc60c6149eb762f1785e8069bb9113455beb89dd2fc17f0141a5ebfb100@ec2-52-208-254-158.eu-west-1.compute.amazonaws.com:5432/dcmps79tnu40t6',
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
