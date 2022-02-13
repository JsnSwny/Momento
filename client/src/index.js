import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./store/store";
import interceptors from "./store/services/interceptors";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
interceptors(store);