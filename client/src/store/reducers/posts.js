import { LIKE_POST, UNLIKE_POST, ADD_COMMENT } from "../actions/types";

const initialState = {
  posts: [
    {
      id: 1,
      title: "John's Holiday",
      description: "A collection of photos from John's holiday in Spain",
      imageURL:
        "https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      likes: 12,
      views: 100,
      collaborators: 3,
      comments: [
        {
          name: "John Doe",
          imageURL:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          comment: "Nulla quis lorem ut libero malesuada feugiat.",
          commented_at: new Date(),
        },
        {
          name: "Jane Doe",
          imageURL:
            "https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          comment: "Pellentesque in ipsum id orci porta dapibus.",
          commented_at: new Date(),
        },
      ],
      tag: "Holiday",
    },
    {
      id: 2,
      title: "Alice and Dave's Wedding",
      description: "A collection of photos from Alice and Dave's Wedding",
      imageURL:
        "https://images.pexels.com/photos/1023233/pexels-photo-1023233.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      likes: 32,
      views: 250,
      collaborators: 36,
      comments: [
        {
          name: "John Doe",
          imageURL:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          comment: "Nulla quis lorem ut libero malesuada feugiat.",
          commented_at: new Date(),
        },
        {
          name: "Jane Doe",
          imageURL:
            "https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          comment: "Pellentesque in ipsum id orci porta dapibus.",
          commented_at: new Date(),
        },
      ],
      tag: "Wedding",
    },
    {
      id: 3,
      title: "Scotland Scrapbook",
      description: "A collection of photos from around Scotland",
      imageURL:
        "https://images.pexels.com/photos/39003/scotland-united-kingdom-england-isle-of-skye-39003.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      likes: 504,
      views: 5042,
      collaborators: 100,
      comments: [
        {
          name: "John Doe",
          imageURL:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          comment: "Nulla quis lorem ut libero malesuada feugiat.",
          commented_at: new Date(),
        },
        {
          name: "Jane Doe",
          imageURL:
            "https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          comment: "Pellentesque in ipsum id orci porta dapibus.",
          commented_at: new Date(),
        },
      ],
      tag: "Holiday",
    },
  ],
  likedPosts: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};
