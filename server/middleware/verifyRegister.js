const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // username
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Username is already taken!"
            });
            return;
        }

        // email address
        User.findOne({
            where: {
                emailAddress: req.body.emailAddress
            }
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: "An account with this email address already exists!"
                });
                return;
            }

            next();
        });
    });
};

checkRoleExists = (req, res, next) => {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLES.includes(req.body.roles[i])) {
          res.status(400).send({
            message: "Failed! Role does not exist = " + req.body.roles[i]
          });
          return;
        }
      }
    }
    
    next();
  };

const verifyRegister = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRoleExists: checkRoleExists
};

module.exports = verifyRegister;