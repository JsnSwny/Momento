import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector, Provider } from "react-redux";
import { canvasFunctions } from "../project/CanvasFunctions";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";
import Konva from "konva";
import Rectangle from "./canvas/elements/Rectangle";
import TextElement from "./canvas/elements/TextElement";
import store from "../../store/store";
import { setSelectedElement } from "../../store/reducers/canvas";
const socketio = require("socket.io-client");

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

    const autoSaveInterval = 500;
    const editingStatusUpdateInterval = 25000;
    var intervalCounter = editingStatusUpdateInterval;
    var canvasConnection = false;
    
    const autoSave = () => { 
        try {
            if (store.getState().canvas.changes.length > 0) {
            
                if (store.getState().project.currentProjectData.projectId !== -1 && store.getState().project.currentPageData.pageNumber !== -1) {

                    canvasFunctions.savePage();
                
                    store.getState().canvas.changes = [];
                }
            }
        }
        catch (e) { 
            console.log("Error saving page: " + e);
        }

        if (intervalCounter >= editingStatusUpdateInterval) {

            if (canvasConnection) {
                try {
                    canvasFunctions.updateEditingStatus();
                }
                catch (e) { 
                    console.log("Error updating canvas editing status: " + e);
                }
            }

            intervalCounter -= editingStatusUpdateInterval;
        }

        intervalCounter += autoSaveInterval;

        if (!canvasConnection && store.getState().user.currentUserData.userId !== -1) { 

            canvasFunctions.startCanvasConnection();

            canvasConnection = true;
        }
    };
    
    window.onpageshow = function () {
        
        dispatch(canvasFunctions.loadUser(stageRef));
        
        store.getState().canvas.changes = [];

        setInterval(autoSave, autoSaveInterval);
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
