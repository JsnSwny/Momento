import {
    USER_LOAD_SUCCESS,
    USER_LOAD_FAILURE,
} from "../actions/types";

const initialState = {
    operationSuccess: false,
    currentUserData: {
        userId: -1,
        username: "",
        projectList: []
    },
  };

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case USER_LOAD_SUCCESS:

            console.log(payload.userData);
            return {
                ...state,
                operationSuccess: true,
                userData: payload.userData,
                currentUserData: {
                    userId: payload.userData.userId,
                    username: payload.userData.username,
                    projectList: payload.userData.projectList
                }
        };
    
        case USER_LOAD_FAILURE:
            return {
                ...state,
                operationSuccess: false,
        };
        
        default:
            return state;
    }
}