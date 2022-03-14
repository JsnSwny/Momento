import { combineReducers } from "redux";
import canvas from "./canvas";
import auth from "./auth";
import project from "./project";
import message from "./message";

const appReducer = combineReducers({
  auth,
  message,
  canvas,
  project,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default (state, action) => rootReducer(state, action);
