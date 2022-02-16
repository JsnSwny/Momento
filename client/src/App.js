import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import store from "./store/store";
import "./dist/css/main.css";
import "react-toastify/dist/ReactToastify.css";
import ProjectPage from "./views/ProjectPage";
import LoginPage from "./views/LoginPage";
import RegistrationPage from "./views/RegistrationPage";
import VerificationPage from "./views/VerificationPage";
import PasswordChange from "./views/PasswordChange";
import RequestPasswordReset from "./views/RequestPasswordReset";
import UserPage from "./views/UserPage";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/project" element={<ProjectPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/registration" element={<RegistrationPage />}></Route>
          <Route path="/api/verify/:token" element={<VerificationPage />}></Route>
          <Route path="/api/verifyPwdReset/:token" element={<PasswordChange />}></Route>
          <Route path="/passwordreset" element={<RequestPasswordReset />}></Route>
          <Route path="/user/:username" element={<UserPage />}></Route>
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
