import {
    AWS_SIGNEDURL_SUCCESS
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
        default:
            return state;
    }
}