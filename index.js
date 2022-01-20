const express = require('express');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const { readFile, appendFileSync } = require('fs');
const cors = require("cors");
const { request } = require('http');
const knex = require('knex');
const knexfile = require('./knexfile');
const app = express();
const path = require('path');
const AuthService = require('./services/authService');
const ReiseService = require('./services/reiseService');
const db = require('./db');

const authService = new AuthService();
const reiseService = new ReiseService();

app.use(express.json());
app.use(express.static(path.join(__dirname, '/public/stylesheets')));
//Konstante Parameter
const port = process.env.PORT || 3000;

//Cors management
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);


//sets session cookie
app.use(cookieParser());

const checkLogin = async (req, res, next) => {
    const session = req.cookies.session;
    if (!session) {
        res.status(401);
        return res.json({ message: "You need to be logged in to see this page." });
    }
    const email = await authService.getUserEmailForSession(session);
    if (!email) {
        res.status(401);
        return res.json({ message: "You need to be logged in to see this page." });
    }
    req.userEmail = email;

    next();
};


app.use(session({
    secret: 'will sign server',
    resave: false,
    saveUninitialized: false
}))



app.get('/', async (req, res) => {
    readFile('./index.html', 'utf8', (err, html) => {

        if (err) {
            res.status(500).send('Error occured');
        }

        res.send(html);
    })
})

app.get('/uebersicht', async (req, res) => {

    readFile('./uebersicht.html', 'utf8', (err, html) => {

        if (err) {
            res.status(500).send('Error occured');
        }

        res.send(html);

    })
})

app.get('/register/:uuid/:date', async (req, res) => {
    var uuid = req.params.uuid;
    var date = req.params.date;
    console.log(uuid);
    console.log(date);
    await authService.setVerification(uuid,date);
    res.json({state: "Now Verified"});
});

app.get('/register', async (req, res) => {

    readFile('./register.html', 'utf8', (err, html) => {

        if (err) {
            res.status(500).send('Error occured');
        }

        res.send(html);

    })
})

app.get('/karte', async (req, res) => {

    readFile('./karte.html', 'utf8', (err, html) => {

        if (err) {
            res.status(500).send('Error occured');
        }

        res.send(html);

    })
})

app.get('/auth', checkLogin, async (req, res) => {
    res.json({ email: req.userEmail });
})

/*
Login setzt Cookie auf der Seite um mit Backend zu kommunizieren
*/
app.post("/login", async (req, res) => {
    console.log('Login in Progress');
    const payload = req.body;
    const sessionId = await authService.login(payload.email, payload.password);
    if (sessionId === -1) {
        res.status(401);
        return res.json({ message: "Bad email or password" });
    }
    if (sessionId === -2) {
        res.status(401);
        return res.json({ message: "You have to be Verified to Login. Please check your mails to verify" });
    }
    res.cookie("session", sessionId, {
        expires: new Date(sessionId + 900000),
        httpOnly: true,
        sameSite: "none",
        secure: true,//process.env.NODE_ENV === "development",
    });
    res.json({ status: "ok" });
});

app.get("/logout", async (req, res) =>{
    res.clearCookie("session");
    res.json({message: await authService.logout(req.cookies.session)});
})

app.get("/getAll", checkLogin, async (req, res) => {
    res.json(await reiseService.getAll(req.userEmail));
})

app.post("/getOne", checkLogin, async (req, res) => {
    const payload = req.body;
    res.json(await reiseService.getOne(payload.id));
})


app.post("/insert", checkLogin, async (req, res) => {
    console.log('Insert in Progress');
    const payload = req.body;
    const reiseID = await reiseService.insert(req.userEmail, payload.rname, payload.rland, payload.sdate, payload.edate);
    res.json({ reiseID: reiseID });
})

app.post("/update", checkLogin, async (req, res) => {
    console.log('Update in Progress');
    const payload = req.body;
    const reiseID = await reiseService.update(payload.id, payload.rname, payload.rland, payload.sdate, payload.edate);
    res.json({ status: true });
})


app.post("/delete", checkLogin, async (req, res) => {
    console.log('Deletion in Progress');
    const payload = req.body;
    const state = await reiseService.delete(payload.id);
    res.json({ state: 'deleted' });
})


app.post('/createUser', async(req, res)=>{
    console.log('create new User started');
    const payload = req.body;
    var wasCreated = await authService.create(payload.email, payload.password);
    res.json({state: "New User created. Please verify your account by clicking the link in the mail we've sent.", wasCreated: wasCreated})

})

app.post('/newGroup',async(req, res)=>{
    const payload = req.body;
    //const email = req.userEmail;
    console.log('Create new Group: ' + payload.gname + 'requested by ' + payload.email);
    await reiseService.createGroup(payload.email, payload.gname);
    res.json({created: true});
})

app.get('/getGroups/:email', async(req, res)=>{
    //const email = req.userEmail;
    const email = req.params.email;
    res.json(await reiseService.getGroups(email));
})

app.post('/addUserToGroup',async (req, res)=>{
    const payload = req.body;
    res.json(await reiseService.addGroupMember(payload.email, payload.id));   
})

app.post('/addGroupTravel', async (req, res) => {
    const payload = req.body;
    const reiseID = await reiseService.insert(payload.id, payload.name, payload.land, payload.start, payload.end);
    res.json({message: 'Neue Gruppenreise erstellt'});
})

app.listen(port, console.log('Running on 3000'));