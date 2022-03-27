import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faCommentAlt,
  faImage,
  faMousePointer,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";

const CanvasActions = ({ selectedAction, setSelectedAction, inputFile }) => {
  return (
    <div className="canvas-actions">
      <FontAwesomeIcon
        onClick={() => setSelectedAction("select")}
        className={`canvas-actions__icon ${
          selectedAction == "select" ? "active" : ""
        }`}
        icon={faMousePointer}
      />
      <FontAwesomeIcon
        onClick={() => setSelectedAction("draw")}
        className={`canvas-actions__icon ${
          selectedAction == "draw" ? "active" : ""
        }`}
        icon={faPencilAlt}
      />
      <FontAwesomeIcon
        onClick={() => setSelectedAction("eraser")}
        className={`canvas-actions__icon ${
          selectedAction == "eraser" ? "active" : ""
        }`}
        icon={faEraser}
      />
      <FontAwesomeIcon
        onClick={() => setSelectedAction("text")}
        className={`canvas-actions__icon ${
          selectedAction == "text" ? "active" : ""
        }`}
        icon={faCommentAlt}
      />
      {/* <input type="file" onChange={(e) => console.log(e.target.value)} /> */}
      <FontAwesomeIcon
        onClick={() => {
          setSelectedAction("image");
          inputFile.current.click();
        }}
        className={`canvas-actions__icon ${
          selectedAction == "image" ? "active" : ""
        }`}
        icon={faImage}
      />
    </div>
  );
};

export default CanvasActions;
