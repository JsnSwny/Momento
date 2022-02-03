import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CanvasActions from "./canvas/CanvasActions";
import CanvasCurrentlyViewing from "./canvas/CanvasCurrentlyViewing";
import CanvasPublish from "./canvas/CanvasPublish";
import { clearElements } from "../../store/reducers/canvas";

const CanvasTop = ({ selectedAction, setSelectedAction, stageRef }) => {
  const dispatch = useDispatch();
  const elements = useSelector((state) => state.canvas.elements);
  return (
    <div className="canvas-top flex-container--between">
      <CanvasActions
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
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
          onClick={() => {
            const stage = stageRef.current;

            // Run call to store stage
            console.log(stage.toJSON());
          }}
        ></i>
        <CanvasPublish />
      </div>
    </div>
  );
};

export default CanvasTop;
