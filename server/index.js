const cors = require("cors");
const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 3001;

const app = express();

app.use(
  cors({
    origin: ["https://memento-uni.herokuapp.com", "http://localhost:3000"],
  })
);

// parse application/json requests
app.use(express.json());

console.log(process.env);
// parse application/x-www-form-urlencoded requests
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production") {
  // Exprees will serve up production assets
  app.use(express.static("client/build"));

  // Express serve up index.html file if it doesn't recognize route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

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
