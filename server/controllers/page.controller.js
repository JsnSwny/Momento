const db = require("../models");
const Op = db.Sequelize.Op;
const project = db.project;
const page = db.page;
var AsyncLock = require('async-lock');
var pageLock = new AsyncLock();

exports.createPage = (req, res) => {
    //Lock this function so that it can only be called once every 200ms per project
    pageLock.acquire(req.body.projectId, function (done) { 

    //Find the project that the page is getting added to
    project.findOne({ where: { projectId: req.body.projectId } })
        .then(foundProject => {

            //Ensure that the project exists
            if (!foundProject) {
                return res.status(404).send({ message: "Project not found" });
            }

            //Ensure that the user has permission
            if (foundProject.ownerId != req.userId) { 

                return res.status(403).send({ message: "Access denied" });
            }

            //Find the last page
            page.findAndCountAll({ where: { projectId: req.body.projectId } }).then(projectPages => { 

                //Create new page object
                page.create({
                    projectId: req.body.projectId,
                    pageNumber: projectPages.count + 1
                })
                    .then(newPage => {

                        res.status(200).send({ message: "success" });
            
                    })
                    .catch(e => { 
            
                        console.log("Error creating new page: " + e.message);
            
                        res.status(500).send({ message: "Error creating new page" });
                });

            }).catch(e => { 

                console.log("Error creating new page: " + e.message);
        
                res.status(500).send({ message: "Error creating new page" });

            });

            
        }).catch(e => { 

            console.log("Error finding project when creating new page: " + e.message);

            res.status(500).send({ message: "Error creating new page" });
        });

        setTimeout(function () {
            
            done(); 
          }, 200);
        

    }, function(err, ret) {
        
    }, {});
    
};

exports.deletePage = (req, res) => { 
//Lock this function so that it can only be called once every 200ms per project
    pageLock.acquire(req.body.projectId, function (done) { 

    //Find the project that the page is getting added to
    project.findOne({ where: { projectId: req.body.projectId } })
    .then(foundProject => {

        //Ensure that the project exists
        if (!foundProject) {
            return res.status(404).send({ message: "Project not found" });
        }

        //Ensure that the user has permission
        if (foundProject.ownerId != req.userId) { 

            return res.status(403).send({ message: "Access denied" });
        }

        //Find the page
        page.findOne({ where: { projectId: foundProject.projectId, pageNumber: req.body.pageNumber } })
        .then(foundPage => {

            //Ensure that the page exists
            if (!foundPage) {
                return res.status(404).send({ message: "Page not found" });
            }

            
            //Delete record
            try {
                page.destroy({ where: { projectId: req.body.projectId, pageNumber: req.body.pageNumber }});

            }
            catch (e) { 

                console.log("Error deleting page: " + e.message);

                res.status(500).send({ message: "Internal server error when deleting page" });
            }

            page.findAndCountAll({ where: { projectId: foundProject.projectId } }).then(projectPages => { 

                //Adjust page numbers in the project accordingly
                for (let i = 0; i < projectPages.count; i++) { 

                    if (parseInt(projectPages.rows[i].pageNumber) > parseInt(req.body.pageNumber)) { 

                        projectPages.rows[i].pageNumber = (parseInt(projectPages.rows[i].pageNumber) - 1).toString();

                        projectPages.rows[i].save();
                    }
                }

                res.status(200).send({ message: "success" });
            }).catch(e => { 

                console.log("Error finding page to be deleted: " + e.message);

                res.status(500).send({ message: "Internal server error when deleting page" });
            });

            

        })
        .catch(e => { 
            console.log("Error finding page to be deleted: " + e.message);

            res.status(500).send({ message: "Internal server error when deleting page" });
        });
            
    }).catch(e => { 

        console.log("Error finding project when deleting page: " + e.message);

        res.status(500).send({ message: "Error deleting page" });
    });
        
    setTimeout(function () {
            
        done(); 
      }, 200);

    }, function(err, ret) {
        
    }, {});

};

exports.loadPage = (req, res) => {

    //Find the project that the page is a part of
    project.findOne({ where: { projectId: req.params.projectId } })
        .then(foundProject => {

            //Ensure that the project exists
            if (!foundProject) {
                return res.status(404).send({ message: "Project not found" });
            }

            //Ensure that the user has permission
            if (foundProject.ownerId != req.userId) { 

                return res.status(403).send({ message: "Access denied" });
            }

            //Find the page
            page.findOne({ where: { projectId: req.params.projectId, pageNumber: req.params.pageNumber } })
                .then(foundPage => { 

                    //Ensure that the page exists
                    if (!foundPage) {
                        return res.status(404).send({ message: "Page not found" });
                    }

                    res.status(200).send(JSON.stringify(foundPage));

                })
                .catch(e => { 
                    console.log("Error finding page to be loaded: " + e.message);

                    res.status(500).send({ message: "Internal server error when loading page" });
                });
 
            })
            .catch(e => { 
                console.log("Error finding project when loading page: " + e.message);

                res.status(500).send({ message: "Internal server error when loading page" });
            });
};

exports.editPage = (req, res) => {

    //Find the project that the page is a part of
    project.findOne({ where: { projectId: req.body.projectId } })
        .then(foundProject => {

            //Ensure that the project exists
            if (!foundProject) {
                return res.status(404).send({ message: "Project not found" });
            }

            //Ensure that the user has permission
            if (foundProject.ownerId != req.userId) { 

                return res.status(403).send({ message: "Access denied" });
            }

            //Find the page
            page.findOne({ where: { projectId: req.body.projectId, pageNumber: req.body.pageNumber } })
                .then(foundPage => {

                    //Ensure that the page exists
                    if (!foundPage) {
                        return res.status(404).send({ message: "Page not found" });
                    }

                    //Update page data
                    try { 
                        foundPage.pageData = req.body.newPageData;

                        foundPage.save();

                    }
                    catch (e) {
                        console.log("Error writing page data to database: " + e.message);

                        res.status(500).send({ message: "Internal server error when editing page" });
                    }

                    res.status(200).send({ message: "success" });

                })
                .catch(e => { 
                    console.log("Error finding page to be edited: " + e.message);

                    res.status(500).send({ message: "Internal server error when editing page" });
                });
 
            })
            .catch(e => { 
                console.log("Error finding project when editing page: " + e.message);

                res.status(500).send({ message: "Internal server error when editing page" });
            });
};