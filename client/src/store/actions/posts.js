import { postsService } from "../services/posts.service";
import { 
  LIKE_POST,
  UNLIKE_POST,
  ADD_COMMENT,
  POSTS_LOADED
} from "./types";

export const likePost = (postId) => (dispatch, getState) => {
  return postsService.likePost(postId)
  .then(
    (response) => {
      dispatch({
        type: LIKE_POST,
        id: postId,
      });
    }
  )
};

export const unlikePost = (postId) => (dispatch, getState) => {  
  return postsService.unlikePost(postId)
  .then(
    (response) => {
      dispatch({
        type: UNLIKE_POST,
        id: postId,
      });
    }
  )
};

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
};

export const getUserPosts = (username) => (dispatch) => {
  return postsService.getPosts(username)
  .then(
    (response) => {
      dispatch({
        type: POSTS_LOADED,
        payload: response
      });

      return Promise.resolve();
    }
  )
};
