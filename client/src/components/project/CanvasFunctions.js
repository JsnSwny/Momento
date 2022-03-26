import Konva from "konva";
import store from "../../store/store";
import { loadUserData } from "../../store/actions/user";
import { newProject, loadProject, editProject, initCanvasConnection, stillHere } from "../../store/actions/project";
import { canvasAddPage, canvasDeletePage, canvasLoadPage, canvasEditPage } from "../../store/actions/canvas";

var stageRef;

//Load information about a user (this is required to get a list of the project ids which are needed to load a project)
const loadUser = (stage) => (dispatch) => {

    stageRef = stage;

    dispatch(
        loadUserData(JSON.parse(localStorage.getItem("user")).id)
      )
      .then(() => {
        
          //If the user has no projects, create a new one
          if (store.getState().user.currentUserData.projectList.length === 0) {
              
              dispatch(createProject("New Project", "Project Description"));
          }
          else { 

              dispatch(loadProjectData(store.getState().user.currentUserData.projectList[0].projectId));
          }
          
      })
      .catch(() => {
        
        console.log("Error loading user data");
      })
};

//Creates a new project
const createProject = (title, description) => (dispatch) => { 
        
    dispatch(
        newProject(title, description)
    )
    .then(() => {

        //Add a new page to the project
        dispatch(addPage(1, "Page 1", "Description"));

        store.getState().user.userData.projectList.push(store.getState().project.currentProjectData.projectId);
    })
    .catch(() => {
        
        console.log("Error creeating project");
    })

};

//Returns information about the project (Title, Description, Page count)
const loadProjectData = (projectId) => (dispatch) => { 
    
    dispatch(
        loadProject(projectId)
      )
      .then(() => {

        store.getState().project.currentProjectData.projectId = projectId;

        if (store.getState().project.currentProjectData.pageCount > 0) {
            dispatch(loadPage(1));
        } else {
            createProject("Project Name", "Description");
        }

          
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

//Add a new page to the project
const addPage = (pageNumber, title, description) => (dispatch) => {
    
    dispatch(
        
        canvasAddPage(store.getState().project.currentProjectData.projectId, pageNumber, title, description)
      )
      .then(() => {
          
          dispatch(loadPage(store.getState().project.currentProjectData.pageCount));

            dispatch(savePage());
      })
      .catch(() => {
        
        console.log("Error adding new page");
      })
};

//delete a page from the project
const deletePage = (pageNumber) => (dispatch) => { 
    dispatch(
        canvasDeletePage(store.getState().project.currentProjectData.projectId, pageNumber)
      )
      .then(() => {
          
        
      })
      .catch(() => {
        
        console.log("Error deleting page");
      })
};

var configureNode = (currentNode, loadNodes) => {

    if (currentNode.getType() === "Shape") {

      if (currentNode.getAttrs()?.name === undefined) {
          
          if (loadNodes) {
              store.dispatch({ type: "LOAD_ELEMENT", payload: { id: currentNode.id(), attributes: currentNode.getAttrs() } });
          } else {
            store.dispatch({ type: "LOAD_ADD_ELEMENT", payload: { id: currentNode.id(), attributes: currentNode.getAttrs() } });
          }
      }

        if (currentNode.getClassName() === "Image") {
      
            //Load image
        }
  
    } else {

        for (let i = 0; i < currentNode.children.length; i++) {


            configureNode(currentNode.children[i], loadNodes);
        }
    }
};

//Load a page from the project
const loadPage = (pageNumber) => (dispatch) => { 

    dispatch(
        canvasLoadPage(store.getState().project.currentProjectData.projectId, pageNumber)
      )
      .then(() => {
          
        var nodesToRemove = stageRef.current.getChildren()[0].getChildren();

        for (let i = 0; i < nodesToRemove.length; i++){
            nodesToRemove[i].destroy();
        }
          
        dispatch({ type: "CLEAR_ELEMENTS"});
          
          if (store.getState().project.currentPageData.pageData != null && store.getState().project.currentPageData.pageData !== "") {
          
                try {

                  var data = JSON.parse(store.getState().project.currentPageData.pageData);
              
                  stageRef.current.setAttrs(JSON.parse(data[0]));

                  

                  for (let i = 0; i < data[1].length; i++) {

                      var newNode = Konva.Node.create((data[1][i].data));

                      newNode.id(data[1][i].ID);

                      configureNode(newNode, true);
                    }
                    
                    stageRef.current.draw();

                } catch (e) {

                  console.log("Failed to load page from JSON: " + e + "\n" + store.getState().project.currentPageData.pageData);
              }
          }
          
      })
      .catch(() => {
        
        console.log("Error loading page");
      })
};

const loadCanvasUpdate = (stringData, dispatch) => {

    var canvasData = JSON.parse(stringData.data);

    try{
        for (let i = 0; i < canvasData.length; i++) {
            switch (canvasData[i].changeType) {
                case 0:
                    stageRef.current.setAttrs(canvasData[i].elementData);
                    break;
            
                case 1:
                    
                    var newNode = Konva.Node.create(canvasData[i].elementData);

                    newNode.id(canvasData[i].ID);

                    configureNode(newNode, false);

                    break;
            
                case 2:
                    var changedElement = stageRef.current.findOne(n => { return n.id() === canvasData[i].ID });
                
                    changedElement.setAttrs(canvasData[i].elementData);

                    store.dispatch({ type: "LOAD_UPDATE_ELEMENT", payload: { id: canvasData[i].ID, attributes: canvasData[i].elementData } });

                    changedElement.show();

                    break;
            
                case 3:

                    stageRef.current.findOne(n => { return n.id() === canvasData[i].ID }).destroy();
                
                    store.dispatch({ type: "LOAD_DELETE_ELEMENT", payload: { id: canvasData[i].ID, attributes: canvasData[i].elementData } });

                    break;
            
                default:
                    console.log("Invalid change type: " + canvasData[i].changeType);
                    break;
            }
        }

        stageRef.current.draw();

    } catch (e) {

        console.log("Error parsing canvas changes: " + e);  
    }
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

        for (let i = 0; i < changes.length; i++){
                var elementData = stageRef.current.findOne(n => { return n.id() === changes[i].id});

            var attributes = elementData.getAttrs();
            
            var attributesString;

            if (attributes[0]) {

                attributesString = "";

                var j = 0;

                while (attributes[j]) {
                    attributesString+= attributes[j]
                    j++;
                }

                console.log(attributesString);
            }
            else {
                attributesString = elementData.toJSON();
            }
            
            pageData.push({ changeType: changes[i].type, ID: changes[i].id, elementData: attributesString });
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
    store.dispatch(initCanvasConnection(store.getState().project.currentProjectData.projectId, store.getState().project.currentPageData.pageNumber));
};

const updateEditingStatus = (dispatch) => {
    store.dispatch(stillHere(store.getState().project.currentProjectData.projectId, store.getState().project.currentPageData.pageNumber));
};

export const canvasFunctions = {
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
    updateEditingStatus
};