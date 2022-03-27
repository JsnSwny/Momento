import { userService } from "../services/user.service";
import {
    USER_LOAD_SUCCESS,
    USER_FOLLOWED
} from "./types";

export const loadUserData = (userId, username = -1) => (dispatch) => { 

    return userService.loadUserData(userId, username)
    .then(
        (response) => {
            dispatch({
                type: USER_LOAD_SUCCESS,
                payload: { userData: response },
            });
            
            return Promise.resolve();
        }
    );
};

export const followUser = (id) => (dispatch) => {

    return userService.followUser(id)
    .then(
        (response) => {
            dispatch({
                type: USER_FOLLOWED,
                payload: response
            });

            return Promise.resolve();
        }
    );
};