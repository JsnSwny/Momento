import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import "./dist/css/main.css";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return <Provider store={store}></Provider>;
};

export default App;
