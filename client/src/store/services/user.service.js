import api from "./api.axios";

export const userService = {
    loadUserData,
    followUser
};

function loadUserData(userId, username) { 
    let requestOptions = (username === -1 ? { userId } : { userId, username });

    return api.post(`/user/${userId}`, 
        requestOptions
    );
};

function followUser(id) {
    return api.post(`/followUser`, {
        id
    });
};