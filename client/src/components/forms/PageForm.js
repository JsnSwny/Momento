import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../store/store";
import { canvasFunctions } from "../project/CanvasFunctions";

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
        <button className="btn" type="submit" value="Add Page" onClick={ dispatch(canvasFunctions.addPage(store.getState().project.currentProjectData.pageCount + 1)) }>
          Add Page
        </button>
      </div>
    </form>
  );
};

export default PageForm;
