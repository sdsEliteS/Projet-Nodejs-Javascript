/*
 * Visuel Page Login
 * ********** */


/**************************************************************************** METHODE ASYNCHRONE **************************************************************************************************************************************************************/
// Visualisation de la Page LOGIN ( READ/Lire = METHOD GET = MySQL: SELECT ) //
// Exportation de la routes du router.js (getPageLogin) dans le Controller avec => une Function opérant un retour d'information en rapport avec la methode GET - req = requête HTTP Utilisateur faite au Server et res = response du Server //
exports.getPageLogin = async (req, res) => {

    // Par default intégration layout main => {{{ body }}} - (Page View)
    // Server renvoi à l'Utilisateur le fichier Handlebars HTML 'login' se situant dans le DOSSIER views //
    res.render('login', {


        // BOOLEAN pouvant être mis dans le cadre d'une condition VOIR PAGE MAIN DANS LE LAYOUT (Un boolean c'est soit TRUE OU FALSE) //
        noFooter: true,
    });



}

/*
 * Connexion sur son Compte Profil grâce à la Page Login
 ******************************************************* */

/**************************************************************** METHODE ASYNCHRONE **************************************************************************************************************************************************************************/

// Remplissage du formulaire de connexion de la page lOGIN ( CREATE/Création = Method POST HTTP = MySQL: INSERT INTO ) //
// Exportation de la routes du router.js (getPagePresentation) dans le Controller avec => une Function opérant un retour d'information en rapport avec la methode POST (Création) - req = requête de Utilisateur faite au Server et res = response du Server //
exports.connexionProfil = async (req, res) => {
    console.log('Connexion Login Steven', req.body)


    /********************************************************* EXPRESS SESSION PROCEDURE *********************************************************************************************************************************************************************/


    /* Requête SQL permettant de cibler le formulaire Login en rapport avec 1 Utilisateur précis ! (pseudo) */
    const user = await query(`SELECT pseudo, email, password, isAdmin FROM User WHERE pseudo = '${req.body.pseudo}'`)
    /********************************************** await est toujours associé à une methode async (Asynchrone) * ********************************************************************************************************************************************/
    console.log('user', user)


    /********************************************************** CONDITION OUVERTURE SESSION ******************************************************************************************************************************************************************/
    /* Si (else) user ne correspond pas au pseudo dans la DB (Base de donnée) au moment du remplissage du formulaire login alors tu renvoi la page register = res.render register */
    if (!user[0]) {
        console.log("PAS DANS LA DB");
        res.render('register', {
            error: 'Nous ne connaisons pas ce pseudo !'
        })

    } else {
        /*  Sinon (else) si user existe bien dans la DB */
        console.log("Existe DANS LA DB");

        /* Dans le cas où, Si (if) l'Utilisateur à crée un compte donc si le mot de passe de la page login user[0].password = MySQL Workbench n'est pas strictement égal (!==) à req.body.mot_de_passe = Fichier Handlebars/HTML 'Connexion' se situant dans le name alors tu me dis Mot de passe error me renvoyant sur la page login */ 
        if (user[0].password !== req.body.mot_de_passe) {
            console.log('Mot de passe error')
            res.render('login', {
                error: 'Le mot de passe est erroné !'
            })

          // Sinon (else) s'il user.password est strictement égal(===) à req.body.mot_de_passe alors tu m'ouvres la SESSION de l'Utilisateur sur sa page profil  //
          // password = MySQL Workbench, mot_de_passe = Fichier Handlears/HTML 'Connexion' dans le name //
        } else if (user[0] && user[0].password === req.body.mot_de_passe) {
            console.log('Mot de passe OK')

            req.session.user = {
                pseudo: user[0].pseudo,
                email: user[0].email
            }

            if (user[0].isAdmin === 1) req.session.isAdmin = true
            // Par default intégration layout main => {{{ body }}} - (Page View)
            // res.render renvoi à l'Utilisateur le fichier Handlebars HTML 'profil' SESSION Utilisateur se situant dans le DOSSIER views //
            res.render('profil', {

                // BOOLEAN pouvant être mis dans le cadre d'une condition VOIR PAGE MAIN DANS LE LAYOUT (Un boolean c'est soit TRUE OU FALSE) //
                noFooter: true,

                // Tableau "user" en rapport avec la requête SQL de la table User dans mydb (Base de Donnée - Fichier db.sql) //
                user: user[0],

                success: 'Bienvenue' + user[0].pseudo
            });

        } else {
            res.render('login', {
                error: 'Une erreur est survenu !'
            })

        }

    }

}

/**************************************************************************** METHODE SYNCHRONE **************************************************************************************************************************************************************/
// Lors du remplissage du formulaire modal Mot de Passe Oublié de la Page LOGIN //
// Export de la routes du router.js (forgetProfil) avec => une Function opérant un retour d'information en rapport avec la methode POST - req = requête Utilisateur interrogant le Server et res = response du Server //
exports.forgetProfil = (req, res) => {
    console.log('Mot de Passe Oublié Page LOGIN', req.body, req.params)

    // res.redirect permet de rediriger l'Utilisateur vers l'URL /profil HTML Handlebars juste après le remplissage du modal "MOT DE PASSE OUBLIE" //
    res.redirect('/profil')
}

/*
 * Page Register
 * ************* */


/**************************************************************************** METHODE SYNCHRONE **************************************************************************************************************************************************************/
// Visualisation de la page REGISTER (READ/Lire = Method GET HTTP = MySQL: SELECT) //
// Exportation de la routes du router.js dans le Controller (getPageRegister) avec => une Function opérant un retour d'information en rapport avec la methode GET - req = requête HTTP de Utilisateur faite au Server et res = response du Server //
exports.getPageRegister = (req, res) => {

    // Par default intégration layout main => {{{ body }}} - (Page View)
    // res.render renvoi à l'Utilisateur un fichier Handlebars HTML 'register' se situant dans le DOSSIER views //
    res.render('register', {

        // BOOLEAN pouvant être mis dans le cadre d'une condition VOIR PAGE MAIN DANS LE LAYOUT (Un boolean c'est soit TRUE OU FALSE) //
        noFooter: true
    });
}

/**************************************************************************** METHODE ASYNCHRONE **************************************************************************************************************************************************************/

// Remplissage du formulaire d'enregistrement de l'Utilisateur de la page REGISTER ( CREATE = Method POST HTTP = Requête MySQL: INSERT INTO ) // ID s'auto_increment donc pas besoin de le mentionner dans la Requête SQL //
// export de la routes du router.js (registerProfil) avec => une Function opérant un retour d'information en rapport avec la methode POST - req = requete HTTP de utilisateur faite au server et res = response du server //
exports.registerProfil = async (req, res) => {
    console.log('Enregistrement Compte Steven', req.body)

    /* Déclaration de la Constante et Exécution de la fonction via une méthode Asynchrone (await) ciblant le pseudo de l'Utilisateur lors de son inscription sur le formulaire d'inscription register */ 
    const userExist = await query(`SELECT * FROM User WHERE pseudo = '${ req.body.pseudo }'`)


    console.log('UserExist', userExist)

    // Condition : lors de la création d'un profil sur le formulaire d'inscription register, Si (if) le Pseudo "STEVEN" est crée et qu'un autre pseudo "steven" est crée en minuscule alors il y aura un message d'erreur disant que ce pseudo existe déjà (toLowerCase) renvoyant sur la page du formulaire register //
    if (userExist.length > 0) {
        // Si (if) le pseudo de la base de donnée est strictement égal à la valeur de l'input req.body.pseudo //
        if (userExist[0].pseudo.toLowerCase() === req.body.pseudo.toLowerCase()) {
            res.render('register', {
                error: 'Ce pseudo est déja pris !'
            })
        }

    // Sinon si (else if) userExist n'existe pas avec un mot de passe contenant moins de 6 caractères (.length < 6) alors il y aura un message d'erreur //
    } else if (!userExist[0] && req.body.mot_de_passe.length < 6) {
        res.render('register', {
            error: 'Le mot de passe contient moins de 6 caractères'
        })

    } else {
        console.log('UserNotExist')

        // Requête SQL permettant la création de plusieurs colonnes dans la Table User //
        // req.body permet de nous ressortir les données dans un terminal de commande afin de constater du bon fonctionnement de l'applis lors du remplissage du formulaire d'enregistrement du l'Utilisateur visionnant les données au moment de la validation //
        let sql = `INSERT INTO User (pseudo, email, password, address, telephone, birthday) values (?)`;
        let values = [
            req.body.pseudo,
            req.body.email,
            req.body.mot_de_passe,
            req.body.adresse,
            req.body.telephone,
            req.body.date_de_naissance
        ];

        // Valeur des colonnes de la Table User qui sont écrit dans les input du formulaire d'inscription register - Method Asynchrone  //
        query(sql, [values], function (err, data, fields) {
            if (err) throw err;
            // res.render renvoi l'Utilisateur vers le fichier Handlebars/HTML 'register' au moment de la validation du formulaire d'inscription mentionnant sur le compte à bien été crée //
            res.render('register', {
                success: 'Votre compte à bien été créé !'
            })
        })

    }

}




/***************************************************** Procédure rentrant dans le cadre d'une fermeture de SESSION Utilisateur **************************************************************************************************************************************/
exports.getDeconnexionProfil = (req, res) => {
    console.log('Deconnexion Session Profil', req.body)


    req.session.destroy(function () {
        req.session = null;

        res.clearCookie('petitgateau', { path: '/' });
        res.redirect('/');

    });

}