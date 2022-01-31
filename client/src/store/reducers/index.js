import { combineReducers } from "redux";
import canvas from "./canvas";
import auth from "./auth";
import message from "./message"
import project from "./project"
import user from "./user"

const appReducer = combineReducers({
  auth,
  message,
  canvas,
  project,
  user,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default (state, action) => rootReducer(state, action);
