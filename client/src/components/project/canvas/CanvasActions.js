import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faCommentAlt,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

const CanvasActions = ({ selectedAction, setSelectedAction }) => {
  return (
    <div className="canvas-actions">
      <FontAwesomeIcon
        onClick={() => setSelectedAction("draw")}
        className={`canvas-actions__icon ${
          selectedAction == "draw" ? "active" : ""
        }`}
        icon={faPencilAlt}
      />
      <FontAwesomeIcon
        onClick={() => setSelectedAction("text")}
        className={`canvas-actions__icon ${
          selectedAction == "text" ? "active" : ""
        }`}
        icon={faCommentAlt}
      />
      <FontAwesomeIcon
        onClick={() => setSelectedAction("image")}
        className={`canvas-actions__icon ${
          selectedAction == "image" ? "active" : ""
        }`}
        icon={faImage}
      />
    </div>
  );
};

export default CanvasActions;