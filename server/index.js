const cors = require("cors");
const express = require("express");
require('dotenv').config()

const PORT = process.env.PORT || 3001;

const app = express();

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

const mailer = require("./nodemailer/index")
// Careful with uncommenting this line - SMTP server can only send 300 messages
// a day on a free plan
//mailer("aas20@hw.ac.uk", "Adrian Szarapow", "http://localhost:3000/login");

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
