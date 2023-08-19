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
    return res.send({error: "Could not read empty", pass: "false"})
  }

  pool.query('select * from users where username = $1',[username], (err, result) => {
    if (err) {
      res.send({error:"Cannot find user", pass: 'false'});
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
    return res.send({newAccessible: undefined, error: "Provide your accessible", icon: "error"});
  } else if (!accessible.trim()) {
    return res.send({newAccessible: undefined, error: "Accessible cannot be empty!", icon: "warning"});
  } else if (!accessibleValue.trim()) {
    return res.send({newAccessible: undefined, error: "Accessible value cannot be empty!", icon: "warning"});
  }
 
  pool.query('select id from users where token = $1',[token], (err, result) => {
    if (err) {
      res.send({newAccessible: undefined, error: 'Something went wrong!', icon: "error"});
    } else if(result.rowCount) {
      pool.query('select id from accessibles where name = $1 and value = $2', [accessible, accessibleValue], (err2, result2) => {
        if (err2) {
          res.send({newAccessible: undefined, error: 'Cannot retrieve accessible', icon: "error"});
        } else if (result2.rowCount) {
          pool.query('select * from userAccessiblesMapping where userid = $1 and aid = $2', [result.rows[0].id, result2.rows[0].id], (err3, result3) => {
            if (err3) {
              res.send({newAccessible: undefined, error: 'Something went wrong!', icon: "error"});
            } else if (result3.rowCount) {
              res.send({newAccessible: undefined, error: 'Alreay added', icon: "info"});
            } else {
              pool.query('insert into userAccessiblesMapping (userid, aid) values ($1, $2)', [result.rows[0].id, result2.rows[0].id], (err4, result4) => {
                if (err4) {
                  res.send({newAccessible: undefined, error: 'Something went wrong!', icon: "error"});
                } else {
                  res.send({newAccessible: accessible, error: undefined, icon: "success"});
                }
              })
            }
          })
        } else {
          pool.query('insert into accessibles (name, value) values ($1, $2) returning id', [accessible, accessibleValue], (err5, result5) => {
            if (err5) {
              res.send({newAccessible: undefined, error: 'Cannot add accessible', icon: "error"});
            } else {
              pool.query('insert into userAccessiblesMapping (userid, aid) values ($1, $2)', [result.rows[0].id, result5.rows[0].id], (err6, result6) => {
                if (err6) {
                  res.send({newAccessible: undefined, error: 'Cannot map accessible', icon: "error"});
                } else {
                  res.send({newAccessible: accessible, error: undefined, icon: "success"});
                }
              })
            }
          });
        }
      });
    }
    else {
      res.send({newAccessible: undefined, error: 'cannot find user', icon: "error"});
    }
  })
})

app.delete('/removeAllAccessible', (req, res) => {
  const token = req.body.token;
  pool.query('select id from users where token = $1', [token], (err, result) => {
    if (err) {
      res.send({error: "cannot find user", icon: "error"});
    } else {
      pool.query('delete from useraccessiblesmapping where userid = $1', [result.rows[0].id], (err2, result2) => {
        if (err2) {
          res.send({error: "error in removing all accessibles", icon: "error"});
        } else if (result2.rowCount){
          res.send({error: undefined, icon: "success"});
        } else {
          res.send({error: "Nothing to delete", icon: "warning"});
        }
      });
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

app.post('/addlocation', (req, res) => {

  const {formData, token} = req.body
  const {address, city, state, country, postal } = formData;

  pool.query('select id from users where token = $1', [token], (err, result) => {
    if (err) {
      res.send({icon: "error", message: "Something wrong happened"}).status(400);
    } else if(result.rowCount) {
      const query = 'select id from locations where address = $1 and city = $2 and state = $3 and country = $4 and postal = $5';
      pool.query(query, [address, city, state, country, postal], (err2, result2) => {
        if (err2) {
          res.send({icon: "error", message: "Error finding location"}).status(400);
        } else if (result2.rowCount) {
          pool.query('select * from userlocationmap where userid = $1 and locationid = $2', [result.rows[0].id,result2.rows[0].id, ], (err3, result3) => {
            if (err3) {
              res.send({icon: "error", message: "Error finding user location"}).status(400);
            } else if (result3.rowCount) {
              res.send({icon: "warning", message: "Already added"}).status(200);
            } else {
              pool.query('insert into userlocationmap (userid, locationid) values ($1, $2)', [result.rows[0].id, result2.rows[0].id], (err4, result4) => {
                if (err4) {
                  res.send({icon: "error", message: "Could not add location"}).status(400);
                } else {
                  res.send({icon: "success", message: "Successfully added location"}).status(200);
                }
              })
            }
          })
        } else {
          pool.query("insert into locations (address, city, state, country, postal) values ($1, $2, $3, $4, $5) returning id", 
          [address, city, state, country, postal], 
          (err2, result2) => {
            if (err2) {
              res.send({icon: "error", message: "Could not add location"}).status(400);
            } else {
              pool.query('insert into userlocationmap (userid, locationid) values ($1, $2)', [result.rows[0].id, result2.rows[0].id], (err3, result3) => {
                if (err3) {
                  res.send({icon: "error", message: "Could not map location"}).status(400);
                } else {
                  res.send({icon: "success", message: "Succesfully added location"}).status(200);
                }
              })
            }
          })
        }
      }) 
    }
  })
})

app.get('/getlocations', (req, res) => {
  const token = req.query.token
  pool.query('select locationid from userlocationmap where userid = (select id from users where token = $1)', [token], (err, result) => {
    if (err) {
      console.error(err)
      res.send(err)
    } else {
      const allLocationIds = result.rows.map(row => row.locationid);
      const locationListIds = allLocationIds.join(',');
      const query = `select * from locations where id IN (${locationListIds})`
      pool.query(query, (err2, result2)=> {
        if (err2) {
          res.send(err2)
        } else {
          res.send(result2.rows);
        }
      })
    }
  })
})

app.delete('/removealllocations', (req, res) => {
  const token = req.body.token
  pool.query('select id from users where token = $1', [token], (err, result) => {
    if (err) {
      res.send({error: "cannot find user", icon: "error"});
    } else {
      pool.query('delete from userlocationmap where userid = $1', [result.rows[0].id], (err2, result2) => {
        if (err2) {
          res.send({error: "error in removing all locations", icon: "error"});
        } else if (result2.rowCount){
          res.send({error: undefined, icon: "success"});
        } else {
          res.send({error: "Nothing to delete", icon: "warning"});
        }
      });
    }
  })
})


app.listen(8080, () => {
    console.log("Running on server 8080..");
})