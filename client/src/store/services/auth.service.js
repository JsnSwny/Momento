import api from "./api.axios";
import { tokenService } from "./token.service";

export const authService = {
    login,
    register,
    verifyUser,
    verifyPwdReset,
    changePassword,
    requestPwdChange,
    logout
};

function register(username, firstName, lastName, emailAddress, passwordHash) {
    return api.post("/auth/register", {
        username,
        firstName,
        lastName,
        emailAddress,
        passwordHash
    });
}

function verifyUser(token) {
    return api.get(`/verify/${token}`);
}

function requestPwdChange(emailAddress) {
    return api.post("/auth/passwordreset", {
        emailAddress
    })
}

function verifyPwdReset(token) {
    return api.get(`/verifyPwdReset/${token}`);
}

function changePassword(token, password) {
    return api.post("/auth/changePassword", {
        token,
        password
    })
}

function login(username, passwordHash) {
    return api.post("/auth/login", {
        username,
        passwordHash
    })
    .then(user => {
        if (user.data.accessToken) {
            tokenService.setUser(user.data);
        }
        return user.data;
    });
}

function logout() {
    tokenService.removeUser();
}