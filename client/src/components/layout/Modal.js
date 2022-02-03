import React, { useRef } from "react";
import { useOnClickOutside } from "../../utils/useOnClickOutside";

const Modal = ({ title, open, setOpen, size, children }) => {
  const ref = useRef();
  useOnClickOutside(ref, () => setOpen(false));
  if (open) {
    return (
      <div className={`modal-container ${open ? "open" : ""}`}>
        <div ref={ref} className="modal">
          <div className="heading">
            <h3>{title}</h3>
            <i class="fas fa-times" onClick={() => setOpen(false)}></i>
          </div>
          <hr />
          {children}
        </div>
      </div>
    );
  } else {
    return false;
  }
};

export default Modal;
