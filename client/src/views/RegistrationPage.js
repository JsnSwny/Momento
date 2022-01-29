// import profile from "./image/a.svg";
// import email from "./image/email.svg";
// import pass from "./image/pass.svg";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { register } from "../store/actions/auth"

const RegistrationPage = () => {

  const dispatch = useDispatch();
  
  const [successful, setSuccessful] = useState("");

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const verifyPassword = () => {
    if (password !== null || confirmPassword !== null) {
      if (password !== confirmPassword) {
        console.log("Passwords don't match");
      } else {
        console.log("Passwords ok");
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setSuccessful(false);

    dispatch(
      register(username, firstName, lastName, emailAddress, password)
    )
    .then(() => {
      setSuccessful(true);
    })
    .catch(() => {
      setSuccessful(false);
    })
  };

  const loggedIn = useSelector(state => state.auth.isLoggedIn);
  const successfulRegister = useSelector(state => state.auth.successful);

  if (loggedIn){
    return <Navigate to="/project" />
  }

  if (successfulRegister){
    return <Navigate to="/login" />
  }

  return (
    <div className="LoginRegistration">
      <div className="sub-main">
        <div>
          <div className="imgs">
            <div className="container-image">
            <i className="far fa-user"></i>
            </div>
          </div>

          <div>
            <div className="title">
            <h1>Momento Registration</h1>
            </div>
            <form onSubmit={onSubmit}>
            <div className="Username">
            <i className="fas fa-user"></i>
              <input type="text" placeholder="Username" className="name" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>

            <div className="FirstName">
            <i className="fas fa-user"></i>
              <input type="text" placeholder="First Name" className="name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
            </div>

            <div className="LastName">
            <i className="fas fa-user"></i>
              <input type="text" placeholder="Last Name" className="name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
            </div>

            <div className="email">
            <i className="fas fa-envelope"></i>
              <input type="text" placeholder="Email" className="name" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)}/>
            </div>
          
            <div className="password">
            <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" className="name" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={verifyPassword}/>
            </div>

            <div className="confirmPassword">
            <i className="fas fa-lock"></i>
              <input type="password" placeholder="Confirm Password" className="name" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={verifyPassword}/>
            </div>

            <div className="loginRegister-button">
            <button>Register</button>
          </div></form>

          
        </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;