import { combineReducers } from "redux";
import canvas from "./canvas";
import auth from "./auth";
import message from "./message";
import posts from "./posts";

const appReducer = combineReducers({
  auth,
  message,
  canvas,
  posts,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default (state, action) => rootReducer(state, action);
