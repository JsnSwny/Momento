const Imports = require("../Imports");
const Canvas = require("canvas");
const fs = require("fs");
const awsController = require("./aws.controller");
const { projectRole, post, postImage } = require("../models");
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

                        pageInfo.push({ title: pages.rows[i].pageTitle, description: pages.rows[i].pageDescription, pageId: pages.rows[i].pageId });
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
            updateProjectInformation(req.body.projectId);
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

                    user.findOne({ where: { id: req.userId } })
                        .then(foundUser => {

                            if (!foundUser) {
                                return res.status(404).send({ message: "User not found" });
                            }

                            projectRole.findOne({ where: { projectId: foundProject.projectId, userId: req.body.roleUserId } })
                                .then(foundRole => {
                                    
                                    //Add role
                                    if (req.body.add) {

                                        if (foundRole && foundRole.roleName == req.body.roleName) {
                                            return res.status(400).send({ message: "Role already exists" });
                                        }

                                        projectRole.create({
                                            projectId: foundProject.projectId,
                                            userId: req.body.roleUserId,
                                            roleName: req.body.roleName
                                        }).then(newRole => {
                                            return res.status(200).send({ message: "success" });
                                        })
                                        .catch(e => {

                                            console.log("Internal server error when changing project permissions: " + e.message);
                    
                                            return res.status(500).send({ message: "Internal server error when changing project permissions" });
                                        });
                                    } else {
                                        //Remove role

                                        if (foundRole && foundRole.roleName != req.body.roleName) {
                                            return res.status(400).send({ message: "Role does not exist" });
                                        }
                                        try {
                                            projectRole.destroy({ where: { projectId: foundProject.projectId, userId: req.body.roleUserId, roleName: req.body.roleName } });
                                        } catch (e) {
                                            console.log("Error deleting project role: " + e);

                                            return res.status(500).send({ message: "Internal server error when deleting project role" });
                                        }
                                    }

                                })
                                .catch(e => {

                                console.log("Internal server error when changing project permissions: " + e.message);

                                return res.status(500).send({ message: "Internal server error when changing project permissions" });
                                });
                        })
                        .catch(e => {

                            console.log("Error finding user when changing user permissions: " + e);
                        });

                } else {

                    return res.status(403).send({ message: "Access denied" });
                }
            });     
    });
};

const userProjectEditingMap = new Map();
const canvasViewingList = new Map();

const editingTimeoutTime = 8000;

function CheckWhoIsEditing() {
    try {
        console.log("Counting active canvas instances...");
        var currentTime = Date.now();

        userProjectEditingMap.forEach((project, key) => {

            if ((currentTime - project.time) > editingTimeoutTime) {
                
                var pageId = Number(JSON.parse(key).pageId);

                if (canvasViewingList.has(pageId)) {

                    var viewingList = canvasViewingList.get(pageId);

                    viewingList.splice(viewingList.indexOf(JSON.parse(key).userId), 1);
                }

                userProjectEditingMap.get(key).connection.close();

                userProjectEditingMap.delete(key);

                updateWhoIsViewing(pageId);
            }
        });

        console.log("There are currently " + userProjectEditingMap.size + " active canvas instances.");
    } catch (e) {
        console.log("Error when checking editing list: " + e);
    }
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
    
        //Find the project to load
        project.findOne({ where: { projectId: data.projectId } })
            .then(foundProject => {

                //Ensure that the project exists
                if (!foundProject) {
                    return;
                }

                //Check permissions
                checkProjectPermissions(foundProject.projectId, data.userId).then(permissions => {

                    if (permissions === "none") {

                        return;
                    }

                    page.findOne({ where: { projectId: data.projectId, pageNumber: data.pageNumber } })
                        .then(foundPage => {

                            //Ensure that the page exists
                            if (!foundPage) {
                                return;
                            }

                            var key = JSON.stringify({ userId: Number(data.userId), pageId: Number(foundPage.pageId) });

                            if (userProjectEditingMap.has(key)) {
                
                                userProjectEditingMap.get(key).connection = ws;

                                sendInitialCanvasData(ws, data.projectId, data.pageNumber, data.userId);
                            }
                        }).catch(() => {
                            console.log("Error finding page when initialising WebSocket connection: " + e.message);
                        });

                });

            }).catch(e => {

                console.log("Error finding project when initialising WebSocket connection: " + e.message);
            });
    });
})

const sendInitialCanvasData = (client, projectId, pageNumber, userId) => {

    //Find the page
    page.findOne({ where: { projectId: projectId, pageNumber: pageNumber } })
        .then(async foundPage => {
        
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
                updateWhoIsViewing(foundPage.pageId);

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

                page.findOne({ where: { projectId: req.body.projectId, pageNumber: req.body.pageNumber } })
                    .then(foundPage => {

                        //Ensure that the page exists
                        if (!foundPage) {
                            return res.status(404).send({ message: "Page not found" });
                        }
                        
                        userProjectEditingMap.set(JSON.stringify({ userId: Number(req.userId), pageId: Number(foundPage.pageId) }), { projectId: req.body.projectId, pageNumber: req.body.pageNumber, pageId: foundPage.pageId, time: Date.now(), connection: null, authToken: req.headers["x-access-token"] });

                        if (canvasViewingList.has(Number(foundPage.pageId))) {
                            if(canvasViewingList.get(Number(foundPage.pageId)).findIndex(x => x == req.userId) === -1)
                                canvasViewingList.get(Number(foundPage.pageId)).push(req.userId);
                        } else {
                            canvasViewingList.set(Number(foundPage.pageId), [req.userId]);
                        }

                    }).catch(() => {

                    });

                
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

                page.findOne({ where: { projectId: req.body.projectId, pageNumber: req.body.pageNumber } })
                    .then(foundPage => {

                        //Ensure that the page exists
                        if (!foundPage) {
                            return res.status(404).send({ message: "Page not found" });
                        }

                        var key = JSON.stringify({ userId: Number(req.userId), pageId: Number(foundPage.pageId) });

                        if (userProjectEditingMap.has(key)) {
                            
                            //userProjectEditingMap.set(key, { projectId: req.body.projectId, pageNumber: req.body.pageNumber, time: Date.now(), connection: userProjectEditingMap.get(req.userId).connection });
                            userProjectEditingMap.get(key).time = Date.now();
                        
                            return res.status(200).send({ message: "success" });
            
                        } else {
                            return res.status(400).send({ message: "Connection must be initialised first" });
                        }

                    }).catch(() => {

                    });
            });
    }).catch(e => {

        console.log("Internal server error when updating editing status: " + e.message);

        res.status(500).send({ message: "Internal server error when updating editing status" });
    });
};

exports.updateProjectInformation = (projectId, userId, pageId) => {
  
    //Find the project to load
    project.findOne({ where: { projectId: projectId } })
        .then(foundProject => {

            //Compile page data
            pageTitles = page.findAndCountAll({ where: { projectId: projectId } })
            .then(pages => { 

                pageInfo = [];

                for (let i = 0; i < pages.count; i++) { 

                    pageInfo.push({ title: pages.rows[i].pageTitle, description: pages.rows[i].pageDescription, pageId: pages.rows[i].pageId });
                }

                var projectData = { projectId: projectId, ownerId: foundProject.ownerId, title: foundProject.title, description: foundProject.description, pageCount: pageInfo.length, pageInfo: pageInfo };

                var outgoingData = [{ changeType: 7, elementData: { projectData: projectData } }];

                userProjectEditingMap.forEach((project, key) => {

                    key = JSON.parse(key);
                    
                    if (project.projectId == projectId && key.userId != userId) {
        
                        project.connection.send(JSON.stringify(outgoingData));
                    }
                });

                if (pageId) {
                    removePageFromLists(pageId);
                }


            }).catch(e => { 

                console.log("Internal server error when updating page information: " + e.message);

            });

        }).catch(e => {

            console.log("Error finding a project when updating page information: " + e);
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

        userProjectEditingMap.forEach((project, key) => {

            key = JSON.parse(key);

            if (project.projectId == changeData.projectId && project.pageNumber == changeData.pageNumber && key.userId != user) {

                checkProjectPermissions(project.projectId, key.userId).then(permissions => {

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

const updateWhoIsViewing = (pageId) => {
    
    try {

        var viewingList = canvasViewingList.get(Number(pageId));

        var userList = [];
        
        if (viewingList) {

            for (let i = 0; i < viewingList.length; i++) {

                user.findOne({ where: { id: viewingList[i] } }).then(foundUser => {
                
                    if (foundUser) {

                        userList.push({ userId: viewingList[i], username: foundUser.username });
                    
                        if (i == (viewingList.length - 1)) {
                        
                            for (let j = 0; j < userList.length; j++) {

                                var viewers = [];
                                
                                for (let k = 0; k < userList.length; k++) {
                
                                    if (j != k) {
                                    
                                        viewers.push({ userId: userList[k].userId, username: userList[k].username });
                                    
                                    }
                                }

                                var key = JSON.stringify({ userId: Number(userList[j].userId), pageId: Number(pageId) })

                                if (userProjectEditingMap.has(key)) {

                                    if (userProjectEditingMap.get(key).connection)
                                        userProjectEditingMap.get(key).connection.send(JSON.stringify([{ changeType: 6, elementData: viewers }]));
                                }
                            }
                        }
                    }
                })
                .catch(() => {
                    console.log("Error finding user who is viewing canvas");
                })
            }
        }

    }catch (e) { 
        console.log("Error updating who is viewing a canvas: " + e.message);
    }
};

const removePageFromLists = (pageId) => {

    try {
        if (canvasViewingList.has(Number(pageId))) {
        
            canvasViewingList.delete(Number(pageId));
        }

        userProjectEditingMap.forEach((project, key) => {

            key = JSON.parse(key);

            if (pageId == key.pageId) {

                project.connection.close();

                userProjectEditingMap.delete(key);
            }
        });
    } catch (e) {
        
        console.log("Error when attempting to remove a deleted page from lists: " + e);
    }
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

const axios = require("axios");
const S3 = require("aws-sdk/clients/s3");
const aws_sdk = require("aws-sdk");
const uuid = require("uuid");

const access = new aws_sdk.Credentials({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

const s3 = new S3({
    credentials: access,
    region: "eu-west-2",
    signatureVersion: "v4",
});

exports.exportProject = (req, res) => {

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

                projectRole.findAndCountAll({ where: { projectId: req.params.projectId } })
                .then(roles => {
                    
                    var creator = roles.rows.filter(x => x.dataValues.roleName === "creator")[0];
                    
                    if (!creator)
                        return res.status(404).send({ message: "Could not find project creator" });
                    
                    post.create({
                        userId: creator.userId,
                        title: foundProject.title,
                        description: foundProject.description,
                        imageURL: "",
                        views: 0,
                        collaborators: roles.count,
                        datePosted: Date.now(),
                    })
                    .then(newPost => {
                        
                        //Export each page to an image
                        pageTitles = page.findAndCountAll({ where: { projectId: req.params.projectId } })
                        .then(pages => {

                            if (!pages.rows[0]) {
                        
                                return res.status(400).send({ message: "The project is empty" });
                            }

                            var initialCanvasSize = JSON.parse(JSON.parse(pages.rows[0].pageData)[0]);

                            var canvas = Canvas.createCanvas(initialCanvasSize.width, initialCanvasSize.height);

                            Imports.then(async ([{ default: Konva }, { default: fetch }]) => {

                                var stage = new Konva.Stage(
                                    {
                                        container: canvas,
                                        width: initialCanvasSize.width,
                                        height: initialCanvasSize.height
                                    });

                                var stageLayer = new Konva.Layer();
                                
                                stage.add(stageLayer);

                                var imageURLs = [];
                                
                                //Export each page
                                for (let i = 0; i < pages.count; i++) {

                                    var currentPageData = JSON.parse(pages.rows[i].pageData);

                                    var nodes = [];

                                    //Add each element to the konva stage
                                    for (let j = 0; j < currentPageData[1].length; j++) {

                                        currentPageData[1][j].data.id = String(currentPageData[1][j].data.id);

                                        //Round any coordinates
                                        if (currentPageData[1][j].data.x) {
                                            
                                            currentPageData[1][j].data.x = Math.round(currentPageData[1][j].data.x);
                                        }

                                        if (currentPageData[1][j].data.y) {
                                            
                                            currentPageData[1][j].data.y = Math.round(currentPageData[1][j].data.y);
                                        }

                                        var currentNode;
                                        
                                        switch (currentPageData[1][j].data.elType) {
                                            
                                            case "Text":
                                                currentNode = new Konva.Text(currentPageData[1][j].data);
                                                break;
                                            
                                            case "Line":
                                                currentNode = new Konva.Line(currentPageData[1][j].data);
                                                currentNode.setAttr("x", 0);
                                                currentNode.setAttr("y", 0);
                                                currentNode.setAttr("stroke", currentPageData[1][j].data.colour);
                                                currentNode.setAttr("strokeWidth", Number(currentPageData[1][j].data.thickness));
                                                currentNode.setAttr("lineCap", "round");
                                                currentNode.setAttr("tension", 0.5);
                                                break;
                                            
                                            case "Image":
                                                currentNode = new Konva.Image(currentPageData[1][j].data);

                                                await Canvas.loadImage(currentPageData[1][j].data.src).then(image => {
                                                    currentNode.setAttr("image", image);
                                                });
                                                
                                                break;
                                            
                                            default:
                                                currentNode = new Konva.Node(currentPageData[1][j].data);
                                                break;
                                        }

                                        stageLayer.add(currentNode);

                                        currentNode.zIndex(currentPageData[1][j].order);

                                        nodes.push(currentNode);
                                    }

                                    //Convert the konva layer to data URL
                                    stageLayer.toDataURL({
                                        width: initialCanvasSize.width,
                                        height: initialCanvasSize.height,
                                        mimetype: "image/png",
                                        pixelRatio: 2,
                                        callback(currentImage) {

                                            //Create the post image entry in the database
                                            postImage.create({
                                                postId: newPost.id,
                                                imageNumber: i
                                            })
                                            .then(newPostImage => {
                                                
                                                var imageName = uuid.v4() + ".png";
                                                
                                                try {
                                                    
                                                    var fileBuffer = Buffer.from(currentImage.split(",")[1], "base64");
                                                    
                                                    //upload image to aws
                                                    s3.getSignedUrlPromise("putObject", {
                                                        Bucket: "momento-s3",
                                                        Key: imageName,
                                                        ContentType: "image/png",
                                                        Expires: (60 * 15),
                                                    }).then(imageURL => {
                                                        
                                                        axios.put(imageURL, fileBuffer)
                                                            .then((response) => {
                                                                imageURL = imageURL.split("?")[0];
                                                                newPostImage.imageURL = imageURL;
                                                                newPostImage.save();
                                                                
                                                                imageURLs.push({ URL: imageURL, pageNumber: i + 1 });
                
                                                                if (i == 0) {
                                                                    newPost.imageURL = imageURL;
                                                                    newPost.save();
                                                                }

                                                                //If this is the last image, send the image urls to the canvas
                                                                if (imageURLs.length == pages.count) {
                                                                    
                                                                    return res.status(200).send({ message: "success", images: imageURLs });
                                                                }
                                                            })
                                                            .catch((e) => {
                                                                console.log("Error uploading image to aws: ", e);
                                                            });
                                        
                                                    }).catch((e) => {
                                        
                                                        console.log("Error generating image URL: " + e);
                                                    });
                                                
                                                } catch (e) {
                                                    console.log(e);
                                                }
                                            })
                                            .catch(() => {
                
                                                console.log("Error when creating new post image");
                                            });
                                        }
                                    });

                                    for (let j = 0; j < nodes.length; j++) {
                                        nodes[j].destroy();
                                    }
                                }
                            });

                        }).catch(e => { 

                            console.log("Internal server error when exporting project: " + e.message);

                            return res.status(500).send({ message: "Internal server error when exporting project" });
                        });
                    })
                    .catch(() => {
                            
                        console.log("Error when creating new post");
                    });
                })
                .catch(() => {
                    console.log("Error when finding collaborators in the exported project");
                });
            });

        }).catch(e => {

            console.log("Internal server error when exporting project: " + e.message);

            return res.status(500).send({ message: "Internal server error when exporting project" });
        });
};