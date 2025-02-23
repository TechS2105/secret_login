import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "12345",
  port: 5432,
});

db.connect();

app.get("/", async (req, res) => {
  res.render("home.ejs");
});

app.get("/register", async (req, res) => {
  res.render("register.ejs");
});

app.get("/login", async (req, res) => {
  res.render("login.ejs");
});

app.get("/thankyou", async (req, res) => {
  res.render("thankyou.ejs");
});

app.post("/register", async (req, res) => {
  const name = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const checkedMail = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkedMail.rows.length > 0) {
      res.send("Email already exists...");
    } else {
      await db.query(
        "INSERT INTO users(name, email, password) VALUES($1, $2, $3)",
        [name, email, password]
      );
      res.redirect("/thankyou");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const userPassword = user.password;

      if (password === userPassword) {
        res.render("secrets.ejs");
      } else {
        res.send("password does not matched");
      }
    } else {
      res.render("user not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server is started on ${port} port`);
});
