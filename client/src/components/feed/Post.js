import React from "react";
import Comment from "./Comment";

const Post = () => {
  return (
    <li className="feed-post">
      <div className="flex-container">
        <img className="feed-post__image" src="/images/filler-image.jpeg" />
        <ul className="feed-post__comments">
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          <Comment />
        </ul>
      </div>
      <div className="feed-post__bottom">
        <div className="flex-container--between">
          <div className="feed-post__info">
            <h4>John's Holiday</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
              nunc, interdum est condimentum malesuada.
            </p>
          </div>
          <ul className="flex-container--between feed-post__icons">
            <li>
              <i className="fas fa-users"></i>
              <p>12</p>
            </li>
            <li>
              <i className="fas fa-heart"></i>
              <p>12</p>
            </li>
            <li>
              <i className="fas fa-eye"></i>
              <p>12</p>
            </li>
          </ul>
        </div>
        <div className="flex-container--between feed-post__comment-container">
          <input
            className="feed-post__comment-input"
            placeholder="Add a comment"
            type="text"
          />
          <i className="fas fa-paper-plane"></i>
        </div>
      </div>
    </li>
  );
};

export default Post;
