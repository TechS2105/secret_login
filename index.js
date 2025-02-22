import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = new pg.Client({

  user: "postgres",
  host: "localhost", 
  database: "secrets",
  password: "12345",
  port: 5432

});

db.connect();

app.get('/', async (req, res) => {
  
  res.render('home.ejs');

});

app.get('/register', async (req, res) => {
  
  res.render('register.ejs');

});

app.get('/login', async (req, res) => {
  
  res.render('login.ejs');

});

app.post('/register', async (req, res) => {
  
  const email = req.body.username;
  const password = req.body.password;

  const checkedEmail = await db.query("SELECT email FROM users WHERE email = $1", [email]);

  if (checkedEmail.rows.length > 0) {
    
    res.send(`Email has alreadey exists....`);

  } else {
    
    await db.query("INSERT INTO users(email, password) VALUES($1, $2)", [email, password]);
    res.render('secrets.ejs');

  }

});

app.post('/login', async (req, res) => {
  
  const email = req.body.username;
  const password = req.body.password;

  try {
    
    const checkedEmail = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkedEmail.rows.length > 0) {
      
      const user = checkedEmail.rows[0];
      const userPass = user.password;

      if (userPass === password) {
        
        res.render('secrets.ejs');

      } else {
        
        res.send('Password does not match');

      }

    } else {
      
      res.send('user not found');

    }

  } catch (err) {
    
    console.log(err);

  }

});

app.listen(port, () => {

  console.log(`Server is started on ${port} port`);

});