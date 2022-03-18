const { authJWT } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/user/:userId",
    [authJWT.verifyToken],
    controller.loadUserData
  );

  app.post(
    "/api/followUser",
    [authJWT.verifyToken],
    controller.followUser
  );

};