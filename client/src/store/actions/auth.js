import { authService } from "../services/auth.service";
import {
    LOGIN_SUCCESS,
    LOGOUT,
    REGISTER_SUCCESS,
    SET_MESSAGE,
    PWD_REQUEST_SUCCESS,
    REFRESH_TOKEN
} from "./types";

export const registerAuth = (username, firstName, lastName, email, password) => (dispatch) => {
    return authService.register(username, firstName, lastName, email, password)
        .then(
            (response) => {
                dispatch({
                    type: REGISTER_SUCCESS,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: response.message,
                });

                return Promise.resolve();
            }
        )
}

export const verifyUser = (token) => (dispatch) => {
    return authService.verifyUser(token)
        .then(
            (response) => {
                dispatch({
                    type: SET_MESSAGE,
                    payload: response.message,
                });
            }
        )
}

export const requestPwdChange = (email) => (dispatch) => {
    return authService.requestPwdChange(email)
    .then(
        (response) => {
            dispatch({
                type: PWD_REQUEST_SUCCESS,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: response.message,
            });
        }
    )
}

export const verifyPwdReset = (token) => (dispatch) => {
    return authService.verifyPwdReset(token)
    .then(
        (response) => {
            dispatch({
                type: SET_MESSAGE,
                payload: response.message,
            });
        }
    )
}

export const changePassword = (token, password) => (dispatch) => {
    return authService.changePassword(token, password)
        .then(
            (response) => {
                dispatch({
                    type: SET_MESSAGE,
                    payload: response.message,
                });
            }
        )
}

export const login = (username, password) => (dispatch) => {
    return authService.login(username, password)
        .then(
            (response) => {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: { username: response },
                });

                return Promise.resolve();
            }
        )
}

export const logout = () => (dispatch) => {
    authService.logout();

    dispatch({
        type: LOGOUT,
    });
};

export const refreshToken = (accessToken) => (dispatch) => {
    dispatch({
        type: REFRESH_TOKEN,
        payload: accessToken
    })
}