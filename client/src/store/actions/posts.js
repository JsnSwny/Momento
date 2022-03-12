import { postsService } from "../services/posts.service";
import { 
  LIKE_POST,
  UNLIKE_POST,
  ADD_COMMENT,
  POSTS_LOADED
} from "./types";

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
  return postsService.addComment(postId, comment)
  .then(
    (response) => {
      dispatch({
        type: ADD_COMMENT,
        payload: comment,
        postId,
      });

      return Promise.resolve();
    }
  )
};

export const getPosts = () => (dispatch) => {
  return postsService.getPosts()
  .then(
    (response) => {
      dispatch({
        type: POSTS_LOADED,
        payload: response
      });

      return Promise.resolve();
    }
  )
}
