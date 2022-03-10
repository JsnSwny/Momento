const { authJWT } = require("../middleware");
const controller = require("../controllers/aws.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/getSignedUrl",
        [authJWT.verifyToken],
        controller.getSignedUrl
    )

    app.post(
        "/api/updateProfilePic",
        [authJWT.verifyToken],
        controller.updateProfilePic
    )
}