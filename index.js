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

app.get('/thankyou', async (req, res) => {
  
  res.render('thankyou.ejs');

})

app.post('/register', async (req, res) => {
  
  const email = req.body.username;
  const password = req.body.password;

  try { 

    const checkedEmail = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkedEmail.rows.length > 0) {

      res.send("Email has already exists...");

    } else {
      
      await db.query("INSERT INTO users(email, password) VALUES($1, $2)", [email, password]);
      res.redirect('/thankyou');

    }

  } catch (err) {
    
    console.log(err);

  }

});

app.post('/login', async (req, res) => {
  
  const email = req.body.username;
  const password = req.body.password;

  try {

    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length > 0) {
      
      const user = result.rows[0];
      const userPassword = user.password;

      if (userPassword === password) {
        
        res.render('secrets.ejs');

      } else {
        
        res.send('Password does not matched');

      }

    } else {
      
      res.send('User not found');

    }

   } catch (err) {
    

  }

});

app.listen(port, () => {

  console.log(`Server is started on ${port} port`);

});