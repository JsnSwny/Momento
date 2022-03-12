import { LIKE_POST, UNLIKE_POST, ADD_COMMENT, POSTS_LOADED } from "../actions/types";

const initialState = {
  posts: [],
  likedPosts: [],
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LIKE_POST:
      return {
        ...state,
        posts: state.posts.map((item) =>
          item.id === action.id ? { ...item, likes: item.likes + 1 } : item
        ),
        likedPosts: [...state.likedPosts, action.id],
      };
    case UNLIKE_POST:
      return {
        ...state,
        posts: state.posts.map((item) =>
          item.id === action.id ? { ...item, likes: item.likes - 1 } : item
        ),
        likedPosts: state.likedPosts.filter((item) => item != action.id),
      };
    case ADD_COMMENT:
      return {
        ...state,
        posts: state.posts.map((item) =>
          item.id === action.postId
            ? { ...item, comments: [...item.comments, action.payload] }
            : item
        ),
      };
    case POSTS_LOADED:
      return {
        ...state,
        posts: payload.posts
      };
    default:
      return state;
  }
};
