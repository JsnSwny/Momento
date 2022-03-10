import {
    AWS_SIGNEDURL_SUCCESS,
    AWS_SIGNEDURL_FAILURE
} from "./types";

const initialState = {
    signedUrl: undefined
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case AWS_SIGNEDURL_SUCCESS:
            return {
                ...state,
                signedUrl: payload
            };
        case AWS_SIGNEDURL_FAILURE:
            return {
                ...state,
                signedUrl: undefined
            }
        default:
            return state;
    }
}