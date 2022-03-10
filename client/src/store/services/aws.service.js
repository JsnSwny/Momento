import api from "./api.axios";

export const awsService = {
    getSignedUrl,
    updateProfilePic
};

function getSignedUrl(fileType) {
    return api.post("/getSignedUrl", {
        fileType
    })
}

function updateProfilePic(url) {
    return api.post("/updateProfilePic", {
        url
    })
}