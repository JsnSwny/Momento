const db = require("../models");
const user = db.user;
const project = db.project;
const projectRole = db.projectRole;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content");
};

exports.userBoard = (req, res) => {
res.status(200).send("User Content");
};

exports.adminBoard = (req, res) => {
res.status(200).send("Admin Content");
};

exports.moderatorBoard = (req, res) => {
res.status(200).send("Mod Content");
};

exports.loadUserData = (req, res) => {

    // If user requesting somebody else's data
    if (req.body.username) {
        user.findOne({
            where: {
                username: req.body.username
            }
        }).then(user => {
            if (!user || !user.active) {
                return res.status(404).send({ message: "Page not found" });
            }
            return res.status(200).send({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture,
                posts: []
            })  
        })
    }
    // If user requesting their own data
    else if (req.userId == req.params.userId) {
    
        user.findOne({ where: { id: req.params.userId } }).then(foundUser => { 

            if (!foundUser) { 
                return res.status(404).send({ message: "User not found" });
            }

            var userData = {
                userId: foundUser.id,
                username: foundUser.username,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                emailAddress: foundUser.emailAddress,
                roles: foundUser.roles,
                projectList: [],
                posts: []
            }

            projectRole.findAndCountAll({ where: { userId: req.params.userId } }).then(userProjectRoles => { 

                for (let i = 0; i < userProjectRoles.count; i++) { 

                    project.findOne({ where: { projectId: userProjectRoles.rows[i].projectId } })
                        .then(foundProject => { 
                            
                            userData.projectList.push({
                                projectId: foundProject.projectId,
                                title: foundProject.title,
                                description: foundProject.description,
                                role: userProjectRoles.rows[i].roleName
                            });
                            

                            if (i === (userProjectRoles.count - 1)) {

                                res.status(200).send(JSON.stringify(userData));
                            }
                            
                        }).catch(e => {
                            console.log("Error loading user's project data: " + e.message);
                        });
                }

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