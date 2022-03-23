import api from "./api.axios";

export const postsService = {
    getPosts,
    addComment,
    likePost,
    unlikePost
};

function getPosts(username) {
    return api.post(`/getPosts`, {
        username
    });
};

function addComment(postId, text) {
    return api.post(`addComment`, {
        postId,
        text
    });
};

function likePost(postId) {
    return api.post(`likePost`, {
        postId
    })
};

function unlikePost(postId) {
    return api.post(`unlikePost`, {
        postId
    })
};