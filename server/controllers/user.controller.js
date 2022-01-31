const db = require("../models");
const user = db.user;
const project = db.project;

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



    if (req.userId == req.params.userId) {
    //if (true) {

        user.findOne({ where: { id: req.params.userId } }).then(foundUser => { 

            if (!foundUser) { 
                return res.status(404).send({ message: "User not found" });
            }

            project.findAndCountAll({ where: { ownerId: req.params.userId } }).then(userProjects => {

                var userData = { userId: foundUser.userId, username: foundUser.username, projectList: [] };

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