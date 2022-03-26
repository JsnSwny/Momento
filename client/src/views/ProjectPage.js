import React, { useState, useRef, useEffect } from "react";
import Canvas from "../components/project/Canvas";
import ProjectLeftSidebar from "../components/project/ProjectLeftSidebar";
import ProjectRightSidebar from "../components/project/ProjectRightSidebar";
import CanvasTop from "../components/project/CanvasTop";
import { useParams } from "react-router-dom";
import { loadProject } from "../store/actions/project";
import { useDispatch } from "react-redux";
import axios from 'axios';
import { awsService } from '../store/services/aws.service';
import Konva from 'konva'

const ProjectPage = () => {
  const dispatch = useDispatch();
  const [selectedAction, setSelectedAction] = useState("select");
  const stageRef = useRef();

  const { id } = useParams();

  useEffect(() => {
    dispatch(loadProject(id));
  }, []);

  const inputFile = useRef(null);

  const changeHandler = async (event) => {
    // check if less than max size
    let maxFileSize = 5 * 1024 * 1024;
    if (event.target.files[0].size > maxFileSize) {
      window.alert("File too big!");
      return;
    }
    // Split the filename to get the file type
    let fileName = event.target.files[0].name
    let fileType = fileName.split(".")[1];
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png") {
      let presignedUrl = await awsService.getSignedUrl(fileType);
      handleSubmission(presignedUrl, event.target.files[0]);
    } else {
      window.alert("Unsupported file type!");
    }
	};

  const handleSubmission = async (presignedUrl, file) => {
    await axios.put(presignedUrl, file)
    .then(async (response) => {
      let imageUrl = presignedUrl.split("?")[0]
      // use imageUrl for Konva Image object
      addImage(imageUrl);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  const addImage = (imageUrl) => {
    var imageObj = new Image();
    imageObj.onload = function() {
      let res = {
        width: this.width,
        height: this.height,
        scale: 1
      }
      if (res.width > 600 || res.height > 600) {
        // get scale factor
        res.scale = (res.width > res.height
          ? 600 / res.width
          : 600 / res.height
        );
      }
      let obj = {
        x: 50,
        y:50,
        width: res.width * res.scale,
        height: res.height * res.scale,
        elType: "Image",
        rotation: 0,
        imgObj: imageObj,
        text: "image"
      }
      dispatch({ type: "ADD_ELEMENT", payload: obj });
    }
    imageObj.src = imageUrl;
  }

  return (
    <div className="flex-container--between">
      <ProjectLeftSidebar />
      <div className="canvas-container">
        <CanvasTop
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
          stageRef={stageRef}
          inputFile={inputFile}
        />
        <input type="file" name="image" ref={inputFile} accept=".jpg,.jpeg,.png" onChange={changeHandler} hidden />
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
