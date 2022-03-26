import React, { useState, useEffect, useRef } from "react";
import CanvasActions from "./canvas/CanvasActions";
import CanvasCurrentlyViewing from "./canvas/CanvasCurrentlyViewing";
import CanvasPublish from "./canvas/CanvasPublish";
import { useSelector, useDispatch } from "react-redux";
import { canvasEditPage } from "../../store/actions/canvas";
import { canvasFunctions } from "../project/CanvasFunctions";
import { clearElements } from "../../store/reducers/canvas";

const CanvasTop = ({ selectedAction, setSelectedAction, stageRef, inputFile }) => {
  const dispatch = useDispatch();
  const elements = useSelector((state) => state.canvas.elements);
  return (
    <div className="canvas-top flex-container--between">
      <CanvasActions
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
        inputFile={inputFile}
      />
      <div className="flex-container--align-center canvas-top__right">
        <CanvasCurrentlyViewing />
        {elements.length > 0 && (
          <i
            class="fas fa-minus-square"
            onClick={() => dispatch(clearElements())}
          ></i>
        )}

        <i
          class="fas fa-save"
          onClick={() => dispatch(canvasFunctions.savePage(stageRef))}
        ></i>
        <CanvasPublish />
      </div>
    </div>
  );
};

export default CanvasTop;
