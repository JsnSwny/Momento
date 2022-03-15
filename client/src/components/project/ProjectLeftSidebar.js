import React, { useState, Fragment, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../layout/Modal";
import PageForm from "../forms/PageForm";
import { canvasFunctions } from "../project/CanvasFunctions";
import {
  addPage,
  updatePage,
  setActivePage,
  setEditingPage,
  deletePage,
} from "../../store/actions/project";
import { useOnClickOutside } from "../../utils/useOnClickOutside";

const ProjectLeftSidebar = () => {
  const project = useSelector((state) => state.project);

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
          <h4>{project.currentProjectData.title}</h4>
        </div>
        <ul ref={pagesRef} className="sidebar__list">
          {project.pages.map((page) => (
            <li
              onClick={() => {
                currentPage != page.id && dispatch(setActivePage(page.id));
                dispatch(canvasFunctions.loadPage(page.pageNumber));
              }}
              onDoubleClick={() => {
                if (editingPage != page.id) {
                  dispatch(setEditingPage(page.id));
                  setEditValue("");
                }
              }}
              onKeyDown={(e) => {
                if (e.keyCode == 46) {
                  dispatch(deletePage(page.id));
                }
              }}
              tabIndex={`${currentPage == page.id ? "1" : "-1"}`}
              className={`${currentPage == page.id ? "active" : ""}`}
            >
              {editingPage == page.id ? (
                <form onSubmit={onSubmit}>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  />
                </form>
              ) : (
                <span>{page.pageTitle.slice(0, 10)}</span>
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
