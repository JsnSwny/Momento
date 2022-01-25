
import {
    LOGIN_SUCCESS
} from "./types";

export const login = (username, password) => (dispatch) => {
    console.log("login")
    dispatch({
        type: LOGIN_SUCCESS,
        payload: {id: 1, username, password}
    })
}
