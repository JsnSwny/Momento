import { combineReducers } from "redux";
import canvas from "./canvas";

const appReducer = combineReducers({
  canvas,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default (state, action) => rootReducer(state, action);
