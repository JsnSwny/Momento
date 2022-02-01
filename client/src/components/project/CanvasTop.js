import React, { useState } from "react";
import CanvasActions from "./canvas/CanvasActions";
import CanvasCurrentlyViewing from "./canvas/CanvasCurrentlyViewing";
import CanvasPublish from "./canvas/CanvasPublish";

const CanvasTop = ({ selectedAction, setSelectedAction, stageRef }) => {
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
