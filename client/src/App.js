import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import store from "./store/store";
import "./dist/css/main.css";
import "react-toastify/dist/ReactToastify.css";
import ProjectPage from "./views/ProjectPage";
import LoginPage from "./views/LoginPage";

const App = () => {
    
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/project" element={<ProjectPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
