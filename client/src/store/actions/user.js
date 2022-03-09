import { userService } from "../services/user.service";
import {
    SET_MESSAGE,
    USER_LOAD_SUCCESS,
    USER_LOAD_FAILURE,

} from "./types";

export const loadUserData = (userId, username = -1) => (dispatch) => { 

    return userService.loadUserData(userId, username, JSON.parse(localStorage.getItem("user")).accessToken)
    .then(
        (response) => {
            console.log("User data loaded");
            dispatch({
                type: USER_LOAD_SUCCESS,
                payload: { userData: response },
            });
            
            return Promise.resolve();
        },
        (error) => {
            console.log("Error loading user data: " + error);
            dispatch({
                type: USER_LOAD_FAILURE,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: error,
            });

            return Promise.reject();
        }
    )
};