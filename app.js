'use strict';

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const fs = require('fs'); // Importa il modulo fs per leggere i file del certificato
const https = require('https'); // Importa il modulo https per creare un server HTTPS

// Express configuration
const app = express();
app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(cookieParser());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandler());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./auth');

app.get('/', routes.site.index);
app.get('/login', routes.site.loginForm);
app.post('/login', routes.site.login);
app.get('/logout', routes.site.logout);
app.get('/account', routes.site.account);

app.get('/dialog/authorize', routes.oauth2.authorization);
app.post('/dialog/authorize/decision', routes.oauth2.decision);

app.post('/oauth/token', routes.oauth2.token);

// app.post('/oauth/token', (req, res) => {
//     const clientID = req.body.client_id;
//     const clientSecret = req.body.client_secret;

//     const fakeToken = {
//         access_token: "faketoken123456789",
//         token_type: "Bearer",
//         expires_in: 3600
//     };

//     return res.json(fakeToken);
// });

app.get('/api/userinfo', routes.user.info);
app.get('/api/clientinfo', routes.client.info);

// Leggi il certificato SSL e la chiave privata dai file
const options = {
    key: fs.readFileSync(path.join(__dirname, 'certificate/key.pem')), // Percorso alla chiave privata
    cert: fs.readFileSync(path.join(__dirname, 'certificate/cert.pem')) // Percorso al certificato SSL
};

const port = process.env.PORT || 443;

// Crea un server HTTPS anziché utilizzare app.listen()
https.createServer(options, app).listen(port, () => {
    console.log(`Server is running on https://localhost:${port}/dialog/authorize`);
});

// Necessario per alcune piattaforme serverless, ma opzionale qui.
module.exports = app;
