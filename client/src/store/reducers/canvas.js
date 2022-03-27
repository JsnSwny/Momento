import { canvasFunctions } from "../../components/project/CanvasFunctions";

const initialState = {
  elements: [],
  selectedElement: null,
  drawingOptions: { colour: "#000000", thickness: 0.5 },
  changes: [],
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
          changes: [...state.changes, {type: 1, id: id, object: obj}],
      };
      case "UPDATE_ELEMENT":

          var alreadyExists = false;
          
          for (let i = 0; i < state.changes.length; i++) { 
              if (state.changes[i].id === action.id) { 
                alreadyExists = true;
              }
          }

          if (!alreadyExists) { 
              state.changes.push({type: 2, id: action.id});
          }

      return {
        ...state,
        elements: state.elements.map((item) =>
          item.id === action.id ? action.payload : item
        ),
          selectedElement: action.payload,
      };
      case "DELETE_ELEMENT":
          
        var alreadyExists_ = false;
          
          for (let j = 0; j < state.changes.length; j++) { 
              if (state.changes[j].id === action.id) { 
                  alreadyExists_ = true;
                  
                  if (state.changes[j].type === 1) {
                      state.changes.splice(j, 1);
                  }
                  else { 
                      state.changes[j].type = 3;
                  }
              }
          }

          if (!alreadyExists_) { 
              state.changes.push({type: 3, id: action.id});
          }
          
      return {
        ...state,
          elements: state.elements.filter((item) => item.id != action.payload),
          changes: [...state.changes, {type: 3, id: action.id}],
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
          changes: [...state.changes, {type: 4}],
      };
    case "CLEAR_ELEMENTS":
      return {
        ...state,
        elements: [],
          selectedElement: null,
          changes: [],
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
    case "LOAD_ELEMENT":
        let obj2 = { ...action.payload.attributes, id: action.payload.id };
    return {
        ...state,
        elements: [...state.elements, obj2],
          };
      
    case "LOAD_ADD_ELEMENT":
        let obj3 = { ...action.payload, id: action.payload.id };
        
    return {
        ...state,
        elements: [...state.elements, obj3],
    };
    case "LOAD_UPDATE_ELEMENT":

    return {
        ...state,
        elements: state.elements.map((item) =>
        item.id === action.id ? action.payload : item
        )
    };
    case "LOAD_DELETE_ELEMENT":
        
    return {
        ...state,
        elements: state.elements.filter((item) => item.id != action.payload),
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
