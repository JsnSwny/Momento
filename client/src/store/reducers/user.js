import {
    USER_LOAD_SUCCESS,
    USER_LOAD_FAILURE,
} from "../actions/types";

const initialState = {
    operationSuccess: false,
  };

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case USER_LOAD_SUCCESS:
            return {
                ...state,
                operationSuccess: true,
                userData: payload.userData,
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