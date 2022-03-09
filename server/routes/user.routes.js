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

  app.get("/api/dev/all", controller.allAccess);

  app.get(
    "/api/dev/user",
    [authJWT.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/dev/mod",
    [authJWT.verifyToken, authJWT.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/dev/admin",
    [authJWT.verifyToken, authJWT.isAdmin],
    controller.adminBoard
    );
    
  app.post(
    "/api/user/:userId",
    [authJWT.verifyToken],
    controller.loadUserData
  );
};