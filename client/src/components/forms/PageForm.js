import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PageForm = ({ setOpen }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={onSubmit} className="form">
      <div className="form__control">
        <label className="form__label">Title*</label>
        <input
          className="form__input"
          type="text"
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          value={title}
        ></input>
      </div>
      <div className="form__control">
        <label className="form__label">Description*</label>
        <textarea
          className="form__input"
          name="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        ></textarea>
      </div>
      <hr />
      <div className="button-container">
        <button className="btn" type="submit" value="Add Page">
          Add Page
        </button>
      </div>
    </form>
  );
};

export default PageForm;
