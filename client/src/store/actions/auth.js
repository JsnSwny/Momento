import { authService } from "../services/auth.service";
import {
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    SET_MESSAGE,
} from "./types";

export const register = (username, firstName, lastName, email, password) => (dispatch) => {
    return authService.register(username, firstName, lastName, email, password)
        .then(
            (response) => {
                dispatch({
                    type: REGISTER_SUCCESS,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: response.data.message,
                });

                return Promise.resolve();
            },
            (error) => {
                dispatch({
                    type: REGISTER_FAILURE,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: error.data.message,
                });

                return Promise.reject();
            }
        )
}

export const login = (username, password) => (dispatch) => {
    return authService.login(username, password)
        .then(
            (response) => {
                console.log("login successful");
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: { username: response },
                });

                return Promise.resolve();
            },
            (error) => {
                console.log("login failure");
                dispatch({
                    type: LOGIN_FAILURE,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: error.data.message,
                });

                return Promise.reject();
            }
        )
}

export const logout = () => (dispatch) => {
    authService.logout();

    dispatch({
        type: LOGOUT,
    });
};