import React, { useState, useEffect, useRef } from "react";
import CanvasActions from "./canvas/CanvasActions";
import CanvasCurrentlyViewing from "./canvas/CanvasCurrentlyViewing";
import CanvasPublish from "./canvas/CanvasPublish";
import { useSelector, useDispatch } from "react-redux";
import { canvasEditPage } from "../../store/actions/canvas";
import { canvasFunctions } from "../project/CanvasFunctions";


const CanvasTop = ({ selectedAction, setSelectedAction, stageRef }) => {

    const dispatch = useDispatch();

  return (
    <div className="canvas-top flex-container--between">
      <CanvasActions
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
      />
      <div className="flex-container--align-center canvas-top__right">
        <CanvasCurrentlyViewing />
        <i
          class="fas fa-save"
          onClick={() => dispatch(canvasFunctions.savePage())}
        ></i>
        <CanvasPublish />
      </div>
    </div>
  );
};

export default CanvasTop;
