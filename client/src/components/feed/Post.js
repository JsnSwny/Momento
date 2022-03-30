import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { likePost, unlikePost, addComment, getPosts } from "../../store/actions/posts";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const likedPosts = useSelector((state) => state.posts.likedPosts);
  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(
      addComment(comment, post.id)
    );

    dispatch(getPosts());

    setComment("");
  };
  return (
    <li className="feed-post">
      <div className="flex-container">
        <div className="feed-post__image">
          <img src={post?.images[0]?.imageURL} />
        </div>
        <ul className="feed-post__comments">
          {post.comments.map((item) => (
            <Comment obj={item} />
          ))}
        </ul>
      </div>
      <div className="feed-post__bottom">
        <div className="flex-container--between">
          <div className="feed-post__info">
            <h4>{post.title}</h4>
            <p>{post.description}</p>
          </div>
          <ul className="flex-container--between feed-post__icons">
            <li>
              <i className="fas fa-users"></i>
              <p>{post.collaborators}</p>
            </li>
            <li>
              <i
                className={`fas fa-heart ${
                  likedPosts.includes(post.id) ? "active" : ""
                }`}
                onClick={() => {
                  console.log(likedPosts);
                  dispatch(
                    likedPosts.includes(post.id)
                      ? unlikePost(post.id)
                      : likePost(post.id)
                  );
                }}
              ></i>
              <p>{post.likes}</p>
            </li>
            <li>
              <i className="fas fa-eye"></i>
              <p>{post.views}</p>
            </li>
          </ul>
        </div>
        <div className="flex-container--between feed-post__comment-container">
          <form onSubmit={onSubmit}>
            <input
              className="feed-post__comment-input"
              placeholder="Add a comment"
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </form>
          <i className="fas fa-paper-plane" onClick={() => onSubmit}></i>
        </div>
      </div>
    </li>
  );
};

export default Post;
