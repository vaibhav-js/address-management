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
  const {name, username, password} = req.body;

  if (!name || !username || !password) {
    return res.send({error: 'Could not read empty', pass: 'false'})
  }

  pool.query('select * from users where username = $1',[username], (err, result) => {
    if (err) {
      res.send({error:err, pass: 'false'});
    } else if(result.rowCount){
      res.send({error:'User exists', pass: 'false'});
    } else {
      pool.query('insert into users (name, username, password) values ($1, $2, $3)',[name, username, password], (err2, result2) => {
        if (err2) {
          res.send({error:'Error adding user', pass: 'false'});
        } else {
          res.send({error:undefined, pass: 'true'});
        }
      });
    }
  });
})

app.post('/login', (req, res) => {
  const {username, password} = req.body;
  pool.query('select * from users where username = $1 and password = $2',[username, password], (err1, result1) => {
    if (err1) {
      res.send({name: undefined, pass: 'false'});
    } else if(result1.rowCount) {
      const date = new Date();
      const token = Buffer.from(date.toISOString()+username).toString('base64');
      pool.query('update users set token = $1 where username = $2',[token, username], (err2) => {
        if (err2) {
          res.send({name: undefined, pass: 'false'});
        } else {
          var fullName = result1.rows[0].name
          var name = fullName
          const spaceIndex = fullName.indexOf(' ');
          if (spaceIndex !== -1) {
            name = fullName.substring(0, spaceIndex);
          }
          res.send({name, pass: 'true' , token});
        }
      });
    } else {
      res.send({name: undefined, pass: 'false'});
    }
  })
})

app.post('/logout', (req, res) => {
  const token = req.body.token;
  pool.query('update users set token = $1 where id = (select id from users where token = $2)',['',token], (err, result) => {
    if (err) {
      res.send({success: 'false'});
    } else if (result.rowCount){
      res.send({success: 'true'});
    }
  });
});

app.post('/addaccessible', (req, res) => {

  const {accessible, accessibleValue, token } = req.body;
  if (!accessible.trim() && !accessibleValue.trim()) {
    return res.send({newAccessible: undefined, error: "Provide your accessible"});
  } else if (!accessible.trim()) {
    return res.send({newAccessible: undefined, error: "Accessible cannot be empty!"});
  } else if (!accessibleValue.trim()) {
    return res.send({newAccessible: undefined, error: "Accessible value cannot be empty!"});
  }
 
  pool.query('select id from users where token = $1',[token], (err, result) => {
    if (err) {
      res.send({newAccessible: undefined, error: 'Something went wrong!'});
    } else if(result.rowCount) {
      pool.query('select id from accessibles where name = $1', [accessible], (err2, result2) => {
        if (err2) {
          res.send({newAccessible: undefined, error: 'Cannot retrieve accessible'});
        } else if (result2.rowCount) {
          pool.query('insert into userAccessiblesMapping (userid, aid) values ($1, $2)', [result.rows[0].id, result2.rows[0].id], (err3, result3) => {
            if (err3) {
              res.send({newAccessible: undefined, error: 'Something went wrong!'});
            } else if (result3.rowCount) {
              res.send({newAccessible: undefined, error: 'Alreay added'});
            } else {
              res.send({newAccessible: accessible, error: undefined});
            }
          })
        } else {
          pool.query('insert into accessibles (name, value) values ($1, $2) returning id', [accessible, accessibleValue], (err4, result4) => {
            if (err4) {
              res.send({newAccessible: undefined, error: 'Cannot add accessible'});
            } else {
              pool.query('insert into userAccessiblesMapping (userid, aid) values ($1, $2)', [result.rows[0].id, result4.rows[0].id], (err5, result5) => {
                if (err5) {
                  res.send({newAccessible: undefined, error: 'Cannot map accessible'});
                } else {
                  res.send({newAccessible: accessible, error: undefined});
                }
              })
            }
          });
        }
      });
    }
    else {
      res.send({newAccessible: undefined, error: 'cannot find user'});
    }
  })
})

app.get('/getaccessible', (req, res) => {
  const token = req.query.token;
  pool.query('select aid from userAccessiblesMapping where userid = (select id from users where token = $1)', [token], (err, result) => {
    if (err) {
      res.send(err)
    } else {
      const resultId = result.rows.map(row => row.aid);
      const idList = resultId.join(',');
      const query = `select * from accessibles where id IN (${idList})`
      pool.query(query, (err2, result2) => {
        if (err2) {
          res.send(err2);
        } else {
          res.send(result2.rows);
        }
      });
    }
  });
})

app.listen(8080, () => {
    console.log("Running on server 8080..");
})