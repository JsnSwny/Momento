import React, { useState, useEffect, useRef } from "react";
import CanvasActions from "./canvas/CanvasActions";
import CanvasCurrentlyViewing from "./canvas/CanvasCurrentlyViewing";
import CanvasPublish from "./canvas/CanvasPublish";
import { canvasFunctions } from "./CanvasFunctions";
import { useSelector, useDispatch } from "react-redux";
import { clearElements } from "../../store/reducers/canvas";
import Modal from 'react-modal';
import project from "../../store/reducers/project";
import { PROJECT_EDIT_SUCCESS } from "../../store/actions/types";
import { updateTitleDesc } from "../../store/actions/project";

const CanvasTop = ({ selectedAction, setSelectedAction, stageRef, inputFile }) => {
  const dispatch = useDispatch();
  const elements = useSelector((state) => state.canvas.elements);

  const projectData = useSelector((state) => state.project.currentProjectData);

  const [isModalOpen, setModalOpen] = useState(false);
  const modalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const modalInputStyle = {
    width: '100%',
    height: '1.5rem',
    fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
    fontSize: '0.9rem',
    justifyContent: 'center',
    textAlign: 'center'
  };

  const modalTextAreaStyle = {
    width: '35rem', 
    height: '15rem', 
    resize: 'none', 
    fontSize: '1rem', 
    padding: '0.4rem 0.4rem 0.4rem 0.4rem',
    marginBottom: '1rem',
  }

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  Modal.setAppElement('#root');

  const onSubmit = (e) => {
    e.preventDefault();
    // update title and description of project locally
    dispatch(updateTitleDesc(projectData.projectId, e.target[0].value, e.target[1].value))
    .then(() => canvasFunctions.publishProject());
    window.location.href = `/`;
  }

  return (
    <div className="canvas-top flex-container--between">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalStyle}
        contentLabel="Publish project"
      >
        <h2 style={{ textAlign: 'center' }}>Publish your project</h2>
        <button 
          onClick={closeModal}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            position: 'absolute',
            top: '7%',
            left: '95%',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >X</button>
        <form style={{ paddingLeft: '1rem', paddingRight: '2rem', display: 'grid' }} onSubmit={onSubmit}>
          <label style={{ textAlign: 'center', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Title</label>
          <input style={modalInputStyle} type='text' defaultValue={projectData.title} />
          <label style={{ textAlign: 'center', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Description</label>
          <textarea style={modalTextAreaStyle} type='text' defaultValue={projectData.description} />
          <button className="btn" type='submit'>Publish</button>
        </form>
      </Modal>
      <CanvasActions
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
        inputFile={inputFile}
      />
      <div className="flex-container--align-center canvas-top__right">
        <CanvasCurrentlyViewing />
        {elements.length > 0 && (
          <i
            class="fas fa-minus-square"
            onClick={() => dispatch(clearElements())}
          ></i>
        )}
        <button 
          className="btn" 
          onClick={() => openModal()}>
            Publish
        </button>
      </div>
    </div>
  );
};

export default CanvasTop;
