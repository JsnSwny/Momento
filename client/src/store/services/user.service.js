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
    // modify local storage `following` array to reflect changes
    var userData = JSON.parse(localStorage.getItem('user'));
    var following = userData.following;
    var newArray = following.includes(id)
        ? following.filter((item) => item !== id)
        : [...following, id];
    userData.following = newArray;
    localStorage.setItem('user', JSON.stringify(userData));

    return api.post(`/followUser`, {
        id
    });
};