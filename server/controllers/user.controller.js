const db = require("../models");
const User = db.user;
const Project = db.project;
const Follower = db.followers;

exports.loadUserData = (req, res) => {

    // If user requesting somebody else's data
    if (req.body.username) {
        User.findOne({
            where: {
                username: req.body.username
            }
        }).then(user => {
            if (!user || !user.active) {
                return res.status(404).send({ message: "Page not found" });
            }
            return res.status(200).send({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture
            })  
        })
    }
    // If user requesting their own data
    else if (req.userId == req.params.userId) {
        User.findOne({ where: { id: req.params.userId } })
        .then(foundUser => { 
            if (!foundUser) { 
                return res.status(404).send({ message: "User not found" });
            }

            Project.findAndCountAll({ where: { ownerId: req.params.userId } }).then(userProjects => {

                var userData = { userId: foundUser.userId, username: foundUser.username, projectList: [] };
                //var userData = { userId: foundUser.userId, username: foundUser.username, projectList: [] };

                var userData = {
                    userId: foundUser.userId,
                    username: foundUser.username,
                    firstName: foundUser.firstName,
                    lastName: foundUser.lastName,
                    emailAddress: foundUser.emailAddress,
                    roles: foundUser.roles,
                    projectList: []
                }

                for (let i = 0; i < userProjects.count; i++) { 
                    userData.projectList.push(userProjects.rows[i].projectId);
                }
                res.status(200).send(JSON.stringify(userData));
            }).catch(e => {
                console.log("Error loading user data: " + e.message);
                res.status(500).send({ message: "Error loading user data" });
            });
        }).catch(e => { 
            console.log("Error loading user data: " + e.message);
            res.status(500).send({ message: "Error loading user data" });
        })
    }
    else { 
        //console.log(req.header.userId + "  " + req.params.userId);
        res.status(401).send({ message: "Access denied" });
    }
};

exports.followUser = (req, res) => {
    try {
        Follower.findOne({
            where: {
                userId1: req.userId,
                userId2: req.body.id
            }
        })
        .then(async (follower) => {
            if (!follower) {
                var fol = Follower.build({
                    userId1: req.userId,
                    userId2: req.body.id
                });
                await fol.save();
                return res.status(200).send({id: fol.userId2});
            } else {
                await follower.destroy();
                return res.status(200).send({id: follower.userId2});
            }
        })
    } catch (err) {
        return res.status(500).send(err);
    }
};