import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/actions/auth";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CLEAR_MESSAGE } from "../store/actions/types";

const LoginPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: CLEAR_MESSAGE
    })
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  };
  
  const loggedIn = useSelector((state) => state.auth.isLoggedIn);
  const message = useSelector((state) => state.message.message);

    if (loggedIn) {
      
        //This way the onload function runs in the canvas script
        return window.location.href = "/project";
    //return <Navigate to="/project" />
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
              <h1>Momento Login</h1>
            </div>
            <form onSubmit={onSubmit}>

            <div className="email">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Username" className={message === "User does not exist" ? "name-invalid" : "name"} value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>

            {message === "User does not exist" && (
              <div>
                <div className="alert-input" role={alert}>
                  {message}
                </div>
              </div>
            )}

            <div className="password">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" className={message === "Invalid Password!" ? "name-invalid" : "name"} value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>

            {message !== "User does not exist" && (
              <div>
                <div className="alert-input" role={alert}>
                  {message}
                </div>
              </div>
            )}

            <div className="loginRegister-button">
              <button type="submit">Login</button>
            </div>
          </form>
          
          <ul></ul>
          <p className="link">
            <Link to="/passwordreset">Forgot password ?</Link> Or <li><Link to="/registration">Sign up</Link></li>
          </p>
          <ul></ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
