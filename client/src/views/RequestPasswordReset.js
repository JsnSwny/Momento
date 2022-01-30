import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { requestPwdChange } from "../store/actions/auth";
import { CLEAR_MESSAGE } from "../store/actions/types";

const RequestPasswordReset = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: CLEAR_MESSAGE
    })
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const message = useSelector((state) => state.message.message)
  const requestSuccessful = useSelector((state) => state.auth.pwdReqSuccessful)

  const onSubmit = (e) => {
      dispatch(requestPwdChange(e.email))
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
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              {!requestSuccessful && (
                <div>
                  <div className="email">
                    <i className="fas fa-envelope"></i>
                    <input 
                      type="text" 
                      placeholder="Email" 
                      className={message === "An account with this email address already exists!" ? "name-invalid" : "name"} 
                      {...register("email", {required: "Email is required", pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, message: "Please enter a valid email"}})} />
                    {errors.email && <p>{errors.email.message}</p>}
                  </div>
                  {message && (
                    <div className="alert-input">
                      {message}
                    </div>
                  )}
                  <div className="loginRegister-button">
                    <button type="submit">Request password reset link</button>
                  </div>
                </div>
              )}
              
              {requestSuccessful && (
                <div>
                  <div className="alert-success">
                    <p>Instructions have been sent to the email address provided. Check that email and follow the instructions to reset your password.</p>
                  </div>
                  <Link to="/login">Proceed to login</Link>
                </div>
              )}
            </form>
            <div>
              <br/><Link to="/login">Go back to the login page</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPasswordReset;