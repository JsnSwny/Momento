import React from "react";
import { canvasFunctions } from "../CanvasFunctions";

const CanvasPublish = () => {
  return <button className="btn" onClick={() => canvasFunctions.publishProject()}>Publish</button>;
};

export default CanvasPublish;
