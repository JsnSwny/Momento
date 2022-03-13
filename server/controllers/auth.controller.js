const db = require("../models");
const config = require("../config");
const User = db.user;
const Role = db.role;
const RefreshToken = db.refreshToken;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const mailer = require("../nodemailer/index");

exports.register = (req, res) => {
    if (!req.body.username) {
      return res.status(422).send({ message: "Missing username!" });
    } else if (!req.body.firstName || !req.body.lastName) {
      return res.status(422).send({ message: "Missing first and/or last name!" });
    } else if (!req.body.emailAddress) {
      return res.status(422).send({ message: "Missing email address!" });
    } else if (!req.body.passwordHash){
      return res.status(422).send({ message: "Password cannot be empty!" });
    }
    // INSERT INTO users
    User.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailAddress: req.body.emailAddress,
      passwordHash: bcrypt.hashSync(req.body.passwordHash, 8)
    })
      .then(user => {
        if (req.body.roles) {
          console.log(req.body.roles)
          Role.findAll({
            where: {
              name: {
                [Op.or]: req.body.roles
              }
            }
          }).then(roles => {
            user.setRoles(roles).then(() => {
              res.send({ message: "Roles assigned successfully!" });
            });
          });
        } else {
          // user role = 1
          user.setRoles([1]).then(() => {
            res.send({ message: "Roles assigned successfully!" });
          });
        }
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
    
    // Generate a verification token
    const verificationToken = jwt.sign({ emailAddress: req.body.emailAddress }, config.JWT_SECRET, {
      expiresIn: 604800 // 7 days
    })

    // Email the user a verification link
    const url = `http://localhost:3000/api/verify/${verificationToken}`

    mailer.verifyEmail(req.body.emailAddress, req.body.firstName + " " + req.body.lastName, url);

    return res.status(201).send({ message: `Sent a verification email to ${req.body.emailAddress}` });
};
  
exports.login = (req, res) => {
    User.findOne({
      where: {
        username: req.body.username
      }
    })
      .then(async (user) => {
        if (!user) {
          return res.status(400).send({ message: "User does not exist" });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.passwordHash,
          user.passwordHash
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }

        if(!user.active) {
          return res.status(401).send({
            accessToken: null,
            message: "Verify your account"
          })
        }
  
        var token = jwt.sign({ id: user.id }, config.JWT_SECRET, {
          expiresIn: config.JWT_EXPIRATION
        });

        var refreshToken = await RefreshToken.createToken(user);
  
        var authorities = [];
        user.getRoles().then(roles => {
          for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
          }
          res.status(200).send({
            id: user.id,
            username: user.username,
            name: user.firstName + " " + user.lastName,
            imageURL: user.profilePicture,
            emailAddress: user.emailAddress,
            roles: authorities,
            accessToken: token,
            refreshToken: refreshToken
          });
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
};

exports.verify = (req, res) => {
  const { token } = req.params;

  // check if token is present
  if (!token) {
    return res.status(422).send({
      message: "Token missing"
    });
  }

  // Verify the token
  let payload = null
  try {
    payload = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    return res.status(500).send(err);
  }

  // Find user with matching email address
  try {
    User.findOne({
      where: {
        emailAddress: payload.emailAddress
      }
    })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "User with this email address does not exist"
        });
      }

      // Activate account
      user.update({ active: 1 })
    })  

    return res.status(200).send({
      message: "Account verified"
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.requestPwdChange = (req, res) => {
  User.findOne({
    where: {
      emailAddress: req.body.emailAddress
    }
  })
    .then(user => {
      if (!user) {
        return res.status(400).send({ message: "User with given email address does not exist" })
      }

      // generate a new token valid for 15 minutes
      const token = jwt.sign({ emailAddress: user.emailAddress }, config.JWT_SECRET, {
        expiresIn: 900 // 15 minutes
      });

      // generate a password reset link with the token above
      const url = `http://localhost:3000/api/verifyPwdReset/${token}`

      mailer.passwordReset(user.emailAddress, user.firstName + " " + user.lastName, url);

      return res.status(201).send({ message: `Sent a password reset link to ${req.body.emailAddress}` });
    })
};

exports.verifyPwdReset = (req, res) => {
  const { token } = req.params;

  // check if token is present
  if (!token) {
    return res.status(422).send({
      message: "Token missing"
    });
  }

  // verify the token
  let payload = null
  try {
    payload = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    return res.status(500).send(err);
  }

  // Find user with matching email address
  try {
    User.findOne({
      where: {
        emailAddress: payload.emailAddress
      }
    })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "User with this email address does not exist"
        });
      }

      // send a successful response -> render the password reset form
      return res.status(200).send({
        message: "Password reset link verified"
      })
    })
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.changePassword = (req, res) => {
  // check if token is present
  if (!req.body.token) {
    return res.status(422).send({
      message: "Token missing"
    });
  }

  // Verify the token
  let payload = null
  try {
    payload = jwt.verify(req.body.token, config.JWT_SECRET);
  } catch (err) {
    return res.status(500).send(err);
  }

  try {
    User.findOne({
      where: {
        emailAddress: payload.emailAddress
      }
    })
    .then(user => {
      if (!user) {
        return res.status(400).send({ message: "User does not exist" });
      }

      var passwordHash = bcrypt.hashSync(req.body.password, 8)

      user.update({ passwordHash: passwordHash })
    })

    return res.status(200).send({
      message: "Password successfully changed"
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken === null) {
    return res.status(403).send({ 
      message: "No refresh token received" 
    });
  }
  try {
    let refreshToken = await RefreshToken.findOne({
      where: {
        token: requestToken
      }
    });

    if (!refreshToken) {
      return res.status(403).send({ 
        message: "Refresh token not found in the database" 
      });
    }

    if (RefreshToken.verifyRefreshToken(refreshToken)) {
      RefreshToken.destroy({
        where: {
          id: refreshToken.id
        }
      });

      return res.status(403).send({ 
        message: "Refresh token expired. Make a new login request"
      });
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRATION
    });

    return res.status(200).send({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token
    });
    
  } catch (err) {
    return res.status(500).send({
      message: err
    });
  }
}