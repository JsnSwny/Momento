import api from "./api.axios";

export const userService = {
    loadUserData,
    followUser,
    editProfile
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
    
    return api.post(`/followUser`, {
        id
    })
    .then(
        localStorage.setItem('user', JSON.stringify(userData))
    );
};

function editProfile(firstName, lastName, bio) {
    return api.post(`/editProfile`, {
        firstName,
        lastName,
        bio
    });
}