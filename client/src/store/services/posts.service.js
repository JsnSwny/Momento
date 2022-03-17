import api from "./api.axios";

export const postsService = {
    getPosts,
    addComment,
    likePost,
    unlikePost
};

function getPosts() {
    return api.post(`/getPosts`);
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