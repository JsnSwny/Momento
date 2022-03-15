const initialState = {
  elements: [],
  selectedElement: null,
  drawingOptions: { colour: "#000000", thickness: 0.5 },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ELEMENT":
      let id = state.elements.length > 0 ? state.elements.at(-1).id + 1 : 1;
      let obj = { ...action.payload, id };
      return {
        ...state,
        elements: [...state.elements, obj],
        selectedElement: obj.elType != "Line" && obj,
      };
    case "UPDATE_ELEMENT":
      return {
        ...state,
        elements: state.elements.map((item) =>
          item.id === action.id ? action.payload : item
        ),
        selectedElement: action.payload,
      };
    case "DELETE_ELEMENT":
      return {
        ...state,
        elements: state.elements.filter((item) => item.id != action.payload),
      };
    case "SET_SELECTED":
      return {
        ...state,
        selectedElement: state.elements.find(
          (item) => item.id == action.payload
        ),
      };
    case "REORDER_ELEMENTS":
      return {
        ...state,
        elements: action.payload,
      };
    case "CLEAR_ELEMENTS":
      return {
        ...state,
        elements: [],
        selectedElement: null,
      };

    case "SET_DRAWING_COLOUR":
      console.log("Updating colour");
      return {
        ...state,
        drawingOptions: { ...state.drawingOptions, colour: action.payload },
      };

    case "SET_DRAWING_THICKNESS":
      return {
        ...state,
        drawingOptions: { ...state.drawingOptions, thickness: action.payload },
      };
    default:
      return state;
  }
};

export const setDrawingColour = (colour) => ({
  type: "SET_DRAWING_COLOUR",
  payload: colour,
});

export const setDrawingThickness = (size) => ({
  type: "SET_DRAWING_THICKNESS",
  payload: size,
});

export const setSelectedElement = (id) => ({
  type: "SET_SELECTED",
  payload: id,
});

export const updateElement = (id, item) => ({
  type: "UPDATE_ELEMENT",
  id,
  payload: item,
});

export const deleteElement = (id) => ({
  type: "DELETE_ELEMENT",
  payload: id,
});

export const reorderElements = (items) => ({
  type: "REORDER_ELEMENTS",
  payload: items,
});

export const clearElements = (items) => ({
  type: "CLEAR_ELEMENTS",
});
