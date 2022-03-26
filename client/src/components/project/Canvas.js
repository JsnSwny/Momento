import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector, Provider } from "react-redux";
import { loadUserData } from "../../store/actions/user";
import {
  newProject,
  loadProject,
  editProject,
} from "../../store/actions/project";
import {
  canvasAddPage,
  canvasDeletePage,
  canvasLoadPage,
  canvasEditPage,
} from "../../store/actions/canvas";
import { canvasFunctions } from "../project/CanvasFunctions";
import { Stage, Layer, Rect, Circle, Line, Image } from "react-konva";
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

  const drawingOptions = useSelector((state) => state.canvas.drawingOptions);

  const [currentLine, setCurrentLine] = useState("");

  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  var canvasHasBeenChanged = false;

  const [tool, setTool] = useState("pen");
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    if (selectedAction == "draw" || selectedAction == "eraser") {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setCurrentLine({
        tool: selectedAction == "draw" ? "pen" : "eraser",
        points: [pos.x, pos.y],
        colour: drawingOptions.colour,
        thickness: drawingOptions.thickness,
        elType: "Line",
        text: "Line",
      });
    }
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const currentPoints = currentLine.points;
    currentPoints.concat([point.x, point.y]);
    setCurrentLine({
      ...currentLine,
      points: [...currentLine.points, point.x, point.y],
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;

    if (currentLine) {
      dispatch({ type: "ADD_ELEMENT", payload: currentLine });
      setCurrentLine("");
    }
  };

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
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Provider store={store}>
          <Layer>
            {elements.map((item, i) => {
              switch (item.elType) {
                case "Text":
                  return (
                    <TextElement
                      key={i}
                      shapeProps={item}
                      isSelected={
                        selectedElement && item.id === selectedElement.id
                      }
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
                case "Line":
                  return (
                    <Line
                      key={i}
                      points={item.points}
                      stroke={item.colour}
                      strokeWidth={item.thickness}
                      tension={0.5}
                      lineCap="round"
                      globalCompositeOperation={
                        item.tool === "eraser"
                          ? "destination-out"
                          : "source-over"
                      }
                    />
                  );
                case "Image":
                  return (
                    <Image
                      key={i}
                      width={item.width}
                      height={item.height}
                      image={item.imgObj}
                      isSelected={
                        selectedElement && item.id === selectedElement.id
                      }
                      onSelect={() => {
                        selectedAction == "select" &&
                          dispatch(setSelectedElement(item.id));
                      }}
                      stageRef={stageRef}
                      setSelectedId={setSelectedElement}
                      setSelectedAction={setSelectedAction}
                    />
                  )
                default:
                  return false;
              }
            })}

            {isDrawing && (
              <Line
                key={0}
                points={currentLine.points}
                stroke={currentLine.colour}
                strokeWidth={currentLine.thickness}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation={
                  currentLine.tool === "eraser"
                    ? "destination-out"
                    : "source-over"
                }
              />
            )}
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
