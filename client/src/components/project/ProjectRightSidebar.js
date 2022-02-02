import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedElement } from "../../store/reducers/canvas";
import {
  updateElement,
  deleteElement,
  reorderElements,
} from "../../store/reducers/canvas";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ProjectRightSidebar = () => {
  const dispatch = useDispatch();
  const elements = useSelector((state) => state.canvas.elements);
  const selectedElement = useSelector((state) => state.canvas.selectedElement);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      elements,
      result.source.index,
      result.destination.index
    );

    console.log(items);

    dispatch(reorderElements(items));
  };

  const alignText = (item, align) => {
    dispatch(
      updateElement(selectedElement?.id, {
        ...selectedElement,
        align,
      })
    );
  };

  return (
    <div className="sidebar sidebar--right">
      <div className="sidebar__title">
        <h4>Layers</h4>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="sidebar__list"
            >
              {[...elements].map((item, idx) => (
                <Draggable
                  key={item.id.toString()}
                  draggableId={item.id.toString()}
                  index={idx}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${
                        selectedElement?.id == item.id ? "active" : ""
                      } ${snapshot.isDragging ? "dragging" : ""}`}
                      onClick={() => dispatch(setSelectedElement(item.id))}
                      onKeyDown={(e) => {
                        if (e.keyCode == 46) {
                          dispatch(deleteElement(item.id));
                        }
                      }}
                      tabIndex={`${
                        selectedElement?.id == item.id ? "1" : "-1"
                      }`}
                    >
                      [{item.elType}] {item.text.slice(0, 10)}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

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
      <i
        class="fas fa-align-left"
        onClick={() => alignText(selectedElement, "left")}
      ></i>
      <i
        class="fas fa-align-center"
        onClick={() => alignText(selectedElement, "center")}
      ></i>
      <i
        class="fas fa-align-right"
        onClick={() => alignText(selectedElement, "right")}
      ></i>
    </div>
  );
};

export default ProjectRightSidebar;
