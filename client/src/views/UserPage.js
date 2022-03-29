import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, loadUserData } from "../store/actions/user";
import { Link } from "react-router-dom";
import Modal from 'react-modal';
import axios from 'axios';
import { awsService } from '../store/services/aws.service';
import { deleteProfilePic, updateProfilePic } from "../store/actions/aws";
import { getUserPosts } from '../store/actions/posts';
import Post from "../components/feed/Post";

const UserPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = window.location.pathname.split('/')[2]
    let id = JSON.parse(localStorage.getItem("user")).id;
    dispatch(loadUserData(id, user));
    dispatch(getUserPosts(user));
  }, []);

  const userData = useSelector((state) => state.user.userData);
  const operationSuccess = useSelector((state) => state.user.operationSuccess);
  const ownProfile = userData.username === JSON.parse(localStorage.getItem("user")).username;
  const following = useSelector((state) => state.auth.user.following.includes(userData.id));
  const posts = useSelector((state) => state.posts.posts);


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
    .then((response) => {
      let photoUrl = presignedUrl.split("?")[0]
      dispatch(updateProfilePic(photoUrl));
      window.location.reload();
    })
			.catch((error) => {
				console.error('Error:', error);
			});
  }

  const deleteCurrentProfilePic = () => {
    dispatch(deleteProfilePic());
    window.location.reload();
  }

  const [currentMode, setCurrentMode] = useState('posts');

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
                    <img className="profilePic" src={userData.profilePicture === null ? "https://www.w3schools.com/howto/img_avatar2.png" : userData.profilePicture} />
                  </button>
                </div>
              )}
              {!ownProfile && (
                <div>
                  <img className="profilePic" src={userData.profilePicture === null ? "https://www.w3schools.com/howto/img_avatar2.png" : userData.profilePicture} />
                </div>
              )}
            </div>
            <section className="UserInfo">
              <div className="headerTop">
                <div className="username">
                  <h1>{userData.username}</h1>
                </div>
                {ownProfile && (
                  <div className="editProfile">
                    <h2>Edit profile</h2>
                  </div>
                )}
                {!ownProfile && !following && (
                  <div className="followBtnDiv">
                    <button className="followButton" onClick={() => dispatch(followUser(userData.id))}>Follow</button>
                  </div>
                )}
                {!ownProfile && following && (
                  <div className="followBtnDiv">
                    <button className="unfollowButton" onClick={() => dispatch(followUser(userData.id))}>Unfollow</button>
                </div>
                )}
              </div>
              <ul className="userStats">
               94 followers    29 following
              </ul>
              <div className="userName-Bio">
                <h2 className="name">{userData.firstName + " " + userData.lastName}</h2>
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
    {ownProfile && (
      <div className="category">
        <button 
          className="profileLink"
          id={currentMode === 'posts' ? 'active' : ''}
          onClick={() => setCurrentMode('posts')}
        >Posts</button>
        <button 
          className="profileLink" 
          id={currentMode === 'projects' ? 'active' : ''} 
          onClick={() => setCurrentMode('projects')}
        >Projects</button>
      </div>
    )}
    {currentMode === 'posts' && (
      <div className="wrapper--md">
        <div className="feed">
          <ul>
            {posts.map((post) => (
              <Post post={post} />
            ))}
          </ul>
        </div>
      </div>
    )}
    {currentMode === 'projects' && (
      <>
        <ul style={{marginTop: '4rem'}}>
          {userData.projectList.map((project) => (
            <li style={{marginTop: '2rem', marginBottom: '2rem'}}><a 
              href={`/project/${project.projectId}`}
              className='projectLink'
            >{project.title}</a></li>
          ))}
        </ul>
      </>
    )}
  </div>
  );
};

export default UserPage;