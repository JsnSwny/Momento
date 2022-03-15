const db = require("../models");
const user = db.user;
const project = db.project;
const page = db.page;

exports.createProject = (req, res) => {
        
    //Create a new project
    project.create({
        ownerId: req.userId,
        title: req.body.title,
        description: req.body.description
    })
        .then(newProject => {
            res.status(200).send({ message: "success", projectId: newProject.projectId, title: newProject.title, description: newProject.description });
    })
        .catch(e => { 
            console.log("Internal server error when creating new project: " + e.message);

            res.status(500).send({ message: "Internal server error when creating new project" });
    });
    
};

exports.loadProject = (req, res) => {

    //Find the project to load
    project.findOne({ where: { projectId: req.params.projectId } })
        .then(foundProject => {

            //Ensure that the project exists
            if (!foundProject) {
                return res.status(404).send({ message: "Project not found" });
            }

            //Compile page data
            pageTitles = page.findAndCountAll({ where: { projectId: req.params.projectId } })
                .then(pages => { 

                    pageInfo = [];

                    for (let i = 0; i < pages.count; i++) { 

                        pageInfo.push({ title: pages.rows[i].pageTitle, description: pages.rows[i].pageDescription });
                    }

                    var projectData = { projectId: req.params.projectId, ownerId: foundProject.ownerId, title: foundProject.title, description: foundProject.description, pageCount: pageInfo.length, pageInfo: pageInfo };

                    res.status(200).send(JSON.stringify(projectData));

                }).catch(e => { 

                    console.log("Internal server error when loading project: " + e.message);
    
                    res.status(500).send({ message: "Internal server error when loading project" });
    
                });

        }).catch(e => {

            console.log("Internal server error when loading project: " + e.message);

            res.status(500).send({ message: "Internal server error when loading project" });
        });
};

exports.editProject = (req, res) => {

    //Find the project to load
    project.findOne({ where: { projectId: req.body.projectId } })
        .then(foundProject => {

            //Ensure that the project exists
            if (!foundProject) {
                return res.status(404).send({ message: "Project not found" });
            }

            //Check if the user has permission to edit the project (this must be changed when multi-user project functionality is added)
            if (foundProject.ownerId != req.userId) { 

                return res.status(403).send({ message: "Access denied" });
            }

            try { 
                
                foundProject.title = req.body.newTitle;
                foundProject.description = req.body.newDescription;

                foundProject.save();

            }
            catch (e) { 
                console.log("Error updating project: " + e.message);

                return res.status(500).send("Error updating project");
            }

            
            res.status(200).send({ message: "success" });
    });
};
        