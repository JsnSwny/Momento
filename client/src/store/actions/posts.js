import { LIKE_POST, UNLIKE_POST, ADD_COMMENT } from "./types";

export const likePost = (item) => (dispatch, getState) => {
  dispatch({
    type: LIKE_POST,
    id: item.id,
  });
};

export const unlikePost = (item) => (dispatch, getState) =>
  dispatch({
    type: UNLIKE_POST,
    id: item.id,
  });

export const addComment = (comment, postId) => (dispatch, getState) => {
  dispatch({
    type: ADD_COMMENT,
    payload: comment,
    postId,
  });
};
