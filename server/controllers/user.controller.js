const db = require("../models");
const User = db.user;
const Project = db.project;
const Follower = db.followers;

exports.loadUserData = (req, res) => {

    if (req.body.username) {
        try {
            User.findOne({
                where: {
                    username: req.body.username
                }
            }).then(user => {
                if (!user || !user.active) {
                    return res.status(404).send({ message: "Page not found" });
                }

                // If user requesting somebody else's data
                if (user.id !== req.userId) {
                    return res.status(200).send({
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        profilePicture: user.profilePicture
                    });
                } 
                // If user requesting their own data
                else {
                    Project.findAndCountAll({ 
                        where: { 
                            ownerId: req.userId 
                        } 
                    }).then(userProjects => {
        
                        var userData = {
                            userId: user.userId,
                            username: user.username,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            emailAddress: user.emailAddress,
                            profilePicture: user.profilePicture,
                            roles: user.roles,
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
                }
            })
        }
        catch (err) {
            return res.status(500).send(err);
        }
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