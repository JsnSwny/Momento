import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Circle, Line } from "react-konva";
import Rectangle from "./canvas/elements/Rectangle";
import TextElement from "./canvas/elements/TextElement";

const Canvas = ({ selectedAction }) => {
  const initialRectangles = [
    {
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      fill: "red",
      id: "rect1",
    },
    {
      x: 150,
      y: 150,
      width: 268,
      height: 100,
      fill: "green",
      id: "rect2",
    },
  ];

  const initialText = [
    {
      text: "This is a test example of a sentence in the canvas.",
      x: 100,
      y: 200,
      fill: "black",
      id: 1,
    },
  ];

  const [rectangles, setRectangles] = useState(initialRectangles);

  const [textElements, setTextElements] = useState(initialText);
  const [selectedId, selectShape] = useState(null);
  const stageRef = useRef();
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [textOptions, setTextOptions] = useState({
    isDragging: false,
    x: 50,
    y: 50,
  });

  const insertText = (x, y) => {
    setTextElements([
      ...textElements,
      {
        text: "This is a test example of a sentence in the canvas.",
        x,
        y,
        fill: "black",
        id: textElements.at(-1).id + 1,
      },
    ]);
  };

  const handleClick = (e) => {
    console.log(e);
    switch (selectedAction) {
      case "text":
        insertText(100, 100);
    }
  };

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
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
    <div className="konva-container">
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onClick={handleClick}
        ref={stageRef}
      >
        <Layer>
          {textElements.map((item, i) => {
            return (
              <TextElement
                key={i}
                shapeProps={item}
                isSelected={item.id === selectedId}
                onSelect={() => {
                  selectShape(item.id);
                }}
                onChange={(newAttrs) => {
                  const texts = textElements.slice();
                  texts[i] = newAttrs;
                  setTextElements(texts);
                }}
                stageRef={stageRef}
              />
            );
          })}
        </Layer>

        {rectangles.map((rect, i) => (
          <Layer>
            <Rectangle
              key={i}
              shapeProps={rect}
              isSelected={rect.id === selectedId}
              onSelect={() => {
                selectShape(rect.id);
              }}
              onChange={(newAttrs) => {
                const rects = rectangles.slice();
                rects[i] = newAttrs;
                setRectangles(rects);
              }}
            />
          </Layer>
        ))}
      </Stage>
    </div>
  );
};

export default Canvas;
