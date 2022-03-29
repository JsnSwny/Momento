import Konva from "konva";
import store from "../../store/store";
import { loadUserData } from "../../store/actions/user";
import { newProject, loadProject, editProject, initCanvasConnection, stillHere, requestProjectExport, changePermissions } from "../../store/actions/project";
import { canvasAddPage, canvasDeletePage, canvasLoadPage, canvasEditPage  } from "../../store/actions/canvas";
var stageRef;

const projectPageLoaded = (id, stage) => (dispatch) => { 

    stageRef = stage;

    dispatch(
        loadProject(id)
    )
    .then(() => {

        if (store.getState().project.currentProjectData.pageCount === 0) {
            dispatch(addPage(1, "Page 1", ""));
        } else {
            dispatch(loadPage(1));
        }
    }).catch(() => {
        console.log("Error");
    });
};

 //Load information about a user (this is required to get a list of the project ids which are needed to load a project)
 const loadUser = (stage) => (dispatch) => {

    stageRef = stage;

    dispatch(
        loadUserData(JSON.parse(localStorage.getItem("user")).id)
      )
      .then(() => {
        
          console.log(store.getState().user.currentUserData.projectList);
          
          //If the user has no projects, create a new one
          if (store.getState().user.currentUserData.projectList.length === 0) {
              
              dispatch(createProject("New Project", "Project Description", false));
          }
          else { 

              dispatch(loadProjectData(store.getState().user.currentUserData.projectList[0].projectId));
              //dispatch(loadProjectData(store.getState().user.currentUserData.projectList.reduce((a, b) => a.projectId < b.projectId ? a.projectId : b.projectId)));
          }
          
      })
      .catch(() => {
        
        console.log("Error loading user data");
      })
};

//Creates a new project
const createProject = (title, description, navigateToProject) => (dispatch) => {

    dispatch(
        newProject(title, description)
    )
        .then(() => {
        
            if (navigateToProject) {
                window.location.href = `/project/${store.getState().project.currentProjectData.projectId}`;
            } else {

                //Add a new page to the project
                dispatch(addPage(1, "Page 1", "Description"));
                store.getState().user.userData.projectList.push(store.getState().project.currentProjectData.projectId);
            }
        })
        .catch(() => {

           console.log("Error creeating project");
        });
};

//Add a new page to the project
const addPage = (pageNumber, title, description) => (dispatch) => {
    dispatch(
        canvasAddPage(store.getState().project.currentProjectData.projectId, pageNumber, title, description)
      )
        .then(() => {
            
            store.getState().project.movingPage = true;
            dispatch(loadPage(store.getState().project.currentProjectData.pageCount));
            
            //dispatch(savePage());
      })
      .catch(() => {
        
        console.log("Error adding new page");
      })
};

//Returns information about the project (Title, Description, Page count)
 const loadProjectData = (projectId) => (dispatch) => {

     dispatch(
         loadProject(projectId)
       )
       .then(() => {

         store.getState().project.currentProjectData.projectId = projectId;

       })
       .catch(() => {

         console.log("Error loading project data");
       })
 };

 //Edit information about the project (Title, Description, Page count)
 const editProjectData = (newTitle, newDescription) => (dispatch) => {
     dispatch(
         editProject(store.getState().project.currentProjectData.projectId, newTitle, newDescription)
       )
       .then(() => {

       })
       .catch(() => {

         console.log("Error editing project data");
       })
};

//delete a page from the project
const deletePage = (pageNumber) => (dispatch) => {
    dispatch(
        canvasDeletePage(store.getState().project.currentProjectData.projectId, pageNumber)
    )
    .then(() => {
        
        if (store.getState().project.pages.length > 1) {
            
            if (pageNumber === 1) {
                dispatch(canvasFunctions.loadPage(1));
            } else {

            dispatch(canvasFunctions.loadPage(pageNumber - 1));
            }
        } else {
            dispatch(addPage(1, "Page 1", "Description"));
            
        }
        
    })
    .catch(() => {

      console.log("Error deleting page");
    })
};

//Load a page from the project
const loadPage = (pageNumber) => (dispatch) => { 

    dispatch(
        canvasLoadPage(store.getState().project.currentProjectData.projectId, pageNumber)
    )
        .then(() => {
            
            if(store.getState().project.canvasConnection)
                store.getState().project.canvasConnection.close();

            dispatch({ type: "RESET_CANVAS" });
            dispatch({ type: "RESET_VIEWING_LIST" });
            store.dispatch({ type: "RELOAD_VIEWING_LIST" });

            startCanvasConnection();

        }).catch(() => {
        
            console.log("Error loading page");
        });
};

const loadCanvasUpdate = (stringData, dispatch) => {

    var canvasData = JSON.parse(stringData.data);
    
    for (let i = 0; i < canvasData.length; i++) {
        try {
            switch (canvasData[i].changeType) {

                //Canvas data is null
                case -1:
                    savePage();
                    break;

                //Initialise canvas data
                case 0:
                    stageRef.current.setAttrs(canvasData[i].elementData);
                    break;
            
                //Add element
                case 1:

                    if (canvasData[i].elementData.src) {

                        canvasData[i].elementData.imgObj = new Image();
                        canvasData[i].elementData.imgObj.src = canvasData[i].elementData.src;
                    }
                    
                    if(store.getState().canvas.elements.findIndex(x => x.id == canvasData[i].ID) < 0)
                        store.dispatch({ type: "LOAD_ELEMENT", payload: { id: canvasData[i].ID, attributes: canvasData[i].elementData } });

                    break;
            
                //Update element
                case 2:

                    store.dispatch({ type: "LOAD_UPDATE_ELEMENT", payload: { id: canvasData[i].ID, attributes: canvasData[i].elementData } });

                    console.log(store.getState().canvas.elements);

                    break;
            
                //Delete element
                case 3:

                    store.dispatch({ type: "LOAD_DELETE_ELEMENT", payload: { id: canvasData[i].ID, attributes: canvasData[i].elementData } });

                    break;
            
                //Reorder elements
                case 4:

                    var newElements = [];

                    for (let j = 0; j < canvasData[i].elementData.length; j++){

                        newElements.push(store.getState().canvas.elements.filter(x => x.id == canvasData[i].elementData[j])[0]);
                    }
                    
                    store.getState().canvas.elements = newElements;

                    break;
                
                //ReSync
                case 5:
                    store.getState().canvas.elements = [];

                    stageRef.current.setAttrs(canvasData[i].elementData);
                    break;
                
                //Who is editing update
                case 6:
                    store.dispatch({ type: "UPDATE_VIEWING_LIST", payload: canvasData[i].elementData });
                    store.dispatch({ type: "RELOAD_VIEWING_LIST" });
                    break;
                
                //Update project information
                case 7:
                    store.dispatch({ type: "PROJECT_LOAD_SUCCESS", payload: canvasData[i].elementData });
                    break;
                
                default:
                    console.log("Invalid change type: " + canvasData[i].changeType);
                    break;
                
                
            }

        } catch (e) {
            console.log("Error reading canvas instruction: " + JSON.stringify(canvasData[i]) + "\n\n" + e);
        }
    }

    store.dispatch({ type: "RERENDER" });

    stageRef.current.draw();
};

const savePage = (dispatch) => {

    var changes = store.getState().canvas.changes;

    var pageData = [];

    try {
        if (changes.length === 0) {
            pageData.push({ changeType: 0, elementData: JSON.stringify({ height: stageRef.current.getAttrs().height, width: stageRef.current.getAttrs().width }) });

            var pageNumber = store.getState().project.currentPageData.pageNumber === undefined ? store.getState().project.currentProjectData.pageCount : store.getState().project.currentPageData.pageNumber;

            store.dispatch(
                canvasEditPage(store.getState().project.currentProjectData.projectId, pageNumber, pageData)
            )
                .then(() => {
                
                
                })
                .catch(() => {
                
                    console.log("Error initialising page data");
                })
            return;
        }

        for (let i = 0; i < changes.length; i++) {

            if (changes[i].type === 4) {
                
                var order = [];

                for (let j = 0; j < store.getState().canvas.elements.length; j++) {
                    order.push(store.getState().canvas.elements[j].id);
                }

                pageData.push({ changeType: changes[i].type, elementData: order });

            } else {

                if (changes[i].type === 3) {
                    
                    pageData.push({ changeType: changes[i].type, ID: changes[i].id });

                } else {

                    var currentElement = store.getState().canvas.elements.filter(el => el.id === changes[i].id)[0];
            
                    if (currentElement) {

                        var attributesString;
                
                        if (currentElement?.tool === "pen" || currentElement?.tool === "eraser") {

                            var elementCopy = Object.assign({}, currentElement);

                            var points = [];

                            for (let k = 0; k < currentElement.points.length; k++) {
                        
                                points.push(Math.round(currentElement.points[k] * 100) / 100);
                            }
                    
                            elementCopy.points = points;

                            attributesString = JSON.stringify(elementCopy);

                        }
                        else {

                            var elementData;

                            if (changes[i].object) {
                                elementData = changes[i].object;
                        
                            } else {
                                elementData = stageRef.current.findOne(n => { return n.id() === changes[i].id }).getAttrs();
                            }

                            if (elementData[0]) {

                                attributesString = "";

                                var j = 0;

                                while (elementData[j]) {
                                    attributesString += elementData[j];
                                    j++;
                                }
                            }
                            else {
                                attributesString = JSON.stringify(elementData);
                            }
                        }
                
                        pageData.push({ changeType: changes[i].type, ID: changes[i].id, elementData: attributesString });
                    }
                }
            }
        }

        store.dispatch(
            canvasEditPage(store.getState().project.currentProjectData.projectId, store.getState().project.currentPageData.pageNumber, pageData)
        )
        .then(() => {
            
            
        })
        .catch(() => {
            
            console.log("Error saving page");
        })
          
    }
    catch (e) {
        console.log("Error converting canvas to JSON: " + e);
    }
};

const startCanvasConnection = (dispatch) => {
    try {
        store.dispatch(initCanvasConnection(store.getState().project.currentProjectData.projectId, store.getState().project.currentPageData.pageNumber));
    } catch (e) {
        console.log("Error starting canvas connection: " + e);
    }
};

const updateEditingStatus = (dispatch) => {
    try {
        store.dispatch(stillHere(store.getState().project.currentProjectData.projectId, store.getState().project.currentPageData.pageNumber));
    } catch (e) {
        console.log("Error updating editing status: " + e);
    }
};

const publishProject = (dispatch) => {

    store.dispatch(
        requestProjectExport(store.getState().project.currentProjectData.projectId)
    )
    .then(() => {
    
        console.log("Project published successfully");
        
        window.location.href = "";
    })
    .catch(() => { 
        console.log("Error publishing project");
    });
};

const addPermissions = (roleName, userId) => {

    store.dispatch(
        changePermissions(store.getState().project.currentProjectData.projectId, roleName, userId, true)
    )
    .then(() => {

        console.log("Permissions added");
    })
    .catch(() => {

        console.log("Error adding permissions");
    });
};

const removePermissions = (roleName, userId) => {

    store.dispatch(
        changePermissions(store.getState().project.currentProjectData.projectId, roleName, userId, false)
    )
    .then(() => {

        console.log("Permissions removed");
    })
    .catch(() => {

        console.log("Error removing permissions");
    });
};

export const canvasFunctions = {
    projectPageLoaded,
    loadUser,
    createProject,
    loadProjectData,
    editProjectData,
    addPage,
    deletePage,
    loadPage,
    loadCanvasUpdate,
    savePage,
    startCanvasConnection,
    updateEditingStatus,
    publishProject,
    addPermissions,
    removePermissions
};