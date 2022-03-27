const { authJWT } = require("../middleware");
const controller = require("../controllers/project.controller");

module.exports = function (app) {

    app.post("/api/project", [authJWT.verifyToken], controller.createProject);

    app.get("/api/project/:projectId", [authJWT.verifyToken], controller.loadProject);

    app.put("/api/project", [authJWT.verifyToken], controller.editProject);

    app.post("/api/projectCanvasConnection", [authJWT.verifyToken], controller.initialiseCanvasConnection);

    app.post("/api/project/:projectId", [authJWT.verifyToken], controller.stillHere);
};