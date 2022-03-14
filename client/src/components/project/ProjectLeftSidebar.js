import React, { useState, Fragment, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../layout/Modal";
import PageForm from "../forms/PageForm";
import {
  addPage,
  updatePage,
  setActivePage,
  setEditingPage,
  deletePage,
} from "../../store/actions/project";
import { useOnClickOutside } from "../../utils/useOnClickOutside";

const ProjectLeftSidebar = () => {
  const [open, setOpen] = useState(false);
  const pages = useSelector((state) => state.project.pages);
  const currentPage = useSelector((state) => state.project.currentPage);
  const editingPage = useSelector((state) => state.project.editingPage);

  const dispatch = useDispatch();

  const [editValue, setEditValue] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePage(editingPage, editValue));
  };

  const pagesRef = useRef(null);

  useOnClickOutside(pagesRef, () => dispatch(setEditingPage(null)));

  useEffect(() => {
    if (editingPage) {
      setEditValue(pages.find((item) => item.id == editingPage).title);
    }
  }, [editingPage]);

  return (
    <Fragment>
      <Modal open={open} setOpen={setOpen} title="Add New Page">
        <PageForm setOpen={setOpen} />
      </Modal>
      <div className="sidebar sidebar--left">
        <div className="sidebar__title">
          <h4>Jason's Holiday</h4>
        </div>
        <ul ref={pagesRef} className="sidebar__list">
          {pages.map((item) => (
            <li
              onClick={() =>
                currentPage != item.id && dispatch(setActivePage(item.id))
              }
              onDoubleClick={() => {
                if (editingPage != item.id) {
                  dispatch(setEditingPage(item.id));
                  setEditValue("");
                }
              }}
              onKeyDown={(e) => {
                if (e.keyCode == 46) {
                  dispatch(deletePage(item.id));
                }
              }}
              tabIndex={`${currentPage == item.id ? "1" : "-1"}`}
              className={`${currentPage == item.id ? "active" : ""}`}
            >
              {editingPage == item.id ? (
                <form onSubmit={onSubmit}>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  />
                </form>
              ) : (
                <span>{item.title}</span>
              )}
            </li>
          ))}
        </ul>
        <button onClick={() => dispatch(addPage(`Page ${pages.length + 1}`))}>
          + Add New Page
        </button>
      </div>
    </Fragment>
  );
};

export default ProjectLeftSidebar;
