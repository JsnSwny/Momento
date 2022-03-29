const cors = require("cors");
const express = require("express");
require("dotenv").config();
const path = require("path");

const PORT = process.env.PORT || 3001;

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse application/json requests
app.use(express.json());

// parse application/x-www-form-urlencoded requests
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, "./client/build")));

const db = require("./models");

db.sequelize.sync();

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/project.routes")(app);
require("./routes/page.routes")(app);
require("./routes/aws.routes")(app);
require("./routes/post.routes")(app);

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
