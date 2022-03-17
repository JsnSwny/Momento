const { authJWT } = require("../middleware");
const controller = require("../controllers/posts.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/getPosts",
        [authJWT.verifyToken],
        controller.getPosts
    );

    app.post(
        "/api/addComment",
        [authJWT.verifyToken],
        controller.addComment
    );

    app.post(
        "/api/likePost",
        [authJWT.verifyToken],
        controller.likePost
    );

    app.post(
        "/api/unlikePost",
        [authJWT.verifyToken],
        controller.unlikePost
    )

}