const { authJWT } = require("../middleware");
const controller = require("../controllers/page.controller");

module.exports = function (app) {

    app.post("/api/page", [authJWT.verifyToken], controller.createPage);

    app.delete("/api/page/:projectId/:pageNumber", [authJWT.verifyToken], controller.deletePage);

    app.get("/api/page/:projectId/:pageNumber", [authJWT.verifyToken], controller.loadPage);

    app.put("/api/page", [authJWT.verifyToken], controller.editPage);

};