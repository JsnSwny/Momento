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
            }).then(async (user) => {
                if (!user || !user.active) {
                    return res.status(404).send({ message: "Page not found" });
                }

                // get followers / following counts
                var followers = await Follower.count({
                    where: {
                        userId2: user.id
                    }
                });

                var following = await Follower.count({
                    where: {
                        userId1: user.id
                    }
                });

                console.log("followers: " + followers);
                console.log("following: " + following);

                // If user requesting somebody else's data
                if (user.id !== req.userId) {
                    return res.status(200).send({
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        profilePicture: user.profilePicture,
                        bio: user.bio,
                        followers: followers,
                        following: following,
                    });
                } 
                // If user requesting their own data
                else {
                    Project.findAll({ 
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
                            bio: user.bio,
                            followers: followers,
                            following: following,
                            roles: user.roles,
                            projectList: userProjects
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

exports.editProfile = (req, res) => {
    try {
        User.findOne({
            where: {
                id: req.userId
            }
        }).then(async (user) => {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.bio = req.body.bio;
            await user.save().then(() => {
                return res.status(200).send({message: "Profile updated"});
            });
        });
    } catch (err) {
        return res.status(500).send(err);
    }
}