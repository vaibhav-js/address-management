const express = require('express');
const bodyParser = require('body-parser')
const {pool} = require('./dbConfig');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to the database :(', err);
    } else {
      console.log('Connected to the database :)');
    }
  });

app.get('/', (req, res) => {
    res.send(200);
})

app.post('/signup', (req, res) => {
  console.log(req.body.username);
  console.log(req.body.name);
  console.log(req.body.password);
  const {name, username, password} = req.body;

  pool.query('select * from users where username = $1',[username], (err, result) => {
    if (err) {
      console.error('Error while submitting', err);
    } else if(result.rowCount){
      res.send('false');
    } else {
      pool.query('insert into users (name, username, password) values ($1, $2, $3)',[name, username, password], (err, result) => {
        if (err) {
          console.error('Error adding user :(', err);
        } else {
          console.log('User added with ID', result);
          res.send('true');
        }
      });
    }
  });
})

app.post('/login', (req, res) => {
  const {username, password} = req.body;
  pool.query('select * from users where username = $1 and password = $2',[username, password], (err, result) => {
    if (err) {
      console.error('Error while submitting', err);
      res.send('false');
    } else if(result.rowCount) {
      res.send('true');
    } else {
      res.send('false');
    }
  })
    //res.send({username: req.body.username, password: req.body.password});
})

app.listen(8080, () => {
    console.log("Running on server 8080..");
})