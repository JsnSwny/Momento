import React, { useState } from "react";
import CanvasActions from "./canvas/CanvasActions";
import CanvasCurrentlyViewing from "./canvas/CanvasCurrentlyViewing";
import CanvasPublish from "./canvas/CanvasPublish";

const CanvasTop = ({ selectedAction, setSelectedAction }) => {
  return (
    <div className="canvas-top flex-container--between">
      <CanvasActions
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
      />
      <div className="flex-container--align-center canvas-top__right">
        <CanvasCurrentlyViewing />
        <CanvasPublish />
      </div>
    </div>
  );
};

export default CanvasTop;
