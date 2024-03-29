const { verifyRegister } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
    
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/auth/register",
        [verifyRegister.checkDuplicateUsernameOrEmail,
        verifyRegister.checkRoleExists],
        controller.register
    );

    app.post("/api/auth/login", controller.login);

    app.get("/api/verify/:token", controller.verify);

    app.post("/api/auth/passwordreset", controller.requestPwdChange);

    app.get("/api/verifyPwdReset/:token", controller.verifyPwdReset);

    app.post("/api/auth/changePassword", controller.changePassword);

    app.post("/api/auth/refreshToken", controller.refreshToken);
};