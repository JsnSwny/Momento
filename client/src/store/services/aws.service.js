import api from "./api.axios";

export const awsService = {
    getSignedUrl,
    updateProfilePic,
    deleteProfilePic
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

function deleteProfilePic() {
    return api.post("/deleteProfilePic");
}