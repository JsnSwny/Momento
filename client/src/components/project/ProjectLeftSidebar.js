import React, { useState, Fragment } from "react";
import Modal from "../layout/Modal";
import PageForm from "../forms/PageForm";

const ProjectLeftSidebar = () => {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <Modal open={open} setOpen={setOpen} title="Add New Page">
        <PageForm setOpen={setOpen} />
      </Modal>
      <div className="sidebar sidebar--left">
        <div className="sidebar__title">
          <h4>Jason's Holiday</h4>
        </div>
        <ul className="sidebar__list">
          <li>Day 1</li>
          <li>Day 2</li>
          <li>Day 3</li>
          <li>Day 4</li>
        </ul>
        <button onClick={() => setOpen(true)}>+ Add New Page</button>
      </div>
    </Fragment>
  );
};

export default ProjectLeftSidebar;
