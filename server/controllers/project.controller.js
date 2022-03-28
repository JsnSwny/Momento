const { projectRole } = require("../models");
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
            projectRole.create({
                projectId: newProject.projectId,
                userId: newProject.ownerId,
                roleName: "creator"
            }).then(newProjectRole => {
                
                res.status(200).send({ message: "success", projectId: newProject.projectId, title: newProject.title, description: newProject.description });
            })
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

            //Check permissions
            checkProjectPermissions(foundProject.projectId, req.userId).then(permissions => {

                if (permissions === "none") {

                    return res.status(403).send({ message: "Access denied" });
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

            //Check if the user has permission to edit the project
            checkProjectPermissions(foundProject.projectId, req.userId).then(permissions => {

                if (permissions === "none") {

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
            });

            res.status(200).send({ message: "success" });
    });
};

checkProjectPermissions = (projectId, userId) => {
    return projectRole.findOne({ where: { projectId: projectId, userId: userId } })
        .then(role => {
        if (role !== undefined && role !== null) {

            return role.roleName;
        } else {

            return "none";
        }
        
    }).catch(e => {

        console.log("Internal server error when accessing project permissions: " + e.message);

        return "none";
    });
};

exports.changeProjectPermissions = (req, res) => {

    //Find the project to load
    project.findOne({ where: { projectId: req.body.projectId } })
        .then(foundProject => {

            //Ensure that the project exists
            if (!foundProject) {
                return res.status(404).send({ message: "Project not found" });
            }

            //Check permissions
            checkProjectPermissions(foundProject.projectId, req.userId).then(permissions => {

                if (permissions === "creator") {

                    projectRole.create({
                        projectId: foundProject.projectId,
                        userId: req.body.newUserId,
                        roleName: "editor"
                    }).then(newRole => { 
                        return res.status(200).send({ message: "success" });
                    }).catch(e => {
    
                        console.log("Internal server error when changing project permissions: " + e.message);
            
                        res.status(500).send({ message: "Internal server error when changing project permissions" });
                    });

                } else {

                    return res.status(403).send({ message: "Access denied" });
                }
            });     
    });
};

const userProjectEditingMap = new Map();

const editingTimeoutTime = 60000;

function CheckWhoIsEditing() { 
    console.log("Checking who is currently editing projects...");
    var currentTime = Date.now();

    userProjectEditingMap.forEach((project, userId) => { 
        if ((currentTime - project.time) > editingTimeoutTime) { 
            userProjectEditingMap.delete(userId);
        }
    });

    console.log("There are currently " + userProjectEditingMap.size + " users editing projects.");
}

setInterval(CheckWhoIsEditing, editingTimeoutTime);

const jwt = require("jsonwebtoken");
const config = require("../config");
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3002 });

wss.on("connection", (ws) => { 
    ws.on("message", (msg) => { 
        var data = JSON.parse(msg);
    
        if (!data.token) { 
            return;
        }
    
        jwt.verify(data.token, config.JWT_SECRET, (err, decoded) => {
            if (err) {
                return;
            }
    
            if (data.userId != decoded.id) {
                return;
            }
        });
    
        if (userProjectEditingMap.has(data.userId)) { 
            
            userProjectEditingMap.get(data.userId).connection = ws;
            
            sendInitialCanvasData(ws, userProjectEditingMap.get(data.userId).projectId, userProjectEditingMap.get(data.userId).pageNumber);

        } else {
            return;
        }
    })
})

const sendInitialCanvasData = (client, projectId, pageNumber) => {

    //Find the page
    page.findOne({ where: { projectId: projectId, pageNumber: pageNumber } })
        .then(foundPage => {
        
        //Ensure that the page exists
        if (!foundPage) {
            console.log("Page " + pageNumber + " of project " + projectId + " not found when attemping to send initial canvas data");
        } else {

            if (foundPage.pageData) {
    
                pageInfo = JSON.parse(foundPage.pageData);

                var outgoingData = [{ changeType: 0, ID: -1, elementData: pageInfo[0] }];

                for (let i = 0; i < pageInfo[1].length; i++) {
                    try {
                        var currentElement = pageInfo[1].filter(x => x.order === i)[0];

                        if (!currentElement) {

                            foundPage.pageData = JSON.stringify(this.repairCanvasDataCorruption(pageInfo));

                            foundPage.save().then(() => { 

                                sendInitialCanvasData(client, projectId, pageNumber);
                            });

                            break;
                        }

                        var currentInstruction = { changeType: 1, ID: currentElement.ID, elementData: currentElement.data };

                        outgoingData.push(currentInstruction);
                    } catch (e) {
                        console.log("Error formatting initial canvas data: " + e);
                    }
                }

                client.send(JSON.stringify(outgoingData));
            } else {

                client.send(JSON.stringify([{ changeType: -1 }]));
            }
        }
    })
    .catch(e => { 
        console.log("Error sending initial canvas data: " + e.message);
    });
};

exports.reSyncCanvas = (projectId, pageNumber, pageInfo) => {

    try {
        var outgoingData = [{ changeType: 5, ID: -1, elementData: pageInfo[0] }];

        for (let i = 0; i < pageInfo[1].length; i++) {
        
            var currentElement = pageInfo[1].filter(x => x.order === i)[0];

            var currentInstruction = { changeType: 1, ID: currentElement.ID, elementData: currentElement.data };

            outgoingData.push(currentInstruction);
        }

        var updateUsersData = {};

        updateUsersData.newPageData = outgoingData;
        updateUsersData.projectId = projectId;
        updateUsersData.pageNumber = pageNumber;

        this.updateEditingUsers(updateUsersData, -1);
    } catch (e) {

        console.log("Error resyncing canvas: " + e);
    }
};


exports.initialiseCanvasConnection = (req, res) => {
    //Find the project to load
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

                userProjectEditingMap.set(req.userId, { projectId: req.body.projectId, pageNumber: req.body.pageNumber, time: Date.now(), connection: res, authToken: req.headers["x-access-token"] });
            
                return res.status(200).send({ message: "success" }); 
            });

    }).catch(e => {

        console.log("Internal server error when initialising canvas connection: " + e.message);

        res.status(500).send({ message: "Internal server error when initialising canvas connection" });
    });
};

exports.stillHere = (req, res) => {

    //Find the project to load
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

                if (userProjectEditingMap.has(req.userId)) {

                    userProjectEditingMap.set(req.userId, { projectId: req.body.projectId, pageNumber: req.body.pageNumber, time: Date.now(), connection: userProjectEditingMap.get(req.userId).connection });
                
                    return res.status(200).send({ message: "success" });
    
                } else {
                    return res.status(400).send({ message: "Connection must be initialised first" });
                }
            });
    }).catch(e => {

        console.log("Internal server error when updating editing status: " + e.message);

        res.status(500).send({ message: "Internal server error when updating editing status" });
    });
};

exports.updateEditingUsers = (changeData, user) => {

    try {
        var data = changeData.newPageData;

        if (data != undefined) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].elementData != undefined && data[i].elementData != null && typeof data[i].elementData === 'string') {
                    data[i].elementData = JSON.parse(data[i].elementData);
                }
            }
        }

        var outgoingData = JSON.stringify(data);

        userProjectEditingMap.forEach((project, userId) => {

            if (project.projectId == changeData.projectId && project.pageNumber == changeData.pageNumber && userId != user) {

                checkProjectPermissions(project.projectId, userId).then(permissions => {

                    if (permissions !== "none") {
    
                        project.connection.send(outgoingData);
                    }
                });
            }
        });

    }catch (e) { 
        console.log("Error updating editing users: " + e.message);
    }
};

exports.exportProject = (req, res) => {


};

exports.repairCanvasDataCorruption = (pageInfo) => {

    pageInfo[1].sort((x, y) => (x.order === y.order ? 0 : ((x.order > y.order) ? 1 : -1)));

    for (let i = 0; i < pageInfo[1].length; i++) {
        pageInfo[1][i].ID = (i + 1);
        pageInfo[1][i].order = i;

        try {
            
            if (pageInfo[1][i].data.id) {
                pageInfo[1][i].data.id = (i + 1);
            } else {
                pageInfo[1][i].data = JSON.parse(pageInfo[1][i].data);
                pageInfo[1][i].data.id = (i + 1);
            }
            
        } catch (e)
        {
            console.log("Error repairing canvas data corruption: " + e);
        }
    }

    return pageInfo;
};