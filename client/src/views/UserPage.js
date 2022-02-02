import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserData } from "../store/actions/user";
import { Link } from "react-router-dom";
import Modal from 'react-modal';

const UserPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = window.location.pathname.split('/')[2]
    let id = JSON.parse(localStorage.getItem("user")).id;
    let accessToken = JSON.parse(localStorage.getItem("user")).accessToken;
    dispatch(
      loadUserData(id, accessToken, user)
    )
  });

  const operationSuccess = useSelector((state) => state.user.operationSuccess);
  const username = useSelector((state) => {
    if(operationSuccess){
      return state.user.userData.username;
    } return null;
  });

  const ownProfile = username === JSON.parse(localStorage.getItem("user")).username;

  const name = useSelector((state) => {
    if (operationSuccess && ownProfile) {
      return state.user.userData.firstName + " " + state.user.userData.lastName;
    } return null;
  })

  const postCount = useSelector((state) => {
    if (operationSuccess) {
      return state.user.userData.posts.length;
    } return null;
  })

  const changeProfilePic = () => {
    console.log(username);
  }

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

  Modal.setAppElement('#root');

  
	const [selectedFile, setSelectedFile] = useState();
	const [isSelected, setIsSelected] = useState(false);
  const inputFile = useRef(null);

  const onUploadClick = () => {
    inputFile.current.click();
  }

  const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsSelected(true);
	};

  const [presignedUrl, setPresignedUrl] = useState();

  return (
    <div className="User" id="user">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Change Profile Picture"
      >
        <div className="modalTitle">
          <h3>Change Profile Picture</h3>
        </div>
        <input type="file" name="file" ref={inputFile} onChange={changeHandler} hidden />
        <div>
          <button className="modalButtonBlue" onClick={onUploadClick}>Upload picture</button>
          <button className="modalButtonRed">Delete current picture</button>
          <button className="modalButton" onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
      <div className="Profile">
        {operationSuccess && (
          <header className="header">
            <div className="ProfilePicture">
              {ownProfile && (
                <div>
                  <button onClick={openModal} className="profPicBtn" title="Change Profile Picture">
                    <img className="profilePic" src="https://www.w3schools.com/howto/img_avatar2.png" />
                  </button>
                </div>
              )}
              {!ownProfile && (
                <div>
                  <img className="profilePic" src="https://www.w3schools.com/howto/img_avatar2.png" />
                </div>
              )}
            </div>
            <section className="UserInfo">
              <div className="headerTop">
                <div className="username">
                  <h1>{username}</h1>
                </div>
                {ownProfile && (
                  <div className="editProfile">
                    <h2>Edit profile</h2>
                  </div>
                )}
                {!ownProfile && (
                  <div className="followBtnDiv">
                    <button className="followButton">Follow</button>
                  </div>
                )}
              </div>
              <ul className="userStats">
              {postCount} posts    94 followers    29 following
              </ul>
              <div className="userName-Bio">
                <h2 className="name">{name}</h2>
                <br/>
                <span className="userBio">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </span>
              </div>
            </section>
          </header>
        )}
        {!operationSuccess && (
          <div>
            <h1>Sorry, this page isn't available.</h1>
            <h3>The link you followed may be broken, or the page may have been removed. Go back to <Link to="/">Momento</Link>.</h3>
          </div>
        )}
      </div>
    <div className="category">
      <Link className="profileLink" to={`/user/${username}`}>Posts</Link>
      <Link className="profileLink" to={`/user/${username}/projects`}>Projects</Link>
    </div>
  </div>
  );
};

export default UserPage;