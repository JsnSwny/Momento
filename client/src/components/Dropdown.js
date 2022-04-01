import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import './Dropdown.css';
import Modal from 'react-modal';
import { canvasFunctions } from "../components/project/CanvasFunctions";

function Dropdown() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  // create project modal
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
      setIsOpen(true);
  };
  const closeModal = () => {
      setIsOpen(false);
  };

  const modalStyles = {
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
    textAlign: 'center',
    marginTop: '0.5rem',
    marginBottom: '1rem'
  };

  const modalTextAreaStyle = {
    width: '35rem', 
    height: '15rem', 
    resize: 'none', 
    fontSize: '1rem', 
    padding: '0.4rem 0.4rem 0.4rem 0.4rem',
    marginBottom: '1rem',
  };

  Modal.setAppElement('#root');

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();   
    dispatch(canvasFunctions.createProject(e.target[0].value, "", true));
  }

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Create project"
      >
      <div className="modalTitle">
        <h3>Create a new project</h3>
      </div>
      <button 
        onClick={closeModal}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          position: 'absolute',
          top: '7%',
          left: '90%',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >X</button>
      <form style={{ paddingLeft: '1rem', paddingRight: '2rem', display: 'grid' }} onSubmit={onSubmit}>
          <label style={{ textAlign: 'center', fontWeight: '600', marginBottom: '1rem', marginTop: '1rem' }}>Title</label>
          <input style={modalInputStyle} type='text' />
          <label style={{ textAlign: 'center', fontWeight: '600', marginBottom: '1rem', marginTop: '1rem' }}>Description</label>
          <textarea style={modalTextAreaStyle} type='text' />
        <button className="btn" type='submit'>Start creating</button>
      </form>
    </Modal>
      <ul
        onClick={handleClick}
        className={click ? 'dropdown-menu clicked' : 'dropdown-menu'}
      >
          <li>
            <p className='dropdown-link'>Create new page</p>
          </li>
          <li>
            <p className='dropdown-link' onClick={openModal}>Create new project</p>
          </li>
      </ul>
    </>
  );
}

export default Dropdown;
