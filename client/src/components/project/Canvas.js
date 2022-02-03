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

const Canvas = ({ selectedAction, setSelectedAction, stageRef }) => {
  const dispatch = useDispatch();
  const elements = useSelector((state) => state.canvas.elements);
  const selectedElement = useSelector((state) => state.canvas.selectedElement);
  const [rectangles, setRectangles] = useState([]);

  const [textElements, setTextElements] = useState([]);

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
      fontStyle: "normal",
      fontFamily: "Arial, sans-serif",
      fill: "#000000",
      width: 200,
      elType: "Text",
      strokeWidth: 0,
      strokeScaleEnabled: false,
      rotation: 0,
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

    //Load information about a user (this is required to get a list of the project ids which are needed to load a project)
    const loadUser = (userId) => {
        store.dispatch(
            loadUserData(userId, JSON.parse(localStorage.getItem("user")).accessToken)
          )
          .then(() => {
              
              //If the user has no projects, create a new one
              if (store.getState().user.currentUserData.projectList.length === 0) {
                  
                  createProject("New Project", "Project Description");
              }
              else { 
                  loadProjectData(store.getState().user.currentUserData.projectList[0]);
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

            //Add a new page to the project
            addPage(store.getState().project.currentProjectData.projectId, 1);

            store.getState().user.userData.projectList.push(store.getState().project.currentProjectData.projectId);
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

            store.getState().project.currentProjectData.projectId = projectId;

            if (store.getState().project.currentProjectData.pageCount > 0) {
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
            
            store.getState().project.currentProjectData.pageCount++;

              loadPage(projectId, store.getState().project.currentProjectData.pageCount);
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
    const savePage = (projectId, pageNumber) => { 
        
        try {
            
            var pageData = [JSON.stringify({ height: stageRef.current.getAttrs().height, width: stageRef.current.getAttrs().width }), []];

            var children = stageRef.current.getChildren()[0].getChildren();

            console.log("Children: " + children.length);

            for (let i = 0; i < children.length; i++) {

                pageData[1].push(children[i].toJSON());

                if (children[i].getClassName() === "Image") {
                    
                    //Save image
                }
            }

            dispatch(
                canvasEditPage(projectId, pageNumber, JSON.stringify(pageData), JSON.parse(localStorage.getItem("user")).accessToken)
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
    
    const autoSave = () => { 
        //Currently this just runs every time, but in future it should only run if a change has been made
        if (canvasHasBeenChanged || true) {

            if (store.getState().project.currentProjectData.projectId !== -1 && store.getState().project.currentPageData.pageNumber !== -1) {
            
                savePage(store.getState().project.currentProjectData.projectId, store.getState().project.currentPageData.pageNumber);
            }

            canvasHasBeenChanged = false;
        }
    };
    
    //I dont know if this is the best way to do this, but it works for now
    window.onpageshow = function () {
        
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
