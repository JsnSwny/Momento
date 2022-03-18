import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, loadUserData } from "../store/actions/user";
import { Link } from "react-router-dom";
import Modal from 'react-modal';
import axios from 'axios';
import { awsService } from '../store/services/aws.service';
import { deleteProfilePic, updateProfilePic } from "../store/actions/aws";

const UserPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = window.location.pathname.split('/')[2]
    let id = JSON.parse(localStorage.getItem("user")).id;
    dispatch(
      loadUserData(id, user)
    )
  });

  const operationSuccess = useSelector((state) => state.user.operationSuccess);
  const username = useSelector((state) => {
    if(operationSuccess){
      return state.user.userData.username;
    } return null;
  });

  const id = useSelector((state) => {
    if (operationSuccess) {
      return state.user.userData.id;
    } return null;
  })

  const ownProfile = username === JSON.parse(localStorage.getItem("user")).username;

  const name = useSelector((state) => {
    if (operationSuccess && ownProfile) {
      return state.user.userData.firstName + " " + state.user.userData.lastName;
    } return null;
  })

  const profilePicture = useSelector((state) => {
    if (operationSuccess) {
      return state.user.userData.profilePicture;
    }
  })

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

  const inputFile = useRef(null);

  const onUploadClick = () => {
    inputFile.current.click();
  }

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
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png" || fileType === "gif") {
      let presignedUrl = await awsService.getSignedUrl(fileType);
      handleSubmission(presignedUrl, event.target.files[0]);
    } else {
      window.alert("Unsupported file type!");
    }
	};

  const handleSubmission = async (presignedUrl, file) => {
    await axios.put(
      presignedUrl,
      file
    )
    .then(async (response) => {
      let photoUrl = presignedUrl.split("?")[0]
      await dispatch(updateProfilePic(photoUrl));
      window.location.reload();
    })
			.catch((error) => {
				console.error('Error:', error);
			});
  }

  const deleteCurrentProfilePic = async () => {
    await dispatch(deleteProfilePic());
    window.location.reload();
  }

  const following = useSelector((state) => state.auth.user.following.includes(id));

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
        <input type="file" name="file" ref={inputFile} accept=".jpg,.jpeg,.png,.gif" onChange={changeHandler} hidden />
        <div>
          <button className="modalButtonBlue" onClick={onUploadClick}>Upload picture</button>
          <button className="modalButtonRed" onClick={() => deleteCurrentProfilePic()}>Delete current picture</button>
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
                    <img className="profilePic" src={profilePicture === null ? "https://www.w3schools.com/howto/img_avatar2.png" : profilePicture} />
                  </button>
                </div>
              )}
              {!ownProfile && (
                <div>
                  <img className="profilePic" src={profilePicture === null ? "https://www.w3schools.com/howto/img_avatar2.png" : profilePicture} />
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
                {!ownProfile && !following && (
                  <div className="followBtnDiv">
                    <button className="followButton" onClick={() => dispatch(followUser(id))}>Follow</button>
                  </div>
                )}
                {!ownProfile && following && (
                  <div className="followBtnDiv">
                    <button className="unfollowButton" onClick={() => dispatch(followUser(id))}>Unfollow</button>
                </div>
                )}
              </div>
              <ul className="userStats">
               94 followers    29 following
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