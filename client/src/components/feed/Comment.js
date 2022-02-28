import React from "react";

const Comment = () => {
  return (
    <li className="flex-container">
      <img className="profile-picture" src="/images/filler-image.jpeg" />
      <div>
        <h4>Joe Doe</h4>
        <p>
          Vivamus magna justo, lacinia eget consectetur sed, convallis at
          tellus.
        </p>
        <small>32m</small>
      </div>
    </li>
  );
};

export default Comment;
