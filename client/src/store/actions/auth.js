import { authService } from "../services/auth.service";
import {
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    SET_MESSAGE,
    PWD_REQUEST_SUCCESS
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
                    payload: error,
                });

                return Promise.reject();
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
            },
            (error) => {
                dispatch({
                    type: SET_MESSAGE,
                    payload:error.message,
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
        },
        (error) => {
            dispatch({
                type: SET_MESSAGE,
                payload:error,
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
        },
        (error) => {
            dispatch({
                type: SET_MESSAGE,
                payload:error,
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
            },
            (error) => {
                dispatch({
                    type: SET_MESSAGE,
                    payload:error.message,
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
            },
            (error) => {
                dispatch({
                    type: LOGIN_FAILURE,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: error,
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