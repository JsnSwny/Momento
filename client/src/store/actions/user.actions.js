import { userService } from "../services/user.service";

export const userActions = {
    login
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => {
                    console.log("login successful");
                },
                error => {
                    console.log("login failed");
                }
            )
    }

    function request(user) { return { type: 'USERS_LOGIN_REQUEST', user } }

}