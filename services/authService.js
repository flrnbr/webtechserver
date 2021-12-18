const Knex = require("knex");
const knexfile = require("../knexfile");
const bcrypt = require("bcrypt");

const { Client } = require('pg');
const crypto = require("crypto");

const client = new Client({
    port: 5433,
    host: 'localhost',
    database: 'test',
    user: 'postgres',
    password: 'abcd1234!'
});

client.on("error", (err) => console.log("Client Error", err));
client.on("connect", () => console.log("Successfully connected to DB"));

(async () => {
    await client.connect();
})();

const knex = Knex(knexfile.development);

class User {

    construktor(email, passwort) {
        this.email = email;
        this.password = passwort;
    }
}
module.exports = User;

class AuthService {

    constructor() {

    }

    async create(email,passwort) {

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(passwort, salt);
        await knex("benutzer").insert({
            email: email,
            password: passwordHash,
        });
    }

    async logout(sessionID){
        await knex("sessions").where('sessionid',sessionID).delete();
        return 'logged out';
    }

    async delete(email) {
        await knex("benutzer").where({ email }).delete()
    }

    async checkPassword(email, password) {
        const dbUser = await knex("benutzer").where({ email }).first();
        if (!dbUser) {
            return false;
        }
        return bcrypt.compare(password, dbUser.password);
    }

    async login(email, password) {
        const correctPassword = await this.checkPassword(email, password);
        if (correctPassword) {
            const sessionId = Date.now();//crypto.randomUUID({disableEntropyCache : true});
            //await client.set(sessionId, email, { EX: 60 });
            await knex("sessions").insert({
                sessionid: sessionId,
                email: email,
                check_out_time: new Date(sessionId+900000)
            });
            return sessionId;
        }
        return undefined;
    }

    async getUserEmailForSession(sessionId) {
        const sessionUser = await knex("sessions").where('sessionid',sessionId).first();
        return sessionUser.email;
    }
}

module.exports = AuthService;