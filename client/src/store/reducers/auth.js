import { 
    REGISTER_SUCCESS,
    LOGIN_SUCCESS,
    LOGOUT,
    PWD_REQUEST_SUCCESS,
    REFRESH_TOKEN,
    USER_FOLLOWED
 } from "../actions/types";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = user
    ? { isLoggedIn: true, user }
    : { isLoggedIn: false, user: null };

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case REGISTER_SUCCESS:
            return {
                ...state,
                isLoggedIn: false,
                successful: true,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                user: payload.user,
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        case PWD_REQUEST_SUCCESS:
            return {
                ...state,
                pwdReqSuccessful: true,
            };
        case REFRESH_TOKEN:
            return {
                ...state,
                user: { ...user, accessToken: payload }
            };
        case USER_FOLLOWED:
            return {
                ...state,
                user: {
                    ...user,
                    following: state.user.following.includes(payload.id)
                        ? state.user.following.filter((item) => item !== payload.id)
                        : [...state.user.following, payload.id]
                }
            }
        default:
            return state;
    }
}

