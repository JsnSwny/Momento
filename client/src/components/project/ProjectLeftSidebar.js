import React, { useState, Fragment } from "react";
import Modal from "../layout/Modal";
import PageForm from "../forms/PageForm";
import { useSelector, useDispatch } from "react-redux";
import { canvasFunctions } from "../project/CanvasFunctions";

const ProjectLeftSidebar = () => {

    const dispatch = useDispatch();
    const project = useSelector((state) => state.project);


  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <Modal open={open} setOpen={setOpen} title="Add New Page">
        <PageForm setOpen={setOpen} />
      </Modal>
      <div className="sidebar sidebar--left">
        <div className="sidebar__title">
            <h4>{ project.currentProjectData.title }</h4>
        </div>
              <ul className="sidebar__list">
              {project.pages.map((page) => (
                  <li
                      onClick={() => dispatch(canvasFunctions.loadPage(page.pageNumber))}>
                      {page.pageTitle.slice(0, 10)}
                  </li>
              ))}
        </ul>
        <button onClick={() => setOpen(true)}>+ Add New Page</button>
      </div>
    </Fragment>
  );
};

export default ProjectLeftSidebar;
