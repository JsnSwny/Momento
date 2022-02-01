import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector, Provider } from "react-redux";
import { loadUserData } from "../../store/actions/user";
import { newProject, loadProject, editProject } from "../../store/actions/project";
import { canvasAddPage, canvasDeletePage, canvasLoadPage, canvasEditPage } from "../../store/actions/canvas";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";
import Konva from "konva";
import Rectangle from "./canvas/elements/Rectangle";
import TextElement from "./canvas/elements/TextElement";
import store from "../../store/store";
import { setSelectedElement } from "../../store/reducers/canvas";

const Canvas = ({ selectedAction, setSelectedAction }) => {
  const dispatch = useDispatch();
  const elements = useSelector((state) => state.canvas.elements);
  const selectedElement = useSelector((state) => state.canvas.selectedElement);
  const [rectangles, setRectangles] = useState([]);

  const [textElements, setTextElements] = useState([]);
  const stageRef = useRef();
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

    var canvasHasBeenChanged = false;
    
  const insertText = (x, y) => {
    let obj = {
      text: "",
      x,
      y,
      fontSize: 24,
      fill: "#000000",
      width: 200,
      elType: "Text",
    };
    dispatch({ type: "ADD_ELEMENT", payload: obj });
  };

  const handleClick = (e) => {
    if (selectedAction == "select" && !e.target.className) {
      dispatch(setSelectedElement(null));
      return;
    }
    switch (selectedAction) {
      case "text":
        insertText(e.evt.offsetX, e.evt.offsetY);
    }
  };

  useEffect(() => {
    const container = document.querySelector(".konva-container");
    const observer = new ResizeObserver(() => {
      setStageSize({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });
    });
    observer.observe(container);
  }, []);

  useEffect(() => {
    const container = document.querySelector(".konva-container");
    setStageSize({
      width: container.offsetWidth,
      height: container.offsetHeight,
    });
  }, []);

    
    var currentProjectData = {
        projectId: -1,
        ownerId: localStorage.getItem("user").id,
        title: "",
        description: "",
        pageCount: 0
    };

    var currentPageData = {
        pageId: -1,
        pageNumber: -1,
        pageData: ""
    };
    
    //Load information about a user (this is required to get a list of the project ids which are needed to load a project)
    //Get this data from store.getState().user.userData, and store.getState().user.userData.projectList for a list of their projects (projectIds only)
    const loadUser = (userId) => {
        store.dispatch(
            loadUserData(userId, JSON.parse(localStorage.getItem("user")).accessToken)
          )
          .then(() => {
              
              //If the user has no projects, create a new one
              if (store.getState().user.userData.projectList.length === 0) {
                  
                  createProject("New Project", "Project Description");
              }
              else { 
                  loadProjectData(store.getState().user.userData.projectList[0]);
              }
              
          })
          .catch(() => {
            
            console.log("Error loading user data");
          })
    };
    
    //Creates a new project
    const createProject = (title, description) => { 
            
        dispatch(
            newProject(title, description, JSON.parse(localStorage.getItem("user")).accessToken)
        )
        .then(() => {
            
            currentProjectData = {
                projectId: store.getState().project.newProjectId,
                ownerId: localStorage.getItem("user").id,
                title: title,
                description: description,
                pageCount: 0
            };

            //Add a new page to the project
            addPage(currentProjectData.projectId, 1);

            store.getState().user.userData.projectList.push(currentProjectData.projectId);
        })
        .catch(() => {
            
            console.log("Error creeating project");
        })

    };

    //Returns information about the project (Title, Description, Page count)
    const loadProjectData = (projectId) => { 
        
        dispatch(
            loadProject(projectId, JSON.parse(localStorage.getItem("user")).accessToken)
          )
          .then(() => {
            
            currentProjectData = {
                  projectId: projectId,
                  ownerId: JSON.parse(localStorage.getItem("user")).id,
                  title: store.getState().project.projectData.title,
                  description: store.getState().project.projectData.description,
                  pageCount: store.getState().project.projectData.pageCount
              };

            
            if (currentProjectData.pageCount > 0) {
                loadPage(projectId, 1);
            } else {
                addPage(projectId, 1);
            }

              
          })
          .catch(() => {
            
            console.log("Error loading project data");
          })

    };
    
    //Edit information about the project (Title, Description, Page count)
    const editProjectData = (projectId, newTitle, newDescription) => { 
        dispatch(
            editProject(projectId, newTitle, newDescription, JSON.parse(localStorage.getItem("user")).accessToken)
          )
          .then(() => {
            
            
          })
          .catch(() => {
            
            console.log("Error editing project data");
          })
    };

    //Add a new page to the project
    const addPage = (projectId, pageNumber) => { 
        dispatch(
            canvasAddPage(projectId, pageNumber, JSON.parse(localStorage.getItem("user")).accessToken)
          )
          .then(() => {
            
              currentProjectData.pageCount++;

              
          })
          .catch(() => {
            
            console.log("Error adding new page");
          })
    };

    //delete a page from the project
    const deletePage = (projectId, pageNumber) => { 
        dispatch(
            canvasDeletePage(projectId, pageNumber, JSON.parse(localStorage.getItem("user")).accessToken)
          )
          .then(() => {
              
            
          })
          .catch(() => {
            
            console.log("Error deleting page");
          })
    };

    //Load a page from the project
    const loadPage = (projectId, pageNumber) => { 
        dispatch(
            canvasLoadPage(projectId, pageNumber, JSON.parse(localStorage.getItem("user")).accessToken)
          )
          .then(() => {
            
            currentPageData = {
                pageId: store.getState().project.pageData.pageId,
                pageNumber: store.getState().project.pageData.pageNumber,
                pageData: store.getState().project.pageData.pageData
            };
              
              //This is a kind of an awkward way to do this, but its the only way I could get it to work properly
              try {
                  
                var loadingDiv = document.createElement('div');
                
                loadingDiv.setAttribute("id", "loadingContainer");
                
                loadingDiv.hidden = true;

                document.body.insertBefore(loadingDiv, document.getElementsByClassName(".konva-container")[0]);

                var loadingStage = Konva.Node.create(currentPageData.pageData, "loadingContainer");

                var layers = loadingStage.getLayers();

                for (let i = 0; i < layers.length; i++){
                    
                    var elements = layers[i].getChildren();

                    for (let j = 0; j < elements.length; j++){
                        
                        console.log(elements[j]);

                        if (elements[j].getType() === "Shape") {
                            
                            dispatch({ type: "ADD_ELEMENT", payload: elements[j].getAttrs() });
                        }
                    }
                  }

                  stageRef.current.add(new Konva.Layer());
                  
              } catch (e) { 
                  console.log("Failed to load page from JSON: " + e);
              }
              
          })
          .catch(() => {
            
            console.log("Error loading page");
          })
    };

    //save page to the server
    const savePage = (projectId, pageNumber) => { 
        
        var pageData = stageRef.current.toJSON();

        dispatch(
            canvasEditPage(projectId, pageNumber, pageData, JSON.parse(localStorage.getItem("user")).accessToken)
          )
          .then(() => {
            
              
          })
          .catch(() => {
            
            console.log("Error saving page");
          })
    };
    
    const autoSave = () => { 
        //Currently this just runs every time, but in future it should only run if a change has been made
        if (canvasHasBeenChanged || true) {

            if (currentProjectData.projectId !== -1 && currentPageData.pageNumber !== -1) {
            
                savePage(currentProjectData.projectId, currentPageData.pageNumber);
            }

            canvasHasBeenChanged = false;
        }
    };
    
    //I dont know if this is the best way to do this, but it works for now
    window.onload = function () {
        
        //localStorage.removeItem("user");

        loadUser(JSON.parse(localStorage.getItem("user")).id);

        setInterval(autoSave, 5000);
    };
    
    

    
  return (
    <div className={`konva-container ${selectedAction}`}>
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onClick={handleClick}
        ref={stageRef}
      >
        <Provider store={store}>
          <Layer>
            {elements.map((item, i) => {
              return (
                <TextElement
                  key={i}
                  shapeProps={item}
                  isSelected={selectedElement && item.id === selectedElement.id}
                  onSelect={() => {
                    selectedAction == "select" &&
                      dispatch(setSelectedElement(item.id));
                  }}
                  onChange={(newAttrs) => {
                    dispatch({
                      type: "UPDATE_ELEMENT",
                      id: item.id,
                      payload: { ...newAttrs, elType: "Text" },
                    });
                  }}
                  stageRef={stageRef}
                  setSelectedId={setSelectedElement}
                  setSelectedAction={setSelectedAction}
                />
              );
            })}
          </Layer>

          {/* {rectangles.map((rect, i) => (
          <Layer>
            <Rectangle
              key={i}
              shapeProps={rect}
              isSelected={rect.id === selectedId}
              onSelect={() => {
                selectedAction == "select" && selectShape(rect.id);
              }}
              onChange={(newAttrs) => {
                const rects = rectangles.slice();
                rects[i] = newAttrs;
                setRectangles(rects);
              }}
            />
          </Layer>
        ))} */}
        </Provider>
      </Stage>
    </div>
  );
};

export default Canvas;
