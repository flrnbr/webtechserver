const crypto = require("crypto");
const Knex = require("knex");
const knexfile = require("../knexfile");
const { Client } = require('pg');

const client = new Client({
    connectionString: DB_URI,
      ssl:
        true
          ? { rejectUnauthorized: false } // allow self-signed certificate for Heroku/AWS
          : false, // if we run locally, we don't want SSL at all
    /*port: 5433,
    host: 'localhost',
    database: 'test',
    user: 'postgres',
    password: 'abcd1234!'*/
});

client.on("error", (err) => console.log("Client Error", err));
client.on("connect", () => console.log("Successfully connected to Expenses DB"));

(async () => {
    await client.connect();
})();

const knex = Knex(knexfile.development);


class Reise {
    constructor(id, email, rname, rland, sdate, edate) {
        this.id = id;
        this.email = email;
        this.rname = rname;
        this.rland = rland;
        this.sdate = sdate;
        this.edate = edate;
    }

};


class ReiseService {


    constructor() {

    }

    async update(id, rname, rland, sdate, edate) {
        return knex('reisenT')
            .where({ rid: id })
            .update({
                rname: rname,
                rland: rland,
                sdate: sdate,
                edate: edate
            }, ['rid', 'rname', 'rland', 'sdate', 'edate'])
    }

    async delete(id) {
        console.log(id);
        return await knex("reisenT").where('rid', id).delete();
    }

    async getAll(email) {
        return await knex("reisenT").where('email', email);
    }

    async getOne(id) {
        return await knex("reisenT").where('rid', id).first();
    }

    async insert(email, rname, rland, sdate, edate) {
        const rid = Date.now();
        await knex("reisenT").insert({
            rid: rid,
            email: email,
            rname: rname,
            rland: rland,
            sdate: sdate,
            edate: edate
        });
        return rid;
    }

}

module.exports = ReiseService;