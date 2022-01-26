import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/actions/auth";

const LoginPage = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  }
  

  return (
    <div className="main">
      <div className="sub-main">
        <div>
          <div className="imgs">
            <div className="container-image">
              {/* <img src={profile} alt="profile" className="profile"/> */}
            </div>
          </div>

          <div>
            <div className="title">
            <h1>Momento Login</h1>
    
            </div>
            <form onSubmit={onSubmit}>
            <div>
              {/* <img src={email} alt = "email" className="email"/> */}
              <input type="text" placeholder="user name" className="name" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>

            <div className="second-input">
              {/* <img src={pass} alt = "pass" className="email"/> */}
              <input type="password" placeholder="password" className="name" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <div className="login-button">
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