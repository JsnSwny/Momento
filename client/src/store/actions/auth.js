import { userService } from "../services/user.service";
import {
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    USERS_LOGIN_REQUEST
} from "./types";

export const login = (username, password) => (dispatch) => {
    dispatch({ 
        type: USERS_LOGIN_REQUEST,
        username 
    });

    userService.login(username, password)
        .then(
            response => {
                console.log("login successful");
                dispatch({
                    type: LOGIN_SUCCESS,
                    username,
                    response
                })
            },
            error => {
                console.log("login failed");
                dispatch({
                    type: LOGIN_FAILED,
                    username,
                    error
                })
            }
        )
}
