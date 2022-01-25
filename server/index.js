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

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
