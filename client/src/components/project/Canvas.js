import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector, Provider } from "react-redux";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";
import Rectangle from "./canvas/elements/Rectangle";
import TextElement from "./canvas/elements/TextElement";
import store from "../../store/store";
import { setSelectedElement } from "../../store/reducers/canvas";

const Canvas = ({ selectedAction, setSelectedAction, stageRef }) => {
  const dispatch = useDispatch();
  const elements = useSelector((state) => state.canvas.elements);
  const selectedElement = useSelector((state) => state.canvas.selectedElement);

  const drawingOptions = useSelector((state) => state.canvas.drawingOptions);

  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    if (selectedAction == "draw" || selectedAction == "eraser") {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines([
        ...lines,
        {
          tool: selectedAction == "draw" ? "pen" : "eraser",
          points: [pos.x, pos.y],
          colour: drawingOptions.colour,
          thickness: drawingOptions.thickness,
        },
      ]);
    }
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
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
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.colour}
                strokeWidth={line.thickness}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
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
