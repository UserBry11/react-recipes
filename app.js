const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();


const { Client } = require('pg')
const client = new Client({
    user: 'postgres',
    password: 'asdf',
    port: 5433,
    database: 'Recipe DB'
})

// execute()
// async function execute(){
//     try{
//         await client.connect()
//         console.log("Connected Successfully!")
//         const results = await client.query("Select * from recipes")
//         console.table(results.row)
//         client.end()
//         console.log("Client disconnected successfully")
//     }
//     catch(ex){
//         console.log(`Something happened ${ex}`)
//     }
//     finally{
//         await client.end()
//         console.log("Client disconnected succesfffully")
//     }
// }


// client.connect()
// .then(() => console.log("connected successfully!"))
// // .then(() => client.query("INSERT into recipes values ($1, $2, $3, $4)", [10, 'Jimmy', 'QEWRQEWRE', '1,adslf ,al;f2 kldfa;kdaf' ]))
// .then(() => client.query("SELECT * from recipes"))
// .then(results => console.table(results.rows))
// .catch(e => console.log(e))
// .finally(() => client.end())

// DB Connect String

// Assign Dust Engine to .dust files
app.engine('dust', cons.dust);

// // Set default extension .dust

app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// // Set public folder

app.use(express.static(path.join(__dirname, 'public')));

// // Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// // Paths/Routes

app.get('/', (req, res) => {
    client.connect()
    .then(() => console.log("Connected successfully"))
    .then(() => client.query("SELECT * from recipes"))
    .then(results => res.render('index', {recipes: results.rows}))
    // client.end()
    // res.render('index', {recipes: results.rows});
})

app.post('/add', (req, res) => {
    // client.connect()
    // .then(() => console.log("About to post"))
    // .then(() => 
    client.query("INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)", [req.body.name, req.body.ingredients, req.body.directions])
    // res.redirect('/')
    // .catch(e => console.log(e))
})



// Server
app.listen(3000, () => {
    console.log('Server started on port: 3000')
})