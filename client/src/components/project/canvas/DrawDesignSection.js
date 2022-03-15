import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateElement } from "../../../store/reducers/canvas";
import {
  setDrawingColour,
  setDrawingThickness,
} from "../../../store/reducers/canvas";

const DrawDesignSection = () => {
  const dispatch = useDispatch();
  const drawingOptions = useSelector((state) => state.canvas.drawingOptions);

  return (
    <Fragment>
      <div className="design-section">
        <h5>Colour</h5>
        <div className="design-section__control">
          <label>Fill</label>
          <div className="design-section__color-wrapper">
            <input
              type="color"
              name="textColor"
              value={drawingOptions.colour}
              onChange={(e) => {
                dispatch(setDrawingColour(e.target.value));
              }}
            />
            <input
              type="text"
              name="textColorText"
              value={drawingOptions.colour}
              onChange={(e) => {
                dispatch(setDrawingColour(e.target.value));
              }}
            />
          </div>
        </div>
        <div className="design-section__control">
          <label>Stroke Thickness</label>
          <select
            value={drawingOptions.thickness}
            onChange={(e) => {
              dispatch(setDrawingThickness(e.target.value));
            }}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={7.5}>7.5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>
    </Fragment>
  );
};

export default DrawDesignSection;
