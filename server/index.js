const cors = require("cors");
const express = require("express");
const mysql = require("mysql");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  user: "mementouser",
  host: "momento.clkmzqnzhe8z.eu-west-2.rds.amazonaws.com",
  password: "Memento2022",
  database: "memento",
});

app.get("/users", (req,res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err){
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse application/json requests
app.use(express.json());

// parse application/x-www-form-urlencoded requests
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;

db.sequelize.sync();

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});