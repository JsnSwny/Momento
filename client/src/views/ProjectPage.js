import React, { useState, useRef } from "react";
import Canvas from "../components/project/Canvas";
import ProjectLeftSidebar from "../components/project/ProjectLeftSidebar";
import ProjectRightSidebar from "../components/project/ProjectRightSidebar";
import CanvasTop from "../components/project/CanvasTop";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProjectPage = () => {
  const [selectedAction, setSelectedAction] = useState("select");
  const stageRef = useRef();
  const loggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!loggedIn) {
    return <Navigate to="/login" />
  }

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
