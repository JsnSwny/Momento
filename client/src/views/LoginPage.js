import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/actions/auth";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  }
  
  const auth = useSelector(state => state.login.isAuthenticated);

  if (auth){
    return <Navigate to="/project" />
  }

  return (
    <div className="LoginRegistration">
      <div className="sub-main">
        <div>
          <div className="imgs">
            <div className="container-image">
            <i class="far fa-user"></i>
            </div>
          </div>

          <div>
            <div className="title">
            <h1>Momento Login</h1>
    
            </div>
            <form onSubmit={onSubmit}>
            <div className="email">
            <i class="fas fa-user"></i>
              <input type="text" placeholder="user name" className="name" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>

            <div className="password">
            <i class="fas fa-lock"></i>
              <input type="password" placeholder="password" className="name" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <div className="loginRegister-button">
            <button type="submit">Login</button>
          </div></form>
          
            <p className="link">
              <a href="#">Forgot password ?</a> Or <a href="#">Sign up</a>
            </p>
          
        </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;