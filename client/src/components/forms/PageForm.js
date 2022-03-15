import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
<<<<<<< HEAD
import store from "../../store/store";
import { canvasFunctions } from "../project/CanvasFunctions";
=======
import { addPage } from "../../store/actions/project";
>>>>>>> canvas-functionality

const PageForm = ({ setOpen }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    };
    
    const AddPage = () => {
        dispatch(canvasFunctions.addPage(store.getState().project.currentProjectData.pageCount + 1, title, description));

        setOpen(false);
    };
=======
    dispatch(addPage(title));
    setOpen(false);
  };
>>>>>>> canvas-functionality

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
      <hr />
      <div className="button-container">
        <button className="btn" type="submit" value="Add Page" onClick={ AddPage }>
          Add Page
        </button>
      </div>
    </form>
  );
};

export default PageForm;
