const db = require("../models");
const config = require("../config");
const User = db.user;
const Role = db.role;

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
    const url = `http://localhost:3001/api/verify/${verificationToken}`

    mailer(req.body.emailAddress, req.body.firstName + " " + req.body.lastName, url);

    return res.status(201).send({ message: `Sent a verification email to ${req.body.emailAddress}` });
};
  
exports.login = (req, res) => {
    User.findOne({
      where: {
        username: req.body.username
      }
    })
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: "User does not exist" });
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
          expiresIn: 86400 // 24 hours token expiration
        });
  
        var authorities = [];
        user.getRoles().then(roles => {
          for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
          }
          res.status(200).send({
            id: user.id,
            username: user.username,
            emailAddress: user.emailAddress,
            roles: authorities,
            accessToken: token
          });
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
};

exports.verify = (req, res) => {
  const { token } = req.params

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