import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedElement } from "../../store/reducers/canvas";
import {
  updateElement,
  deleteElement,
  reorderElements,
} from "../../store/reducers/canvas";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TextDesignSection from "./canvas/TextDesignSection";
import DrawDesignSection from "./canvas/DrawDesignSection";

const ProjectRightSidebar = ({ selectedAction }) => {
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

      {(selectedElement ||
        selectedAction == "draw" ||
        selectedAction == "eraser") && (
        <Fragment>
          <div className="sidebar__title">
            <h4>Design</h4>
          </div>
          {selectedAction == "draw" || selectedAction == "eraser" ? (
            <DrawDesignSection />
          ) : (
            <TextDesignSection />
          )}
        </Fragment>
      )}
    </div>
  );
};

export default ProjectRightSidebar;
