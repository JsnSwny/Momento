import { authService } from "../services/auth.service";

export const userActions = {
    login
};

function login(username, password) {
    return dispatch => {
        authService.login(username, password)
            .then(
                user => {
                    console.log("login successful");
                },
                error => {
                    console.log("login failed");
                }
            )
    }
}