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
      console.log(imageUrl);
      addImage(imageUrl);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  const addImage = (imageUrl) => {
    var imageObj = new Image();
    imageObj.onload = function() {
      var image = new Konva.Image({
        x: 50,
        y:50,
        image: imageObj,
        width: 400,
        height: 200,
        src: imageUrl
      });
    }
    imageObj.src = imageUrl;
    let obj = {
      x: 50,
      y:50,
      width: 400,
      height: 200,
      elType: "Image",
      rotation: 0,
      imgObj: imageObj,
      text: "image"
    }
    dispatch({ type: "ADD_ELEMENT", payload: obj });
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
        <input type="file" name="image" ref={inputFile} accept=".jpg,.jpeg,.png" onChange={changeHandler} hidden />
        <Canvas
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
          stageRef={stageRef}
          inputFile={inputFile}
        />
      </div>
      <ProjectRightSidebar selectedAction={selectedAction} />
    </div>
  );
};

export default ProjectPage;
