import Konva from "konva";
import store from "../../store/store";
import { loadUserData } from "../../store/actions/user";
import { newProject, loadProject, editProject } from "../../store/actions/project";
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

              dispatch(loadProjectData(store.getState().user.currentUserData.projectList[0]));
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
        dispatch(addPage(1));

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
            dispatch(addPage(1));
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
const addPage = (pageNumber) => (dispatch) => {
    
    console.log(pageNumber);

    dispatch(
        canvasAddPage(store.getState().project.currentProjectData.projectId, pageNumber)
      )
      .then(() => {
        
          dispatch(loadPage(store.getState().project.currentProjectData.pageCount));
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

//Load a page from the project
const loadPage = (pageNumber) => (dispatch) => { 
    dispatch(
        canvasLoadPage(store.getState().project.currentProjectData.projectId, pageNumber)
      )
      .then(() => {
          
        var nodesToRemove = stageRef.current.getChildren()[0].getChildren();
                    
        console.log("NODES: " + nodesToRemove.length);

        for (let i = 0; i < nodesToRemove.length; i++){
            nodesToRemove[i].destroy();
        }
          
        dispatch({ type: "CLEAR_ELEMENTS"});
          
          if (store.getState().project.currentPageData.pageData != null && store.getState().project.currentPageData.pageData !== "") {
          
                try {

                  var data = JSON.parse(store.getState().project.currentPageData.pageData);
              
                  stageRef.current.setAttrs(data[0]);

                  var configureNode = (currentNode) => {

                      if (currentNode.getType() === "Shape") {

                        if (currentNode.getAttrs()?.name === undefined) {
                            
                            dispatch({ type: "ADD_ELEMENT", payload: currentNode.getAttrs() });
                        }

                          if (currentNode.getClassName() === "Image") {
                        
                              //Load image
                          }
                    
                      } else {

                          for (let i = 0; i < currentNode.children.length; i++) {


                              configureNode(currentNode.children[i]);
                          }
                      }
                  };
              
                  for (let i = 0; i < data[1].length; i++) {
                
                      var newNode = Konva.Node.create(data[1][i]);

                      configureNode(newNode);
                    }
                    
                    stageRef.current.draw();

                    dispatch({ type: "SET_SELECTED", payload: null });

              } catch (e) {
                  console.log("Failed to load page from JSON: " + e + "\n" + store.getState().project.currentPageData.pageData);
              }
          }
          
      })
      .catch(() => {
        
        console.log("Error loading page");
      })
};

//save page to the server
const savePage = () => (dispatch) => { 
    
    try {
        
        var pageData = [JSON.stringify({ height: stageRef.current.getAttrs().height, width: stageRef.current.getAttrs().width }), []];

        var children = stageRef.current.getChildren()[0].getChildren();

        for (let i = 0; i < children.length; i++) {

            pageData[1].push(children[i].toJSON());

            if (children[i].getClassName() === "Image") {
                
                //Save image
            }
        }

        dispatch(
            canvasEditPage(store.getState().project.currentProjectData.projectId, store.getState().project.currentPageData.pageNumber, JSON.stringify(pageData))
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

export const canvasFunctions = {
    loadUser,
    createProject,
    loadProjectData,
    editProjectData,
    addPage,
    deletePage,
    loadPage,
    savePage
};