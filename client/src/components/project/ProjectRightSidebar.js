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
                  key={item.id?.toString()}
                  draggableId={item.id?.toString()}
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
                      [{item.elType}] {item.text?.slice(0, 10)}
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
          <div className="design-section">
            <h5>Size & Rotation</h5>
            <div className="flex-container--between">
              <div className="design-section__control">
                <label>Width</label>
                <input
                  type="number"
                  value={selectedElement?.width?.toFixed(2)}
                  onChange={(e) => {
                    dispatch(
                      updateElement(selectedElement?.id, {
                        ...selectedElement,
                        width: parseInt(e.target.value),
                      })
                    );
                  }}
                />
              </div>
              <div className="design-section__control">
                <label>Rotation</label>
                <input
                  type="number"
                  value={selectedElement?.rotation}
                  onChange={(e) => {
                    dispatch(
                      updateElement(selectedElement?.id, {
                        ...selectedElement,
                        rotation: e.target.value,
                      })
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="design-section">
            <h5>Text</h5>
            <div className="flex-container--between">
              <div className="design-section__control">
                <label>Font Family</label>
                <select
                  value={
                    selectedElement
                      ? selectedElement.fontFamily
                      : "Arial, sans-serif"
                  }
                  onChange={(e) => {
                    dispatch(
                      updateElement(selectedElement?.id, {
                        ...selectedElement,
                        fontFamily: e.target.value,
                      })
                    );
                  }}
                >
                  <option value={"Arial, sans-serif"}>Arial</option>
                  <option value={"Verdana, sans-serif"}>Verdana</option>
                  <option value={"Helvetica, sans-serif"}>Helvetica</option>
                  <option value={"Tahoma, sans-serif"}>Tahoma</option>
                  <option value={"Trebuchet MS, sans-serif"}>
                    Trebuchet MS
                  </option>
                  <option value={"Georgia, serif"}>Times New Roman</option>
                  <option value={"Garamond, seif"}>Georgia</option>
                  <option value={"Courier New, monospace"}>Garamond</option>
                  <option value={"Brush Script MT, cursive"}>
                    Brush Script MT
                  </option>
                </select>
              </div>
              <div className="design-section__control">
                <label>Font Size</label>
                <select
                  value={selectedElement ? selectedElement.fontSize : "12px"}
                  onChange={(e) => {
                    dispatch(
                      updateElement(selectedElement?.id, {
                        ...selectedElement,
                        fontSize: e.target.value,
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
                  <option value={72}>72px</option>
                  <option value={80}>80px</option>
                  <option value={100}>100px</option>
                  <option value={200}>200px</option>
                </select>
              </div>
            </div>

            <div className="design-section__control">
              <label>Font Style</label>
              <select
                value={selectedElement?.fontStyle}
                onChange={(e) => {
                  dispatch(
                    updateElement(selectedElement?.id, {
                      ...selectedElement,
                      fontStyle: e.target.value,
                    })
                  );
                }}
              >
                <option value={"italic"}>Italic</option>
                <option value={"italic bold"}>Italic Bold</option>
                <option value={"normal"}>Normal</option>
                <option value={"bold"}>Bold</option>
              </select>
            </div>

            <div className="design-section__control design-section__align">
              <i
                class={`fas fa-align-left ${
                  selectedElement.align == "left" ? "active" : ""
                }`}
                onClick={() => alignText(selectedElement, "left")}
              ></i>
              <i
                class={`fas fa-align-center ${
                  selectedElement.align == "center" ? "active" : ""
                }`}
                onClick={() => alignText(selectedElement, "center")}
              ></i>
              <i
                class={`fas fa-align-right ${
                  selectedElement.align == "right" ? "active" : ""
                }`}
                onClick={() => alignText(selectedElement, "right")}
              ></i>
            </div>
          </div>
          <div className="design-section">
            <h5>Colour</h5>
            <div className="design-section__control">
              <label>Fill</label>
              <div className="design-section__color-wrapper">
                <input
                  type="color"
                  name="textColor"
                  value={selectedElement ? selectedElement.fill : "#00000"}
                  onChange={(e) => {
                    dispatch(
                      updateElement(selectedElement?.id, {
                        ...selectedElement,
                        fill: e.target.value,
                      })
                    );
                  }}
                />
                <input
                  type="text"
                  name="textColorText"
                  value={selectedElement ? selectedElement.fill : "#00000"}
                  onChange={(e) => {
                    dispatch(
                      updateElement(selectedElement?.id, {
                        ...selectedElement,
                        fill: e.target.value,
                      })
                    );
                  }}
                />
              </div>
            </div>
            <div className="flex-container--between">
              <div className="design-section__control">
                <label>Stroke</label>
                <div className="design-section__color-wrapper">
                  <input
                    type="color"
                    name="strokeColor"
                    value={selectedElement ? selectedElement.stroke : "#00000"}
                    onChange={(e) => {
                      dispatch(
                        updateElement(selectedElement?.id, {
                          ...selectedElement,
                          stroke: e.target.value,
                        })
                      );
                    }}
                  />
                  <input
                    type="text"
                    name="strokeColorText"
                    value={selectedElement?.stroke}
                    onChange={(e) => {
                      dispatch(
                        updateElement(selectedElement?.id, {
                          ...selectedElement,
                          stroke: e.target.value,
                        })
                      );
                    }}
                  />
                </div>
              </div>
              <div className="design-section__control">
                <label>Stroke Width</label>
                <select
                  value={selectedElement?.strokeWidth}
                  onChange={(e) => {
                    dispatch(
                      updateElement(selectedElement?.id, {
                        ...selectedElement,
                        strokeWidth: e.target.value,
                      })
                    );
                  }}
                >
                  <option value={0.5}>0.5px</option>
                  <option value={1}>1px</option>
                  <option value={1.5}>1.5px</option>
                  <option value={2}>2px</option>
                  <option value={3}>3px</option>
                  <option value={4}>4px</option>
                  <option value={5}>5px</option>
                </select>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ProjectRightSidebar;
