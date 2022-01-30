// import profile from "./image/a.svg";
// import email from "./image/email.svg";
// import pass from "./image/pass.svg";

import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { registerAuth } from "../store/actions/auth"
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const RegistrationPage = () => {
  const dispatch = useDispatch();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = (e) => {   
    dispatch(
      registerAuth(e.username, e.firstName, e.lastName, e.email, e.password)
    )
  };

  const loggedIn = useSelector(state => state.auth.isLoggedIn);
  const successfulRegister = useSelector(state => state.auth.successful);
  const message = useSelector(state => state.message.message);

  if (loggedIn){
    return <Navigate to="/project" />
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
            <form onSubmit={handleSubmit(onSubmit)}>
              {!successfulRegister && (
                <div>
                  <div className="Username">
                    <i className="fas fa-user"></i>
                    <input 
                      type="text" 
                      placeholder="Username" 
                      className={message === "Username is already taken!" ? "name-invalid" : "name"} 
                      {...register("username", {required: "Username is required", maxLength: { value: 20, message: "Username cannot be longer than 20 characters" }})} />
                    {errors.username && <p>{errors.username.message}</p>}
                  </div>
                  
                  {message === "Username is already taken!" && (
                    <div className="alert-input">
                      {message}
                    </div>
                  )}

                  <div className="FirstName">
                    <i className="fas fa-user"></i>
                    <input 
                      type="text" 
                      placeholder="First Name" 
                      className="name" 
                      {...register("firstName", {required: "First name is required", maxLength: { value: 20, message: "First name cannot be longer than 20 characters" }})} />
                    {errors.firstName && <p>{errors.firstName.message}</p>}
                  </div>

                  <div className="LastName">
                  <i className="fas fa-user"></i>
                    <input 
                      type="text" 
                      placeholder="Last Name" 
                      className="name" 
                      {...register("lastName", {required: "Last name is required", maxLength: { value: 20, message: "Last name cannot be longer than 20 characters" }})} />
                    {errors.lastName && <p>{errors.lastName.message}</p>}
                  </div>

                  <div className="email">
                  <i className="fas fa-envelope"></i>
                    <input 
                      type="text" 
                      placeholder="Email" 
                      className={message === "An account with this email address already exists!" ? "name-invalid" : "name"} 
                      {...register("email", {required: "Email is required", pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, message: "Please enter a valid email"}})} />
                    {errors.email && <p>{errors.email.message}</p>}
                  </div>
                  
                  {message === "An account with this email address already exists!" && (
                    <div className="alert-input">
                      {message}
                    </div>
                  )}
                
                  <div className="password">
                  <i className="fas fa-lock"></i>
                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="name" 
                      {...register("password", {required: "Password is required", minLength: { value: 8, message: "Password must have at least 8 characters" }})} />
                    {errors.password && <p>{errors.password.message}</p>}
                  </div>

                  <div className="confirmPassword">
                  <i className="fas fa-lock"></i>
                    <input 
                      type="password" 
                      placeholder="Confirm Password" 
                      className="name" 
                      {...register("confirmPassword", {required: "Confirm your password", validate: value => value === password.current || "Passwords do not match" })} />
                    {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
                  </div>

                  <div className="loginRegister-button">
                    <h3>By registering an account with us you agree to our terms & conditions</h3><br/>
                    <button type="submit">Register</button>
                  </div>
                  <div>
                    <br/>Already have an account? <Link to="/login">Proceed to login</Link>
                  </div>
                </div>
              )}

              {successfulRegister && (
                <div>
                  <div className="alert-success">
                    <p>Registration successful!</p>
                  </div>
                  <Link to="/login">Proceed to login</Link>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;