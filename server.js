/*
 * Import de module
 * **************** */

const express = require('express');
const exphbs = require('express-handlebars');
const port = 3000;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mysql = require('mysql');
const util = require('util');
const expressSession = require('express-session');
const MySQLStore = require('express-mysql-session')(expressSession);
// Méthode de chiffrement pour protéger le Password de ma DB //

const morgan = require('morgan')

// Import de module 'Date Commentaire Article' //
const Handlebars = require("handlebars");
const MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);


/*
 * Configuration de nos modules
 * **************************** */

// Rendre fonctionnel express (Concerne toute les méthodes GET,POST,PUT,DELETE)
const app = express();

// Permet de log les ressources chargé par le client (CSS, Image etc ...)
app.use(morgan('dev'))

// Configuration du module Methode Overrride permettant d'utiliser les méthodes PUT et DELETE en remplacement de la Methode POST //
app.use(methodOverride('_method'));


// dotenv - Sécurisation d'accès à ma base de donnée //
require('dotenv').config()
// Configuration MySQL - (Nom de la base de données = mydb)
const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};
console.log(options, 'OPTIONS')

db = mysql.createConnection(options);

db.connect(function (err) {
    if (err) console.error('error connecting: ' + err.stack);
    console.log('connected as id ' + db.threadId);
});

// Rendre la variable db = base de donnée asynchrone par un systeme de promesse (util.promisify)
const query = util.promisify(db.query).bind(db);
global.query = query;



// Port connexion entre la SESSION de l'Utilisateur et MYSQL //
options.port = 3306
// Express-session (MODULE NODEJS )
// création du cookie session
app.use(expressSession({
    secret: 'petitgateau',
    name: 'petitgateau',
    saveUninitialized: true,
    store: new MySQLStore(options),
    resave: false,
}));


// Import de nos Register Helpers (handlebars) - ('./api/helpers/hbs') = chemin dossier //
const { inc, ifCond } = require('./api/helpers/hbs')


// Configuration handlebars 
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({
    // Initialisation de nos Helpers //
    helpers: {
        inc,
        ifCond
    },

    extname: 'hbs',
    defaultLayout: 'main'
}));

// Express Static (Permet d'importer un dossier static CSS/SASS sur une URL)
// Exemple: le chemin /assets nous donnera accès au dossier public
app.use('/assets', express.static('public'));

// Configuration du module Body-parser : Permet de parser les données d'un formulaire (Creation Article Admin et Formulaire de Contact) depuis le front vers le back au format JSON (Methode POST et PUT)
// req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


// SESSION CONNEXION //
app.use('*', (req, res, next) => {
    console.log('middleware', res.session)
    // On definit nos variable locals pour pouvoir les utiliser dans notre HBS (Handlebars)
    res.locals.user = req.session.user
    if (req.session.isAdmin) res.locals.isAdmin = req.session.isAdmin
    console.log('SESSION', req.session)
    next()
})

/*
 * Router
 * ****** */

const ROUTER = require('./api/router');
app.use(ROUTER);


/*
 * Ecoute de notre application
 * *************************** */

// Lancement de l'application
app.listen(port, () => {
    console.log("le serveur tourne sur le prt: " + port);
});