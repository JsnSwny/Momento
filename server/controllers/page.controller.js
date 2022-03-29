const db = require("../models");
const projectController = require("./project.controller");
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

            //Check permissions
            checkProjectPermissions(foundProject.projectId, req.userId).then(permissions => {

                if (permissions === "none") {

                    return res.status(403).send({ message: "Access denied" });
                }

                //Find the last page
                page.findAndCountAll({ where: { projectId: req.body.projectId } }).then(projectPages => { 

                //Create new page object
                page.create({
                    projectId: req.body.projectId,
                    pageNumber: projectPages.count + 1,
                    pageTitle: req.body.pageTitle,
                    pageDescription: req.body.pageDescription
                })
                    .then(newPage => {
                        
                        projectController.updateProjectInformation(req.body.projectId);
                        return res.status(200).send({ message: "success", pageId: newPage.pageId, pageNumber: newPage.pageNumber, pageData: newPage.pageData, pageTitle: newPage.pageTitle, pageDescription: newPage.pageDescription });
            
                    })
                    .catch(e => { 
            
                        console.log("Error creating new page: " + e.message);
            
                        res.status(500).send({ message: "Error creating new page" });
                });
    
                }).catch(e => { 
    
                    console.log("Error creating new page: " + e.message);
            
                    res.status(500).send({ message: "Error creating new page" });
    
                });
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
    pageLock.acquire(req.params.projectId, function (done) { 

    //Find the project that the page is getting added to
    project.findOne({ where: { projectId: req.params.projectId } })
    .then(foundProject => {

        //Ensure that the project exists
        if (!foundProject) {
            return res.status(404).send({ message: "Project not found" });
        }

        //Check permissions
        checkProjectPermissions(foundProject.projectId, req.userId).then(permissions => {

            if (permissions === "none") {

                return res.status(403).send({ message: "Access denied" });
            }

            //Find the page
            page.findOne({ where: { projectId: foundProject.projectId, pageNumber: req.params.pageNumber } })
            .then(foundPage => {

                //Ensure that the page exists
                if (!foundPage) {
                    return res.status(404).send({ message: "Page not found" });
                }

                //Delete record
                try {
                    page.destroy({ where: { projectId: req.params.projectId, pageNumber: req.params.pageNumber }});

                }
                catch (e) { 

                    console.log("Error deleting page: " + e.message);

                    res.status(500).send({ message: "Internal server error when deleting page" });
                }

                reorderProjectPages(foundProject.projectId);

                projectController.updateProjectInformation(foundProject.projectId);

                res.status(200).send({ message: "success" });

            })
            .catch(e => { 
                console.log("Error finding page to be deleted: " + e.message);

                res.status(500).send({ message: "Internal server error when deleting page" });
            });
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
    //Lock this function so that it can only be called once every 200ms per project
    pageLock.acquire(req.params.projectId, function (done) {
        
        //Find the project that the page is a part of
        project.findOne({ where: { projectId: req.params.projectId } })
            .then(foundProject => {

                //Ensure that the project exists
                if (!foundProject) {
                    return res.status(404).send({ message: "Project not found" });
                }

                //Check permissions
                checkProjectPermissions(foundProject.projectId, req.userId).then(permissions => {

                    if (permissions === "none") {

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
            })
            setTimeout(function () {
                
                done(); 
            }, 200);
        
            }, function(err, ret) {
                
            }, {});
};

exports.editPage = (req, res) => {
    pageLock.acquire(req.body.projectId, function (done) { 

    //Find the project that the page is a part of
    project.findOne({ where: { projectId: req.body.projectId } })
        .then(foundProject => {

            //Ensure that the project exists
            if (!foundProject) {
                return res.status(404).send({ message: "Project not found" });
            }

            //Check permissions
            checkProjectPermissions(foundProject.projectId, req.userId).then(permissions => {

                if (permissions === "none") {

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
                        foundPage.pageTitle = req.body.newPageData.pageTitle;
                        foundPage.pageDescription = req.body.newPageData.pageDescription;

                        if(foundPage.pageData)
                            pageInfo = JSON.parse(foundPage.pageData);
                        
                        for (let i = 0; i < req.body.newPageData.length; i++) {

                            switch (req.body.newPageData[i].changeType) {
                                //Initialise page
                                case 0:
                                    pageInfo = [req.body.newPageData[i].elementData, []];
                                    break;

                                //Add new element
                                case 1:
                                    pageInfo[1].push({ ID: req.body.newPageData[i].ID, data: req.body.newPageData[i].elementData, order: pageInfo[1].length });
                                    break;
                            
                                //Edit existing element
                                case 2:
                                    var element = pageInfo[1].find(x => x.ID == req.body.newPageData[i].ID);

                                    if(element !== undefined)
                                        element.data = req.body.newPageData[i].elementData;
                                    break;
                        
                                //Delete element
                                case 3:

                                    var removedElementPosition = pageInfo[1].filter(x => x.ID == req.body.newPageData[i].ID).order;
                                    
                                    for (let j = 0; j < pageInfo[1].length; j++){

                                        if (pageInfo[1][j].order > removedElementPosition) {
                                            pageInfo[1][j].order--;
                                        }
                                    }

                                    pageInfo[1] = pageInfo[1].filter(x => x.ID != req.body.newPageData[i].ID);
                                    break;
                            
                                //Reorder elements
                                case 4:

                                    for (let j = 0; j < req.body.newPageData[i].elementData.length; j++){
                                        
                                        var current = pageInfo[1].findIndex(x => x.ID == req.body.newPageData[i].elementData[j]);
                                        pageInfo[1][current].order = j
                                    }

                                    break;
                                
                                default:
                                    return res.status(400).send({ message: "Bad request" });
                            }
                            
                        }

                        var dataCorrupt = false;

                        //Detect if the canvas data is corrupt
                        for (let i = 0; i < pageInfo[1].length; i++) {
                            for (let j = 0; j < pageInfo[1].length; j++) { 
                                if (i != j && (pageInfo[1][i].ID === pageInfo[1][j].ID || pageInfo[1][i].order === pageInfo[1][j].order)) {
                                    dataCorrupt = true;
                                }
                            }
                        }

                        //Attempt repair and resync canvas
                        if (dataCorrupt) {
                            
                            pageInfo = projectController.repairCanvasDataCorruption(pageInfo);

                            projectController.reSyncCanvas(foundProject.projectId, foundPage.pageNumber, pageInfo);

                        } else {

                            projectController.updateEditingUsers(req.body, req.userId);
                        }

                        for (let i = 0; i < pageInfo[1].length; i++) {
                            if (pageInfo[1][i].data !== undefined && pageInfo[1][i].data !== null && typeof pageInfo[1][i].data === 'string') {
                                pageInfo[1][i].data = JSON.parse(pageInfo[1][i].data);
                            }
                        }

                        var newPageData = JSON.stringify(pageInfo);

                        if (foundPage.pageData == null || foundPage.pageData == undefined || foundPage.pageData !== newPageData) {

                            foundPage.pageData = newPageData;
                    
                            foundPage.save();
                        }

                        return res.status(200).send({ message: "success" });
                    }
                    catch (e) {
                        console.log("Error writing page data to database: " + e.message);

                        return res.status(500).send({ message: "Internal server error when editing page" });
                    }

                })
                .catch(e => { 
                    console.log("Error finding page to be edited: " + e.message);

                    res.status(500).send({ message: "Internal server error when editing page" });
                });
            });
 
            })
            .catch(e => { 
                console.log("Error finding project when editing page: " + e.message);

                res.status(500).send({ message: "Internal server error when editing page" });
            });
        
            setTimeout(function () {
            
                done(); 
              }, 200);
        
            }, function(err, ret) {
                
            }, {});
};

//Reorders pages in a project
reorderProjectPages = async (projectId) => { 

    pageLock.acquire(projectId, function (done) { 


        page.findAndCountAll({ where: { projectId: projectId } }).then(projectPages => { 

            projectPages.rows.sort((x, y) => (x - y));

            //Adjust page numbers in the project accordingly
            for (let i = 0; i < projectPages.count; i++) { 

                projectPages.rows[i].pageNumber = i + 1;

                projectPages.rows[i].save();
            }

        }).catch(e => { 

            console.log("Error adjusting page numbers: " + e.message);

        });

        setTimeout(function () {
            
            done(); 
          }, 200);
    
        }, function(err, ret) {
            
        }, {});
};