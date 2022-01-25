import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/actions/auth";
import propTypes from 'prop-types';

async function loginUser(credentials) {
  return fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json())
}

export default function LoginPage ({setToken}) {
  const [username, setUsername] = useState();
  const [passwordHash, setPassword] = useState();

  const onSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username,
      passwordHash
    });
    setToken(token);
  }

  /*
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  }
  */

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
              <input type="password" placeholder="password" className="name" value={passwordHash} onChange={(e) => setPassword(e.target.value)}/>
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

LoginPage.propTypes = {
  setToken: propTypes.func.isRequired
}