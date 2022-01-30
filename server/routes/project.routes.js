const { authJWT } = require("../middleware");
const controller = require("../controllers/project.controller");

module.exports = function (app) {

    app.post("/api/project", [authJWT.verifyToken], controller.createProject);

    app.get("/api/project/:projectId", [authJWT.verifyToken], controller.loadProject);

    app.put("/api/project", [authJWT.verifyToken], controller.editProject);

};