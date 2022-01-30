import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyPwdReset } from "../store/actions/auth"
import { useForm } from "react-hook-form";
import { changePassword } from "../store/actions/auth";

const PasswordChange = () => {
  const dispatch = useDispatch();
  
  const token = window.location.pathname.split('/')[3]

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const password = useRef({});
  password.current = watch("password", "");

  useEffect(() => {
    dispatch(verifyPwdReset(token))
  }, [token]);

  const message = useSelector(state => state.message.message)

  const onSubmit = (e) => {
    console.log(token, e.password)
    dispatch(changePassword(token, e.password))
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
          <div className="title">
            <h1>Momento Password Reset</h1>
          </div>
          {message === "Password reset link verified" && (
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
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
                  <button type="submit">Change password</button>
                </div>
              </form>
            </div>
          )}
          {message === "invalid token" || message === "jwt expired" && (
            <div>
              <h2>Your password reset link appears to be invalid or has expired.</h2>
            </div>
          )}
          {message === "Password successfully changed" && (
            <div>
              <div className="alert-success">
                <p>Password successfully changed!</p>
              </div>
              <Link to="/login">Proceed to login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;