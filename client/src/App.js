import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./dist/css/main.css";
// import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";
import ProjectPage from "./views/ProjectPage";
import LoginPage from "./views/LoginPage";
import RegistrationPage from "./views/RegistrationPage";
import VerificationPage from "./views/VerificationPage";
import FeedPage from "./views/FeedPage";
import PasswordChange from "./views/PasswordChange";
import RequestPasswordReset from "./views/RequestPasswordReset";
import UserPage from "./views/UserPage";
import { useSelector } from "react-redux";
import Navbar from './components/Navbar';

const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const auth = useSelector((state) => state.auth.isLoggedIn);
  const username = useSelector((state) => state.auth?.user?.username);

  return (
    <>
      <Router>
        {auth && (
          <Navbar username={username} />
        )}
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/registration" element={<RegistrationPage />}></Route>
          <Route
            path="/api/verify/:token"
            element={<VerificationPage />}
          ></Route>
          <Route
            path="/api/verifyPwdReset/:token"
            element={<PasswordChange />}
          ></Route>
          <Route
            path="/passwordreset"
            element={<RequestPasswordReset />}
          ></Route>
          <Route
            path="/project/:id"
            element={
              <PrivateRoute isAuthenticated={auth}>
                <ProjectPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/"
            element={
              <PrivateRoute isAuthenticated={auth}>
                <FeedPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/"
            element={
              <PrivateRoute isAuthenticated={auth}>
                <FeedPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/user/:username"
            element={
              <PrivateRoute isAuthenticated={auth}>
                <UserPage />
              </PrivateRoute>
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
