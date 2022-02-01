import React, { useState, useRef } from "react";
import Canvas from "../components/project/Canvas";
import ProjectLeftSidebar from "../components/project/ProjectLeftSidebar";
import ProjectRightSidebar from "../components/project/ProjectRightSidebar";
import CanvasTop from "../components/project/CanvasTop";

const ProjectPage = () => {
  const [selectedAction, setSelectedAction] = useState("select");
  const stageRef = useRef();
  return (
    <div className="flex-container--between">
      <ProjectLeftSidebar />
      <div className="canvas-container">
        <CanvasTop
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
          stageRef={stageRef}
        />
        <Canvas
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
          stageRef={stageRef}
        />
      </div>
      <ProjectRightSidebar />
    </div>
  );
};

export default ProjectPage;
