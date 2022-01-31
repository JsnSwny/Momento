import { combineReducers } from "redux";
import canvas from "./canvas";
import auth from "./auth";
import message from "./message"

const appReducer = combineReducers({
  auth,
  message,
  canvas,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default (state, action) => rootReducer(state, action);
