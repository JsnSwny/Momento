import api from "./api.axios";

export const postsService = {
    getPosts
};

function getPosts() {
    return api.post(`/getPosts`);
}