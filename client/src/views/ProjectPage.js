import React, { useState, useRef, useEffect } from "react";
import Canvas from "../components/project/Canvas";
import ProjectLeftSidebar from "../components/project/ProjectLeftSidebar";
import ProjectRightSidebar from "../components/project/ProjectRightSidebar";
import CanvasTop from "../components/project/CanvasTop";
import { useParams } from "react-router-dom";
import { loadProject } from "../store/actions/project";
import { useDispatch } from "react-redux";

const ProjectPage = () => {
  const dispatch = useDispatch();
  const [selectedAction, setSelectedAction] = useState("select");
  const stageRef = useRef();

  const { id } = useParams();

  useEffect(() => {
    dispatch(loadProject(id));
  }, []);

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
      <ProjectRightSidebar selectedAction={selectedAction} />
    </div>
  );
};

export default ProjectPage;
