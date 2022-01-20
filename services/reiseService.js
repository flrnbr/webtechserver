const crypto = require("crypto");
const Knex = require("knex");
const knexfile = require("../knexfile");
const { Client } = require('pg');
const uuid = require('uuid');

const client = new Client({
    connectionString: process.env.DB_URI,
      ssl:
        true
          ? { rejectUnauthorized: false } // allow self-signed certificate for Heroku/AWS
          : false, // if we run locally, we don't want SSL at all
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

    async createGroup(email,gname){

        console.log('Starting new Group creation');
        var user = await knex('benutzer').where('email',email).first();
        var mem = new Array();
        mem.push(user.email);
        var guuid = uuid.v4();
        
        await knex('Gruppen').insert({
            group_name: gname,
            group_id: guuid,
            member_emails: mem
        })

        user.group_ids.push(guuid);
        await knex('benutzer').where('email', email).update({
            group_ids: user.group_ids
        }) 

        return guuid;
    }

    async addGroupMember(email, guuid){
        var user = await knex('benutzer').where('email',email).first();
        var group = await knex('Gruppen').where('group_id', guuid).first();
        group.member_emails.push(user.email);
        user.group_ids.push(guuid);
        await knex('Gruppen').where('group_id',guuid).update({
            member_ids: group.member_ids
        })
        await knex('benutzer').where('email', email).update({
            group_ids: user.group_ids
        }) 
    }
        
    async addGroupReise(guuid){

    }

}

module.exports = ReiseService;