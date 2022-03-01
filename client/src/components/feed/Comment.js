import React from "react";
import { differenceInMinutes } from "date-fns";

const Comment = ({ obj }) => {
  return (
    <li className="flex-container">
      <img className="profile-picture" src={obj.imageURL} />
      <div className="feed-post__comment-content">
        <h4>{obj.name}</h4>
        <p>{obj.comment}</p>
        <small>32m ago</small>
      </div>
    </li>
  );
};

export default Comment;
