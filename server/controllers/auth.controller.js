const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.register = (req, res) => {
    // INSERT INTO users
    console.log(req.body);
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
              res.send({ message: "Registration successful!" });
            });
          });
        } else {
          // user role = 1
          user.setRoles([1]).then(() => {
            res.send({ message: "Registration successful!" });
          });
        }
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
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
  
        var token = jwt.sign({ id: user.id }, config.secret, {
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