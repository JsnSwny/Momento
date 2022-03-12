import api from "./api.axios";

export const postsService = {
    getPosts,
    addComment
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