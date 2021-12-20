var assert = require("assert");
const { db } = require("../server"); // import du server.js

// Describe prend en compte l'ensemble du CRUD - TEST UNITAIRE //
describe("MOCHA_ASYNC // CRUD // Article", async () => {
    
    let article = {};
    let id = 0;

    const key = [],
        val = [];

    const now = new Date(Date.now())
    const body = {
        title: "Steven",
        description: "Ma super description",
        recommandation: "je recommande",
        date: now,
        dateEdit: now,
        image: "/path/to/image.png",
        subdescription: "ma sous description",
        address: "11 rue de olivette",
        phone: '0632353634',
        author_id: 1,
    }

    // J'utilise un systême de tableau key value //
    Object.entries(body).forEach(kv => {
        // console.log('kv', kv)
        key.push(kv[0]) // L'index du tableau commence par 0 et surtout découpant chaque key value dans un nouveau tableau donc 0 restera 0 //
        val.push(kv[1]) // Pareillement pour l'index 1 de la valeur //
    })

    // Créer les articles pour le stocker dans le code ci-dessus //
    // Key.toString reprend les éléments du tableau dans le constante key //
    beforeEach((done) => {
        let sql = `INSERT INTO Article ( ${key.toString() } ) values(?)`;
        query(sql, [val], function (err, data, fields) {
            if (err) throw err;
            article.id = data.insertId;
            // console.log('Id BeforeEach', data)
            assert(data.insertId)
            done()
        })
    });

    // MÉTHODE POST utilisant l'article crée par le before each et STOCKER par le code ci-dessous (Au dessus du Each) ...  //
    // it prend en compte une méthode !! //
    // Req.body regroupant toute les données que je veux dans mon article (TEST) //
    it("POST // Article", async () => {
        const now = new Date(Date.now())
        const body = {
            title: "Steven",
            description: "Ma super description",
            recommandation: "je recommande",
            date: now,
            dateEdit: now,
            image: "/path/to/image.png",
            subdescription: "ma sous description",
            address: "11 rue de olivette",
            phone: '0632353634',
            author_id: 1,
        }
        // console.log('simulate req.body', body)

        // J'utilise un systême de tableau key value //
        const key = [],
            val = []
        Object.entries(body).forEach(kv => {
            // console.log('kv', kv)
            key.push(kv[0]) // L'index du tableau commence par 0 et surtout découpant chaque key value dans un nouveau tableau donc 0 restera 0 //
            val.push(kv[1]) // Pareillement pour le 1 de la valeur //
        })

        // console.log('key', key, val)
        // Permet la récupération du tableau key value dans la requête SQL //
        let sql = `INSERT INTO Article ( ${key.toString() } ) values(?)`;

        // Récupération des données de la requête SQL permettant la création du nouvel article //
        const newArticle = await query(sql, [val])
        // console.log('newArticle', newArticle);

        // Découpage de chaque donnée point par point : VALIDATION //
        const ArticleID = await query(`SELECT * FROM Article WHERE id = ${ newArticle.insertId }`)
        // console.log('ArticleID', ArticleID[0])

        // Assertion
        assert.deepStrictEqual(ArticleID[0].title, body.title)
        assert.deepStrictEqual(ArticleID[0].description, body.description)
        assert.deepStrictEqual(ArticleID[0].recommandation, body.recommandation)
        // assert.strictEqual(ArticleID[0].date, body.date)
        // assert.strictEqual(ArticleID[0].date, body.dateEdit)
        assert.deepStrictEqual(ArticleID[0].image, body.image)
        assert.deepStrictEqual(ArticleID[0].subdescription, body.subdescription)
        assert.deepStrictEqual(ArticleID[0].address, body.address)
        assert.deepStrictEqual(ArticleID[0].phone, body.phone)
        assert.deepStrictEqual(ArticleID[0].author_id, body.author_id)

    });

    // METHODE GET //
    it("Get By ID // Article", async () => {

       
        let sql = `SELECT * FROM Article WHERE id = ${ article.id }`;
        const articleID = await query(sql)

        // Check mentionnant que le rechargement des données c'est bien passer //
        assert.deepStrictEqual(articleID[0].id, article.id)
    });

    // METHOD UPDATE //
    it ("UPDATE By ID // Article", async() => {

        const body = {
            title: "Steven edit",
            description: "Ma super description edit",
            recommandation: "je recommande edit",
            image: "/path/to/image.png edit",
            subdescription: "ma sous description edit",
            address: "11 rue de olivette edit",
            phone: '0632353634 edit',
            author_id: 1,
        }

        const set = []

        Object.entries(body).forEach(kv => set.push(` ${kv[0]} = '${kv[1]}' `))

        let sql = `UPDATE Article
                    SET ${ set.toString() }
                   WHERE id = '${ article.id }';`;

        await query (sql)

        const checkArticle = await query(`SELECT * FROM Article WHERE id = ${ article.id }`)

        assert.deepStrictEqual(body.title, checkArticle[0].title)
    });

     // METHODE DELETE //
     it("DELETE By ID // Article", async () => {

        // Suppresssion
        let sql = `DELETE FROM Article WHERE id = ${ article.id }`;
        await query(sql)

        // Check mentionnant que la suppression c'est bien passer
        const checkDeleteArticle = await query(`SELECT * FROM Article WHERE id = ${ article.id }`)
        assert.deepStrictEqual(0, checkDeleteArticle.length)
        // assert.deepStrictEqual([], NewTableau)
    });


    // METHODE DELETE //
    it("DELETE ALL // Article", async () => {

        // Suppression
        let sql = `DELETE FROM Article`;
        await query(sql)

        // Check mentionnant que la suppression c'est bien passer
        const NewTableau = await query(`SELECT * FROM Article`)
        // console.log('check articles', NewTableau)

        // L'un ou l'autre  //
        assert.deepStrictEqual(0, NewTableau.length)
        // assert.deepStrictEqual([], NewTableau)
    });



});