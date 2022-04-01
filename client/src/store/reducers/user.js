import {
    USER_LOAD_SUCCESS
} from "../actions/types";

const initialState = {
    operationSuccess: false,
    currentUserData: {
        userId: -1,
        username: "",
        projectList: []
    },
    userData: {
        id: null,
        username: null,
        firstName: null,
        lastName: null,
        profilePicture: null,
        bio: null,
        following: 0,
        followers: 0
    }
  };

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case USER_LOAD_SUCCESS:
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
        default:
            return state;
    }
}