import React from "react";
import { Link } from "react-router-dom";

const convertDateDiff = (dateDiff) => {
  var seconds = Math.floor(dateDiff / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);

  if (days > 0) {
    return days + " days ago";
  } else if (hours > 0) {
    return hours + " hours ago";
  } else if (minutes > 0) {
    return minutes + " minutes ago";
  } else {
    return seconds + " seconds ago";
  }
}

const Comment = ({ obj }) => {
  var dateDiff = (obj.commented_at !== undefined ? 
    Date.now() - (new Date(obj.commented_at.toString()).getTime())
    : 0);
  return (
    <li className="flex-container">
      <a href={`/user/${obj.username}`}>
        <img className="profile-picture" src={obj.imageURL} />
      </a>
      <div className="feed-post__comment-content">
        <a href={`/user/${obj.username}`}><h4>{obj.name}</h4></a>
        <p>{obj.comment}</p>
        <small>{convertDateDiff(dateDiff)}</small>
      </div>
    </li>
  );
};

export default Comment;
