/*
*   Recipe App on Sun Feb 16 2020 22:24:39
*   Author: Bryan Fernandez
*/

const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    app = express();


const { Client } = require('pg')
const client = new Client({
    user: 'postgres',
    password: 'asdf',
    port: 5433,
    database: 'Recipe DB'
})

client.connect()
.then(() => console.log("Connected successfully"))
.catch(error => console.log(error))
// .finally(() => client.end())

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


// Assign Dust Engine to .dust files
app.engine('dust', cons.dust);

// Set default extension .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Paths/Routes
// Full CRUD functionality
app.get('/', (req, res) => {
    client.query("SELECT * from recipes")
    .then(results => res.render('index', {recipes: results.rows}))
    .catch(error => console.log(error))
})

app.post('/add', (req, res) => {
    client.query("INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)",
    [req.body.name, req.body.ingredients, req.body.directions])
    .catch(error => console.log(error))
    res.redirect('/')
})

app.delete('/delete/:id', (req, res) => {
    client.query("DELETE FROM recipes WHERE id = $1", [req.params.id]);
    res.sendStatus(200);
})

app.post('/edit', (req, res) => {
    client.query("UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id=$4", [req.body.name, req.body.ingredients, req.body.directions, req.body.id])
    res.redirect('/');
})

// Server
app.listen(3000, () => {
    console.log('Server started on port: 3000')
})