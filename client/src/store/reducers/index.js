import { combineReducers } from "redux";
import { LOGIN_SUCCESS } from "../actions/types";

function LoginReducer(state, action) {
  switch (action.type) {
    case "LOGOUT_SUCCESS":
      state = undefined;
    
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true
      }
    default:
      return {isAuthenticated: false};
  }
}

const rootReducer = combineReducers({
  login: LoginReducer
});

export default rootReducer;