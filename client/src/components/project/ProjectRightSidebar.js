import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedElement } from "../../store/reducers/canvas";
import { updateElement, deleteElement } from "../../store/reducers/canvas";

const ProjectRightSidebar = () => {
  const dispatch = useDispatch();
  const elements = useSelector((state) => state.canvas.elements);
  const selectedElement = useSelector((state) => state.canvas.selectedElement);

  return (
    <div className="sidebar sidebar--right">
      <div className="sidebar__title">
        <h4>Layers</h4>
      </div>
      <ul className="sidebar__list">
        {elements.map((item) => (
          <li
            className={`${selectedElement?.id == item.id ? "active" : ""}`}
            onClick={() => dispatch(setSelectedElement(item.id))}
            onKeyDown={(e) => {
              if (e.keyCode == 46) {
                dispatch(deleteElement(item.id));
              }
            }}
            tabIndex={`${selectedElement?.id == item.id ? "1" : "-1"}`}
          >
            [{item.elType}] {item.text.slice(0, 10)}
          </li>
        ))}
      </ul>
      <div className="sidebar__title">
        <h4>Design</h4>
      </div>
      <label>Font Size</label>
      <select
        value={selectedElement?.fontSize}
        onChange={(e) => {
          dispatch(
            updateElement(selectedElement?.id, {
              ...selectedElement,
              fontSize: parseInt(e.target.value),
            })
          );
        }}
      >
        <option value={8}>8px</option>
        <option value={12}>12px</option>
        <option value={14}>14px</option>
        <option value={16}>16px</option>
        <option value={18}>18px</option>
        <option value={24}>24px</option>
        <option value={32}>32px</option>
        <option value={48}>48px</option>
        <option value={64}>64px</option>
      </select>
      <input
        type="color"
        name="textColor"
        value={selectedElement?.textColor}
        onChange={(e) => {
          dispatch(
            updateElement(selectedElement?.id, {
              ...selectedElement,
              fill: e.target.value,
            })
          );
        }}
      />
      <label for="textColor">Colour</label>
    </div>
  );
};

export default ProjectRightSidebar;
