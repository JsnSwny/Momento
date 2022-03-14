import {
  ADD_PAGE,
  UPDATE_PAGE,
  SET_ACTIVE_PAGE,
  SET_EDITING_PAGE,
  DELETE_PAGE,
} from "../actions/types";

const initialState = {
  pages: [
    { id: 1, title: "Page 1" },
    { id: 2, title: "Page 2" },
    { id: 3, title: "Page 3" },
    { id: 4, title: "Page 4" },
    { id: 5, title: "Page 5" },
  ],
  currentPage: 2,
  editingPage: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_PAGE:
      return {
        ...state,
        pages: [...state.pages, action.payload],
        currentPage: action.payload.id,
        editingPage: action.payload.id,
      };
    case UPDATE_PAGE:
      return {
        ...state,
        editingPage: null,
        pages: state.pages.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case DELETE_PAGE:
      const pageIdx = state.pages.findIndex(
        (item) => item.id == action.payload
      );
      return {
        ...state,
        pages: state.pages.filter((item) => item.id != action.payload),
        currentPage:
          state.pages[`${pageIdx > 1 ? pageIdx - 1 : pageIdx + 1}`].id,
        editingPage: null,
      };
    case SET_ACTIVE_PAGE:
      return {
        ...state,
        currentPage: action.payload,
        editingPage: null,
      };
    case SET_EDITING_PAGE:
      return {
        ...state,
        editingPage: action.payload,
      };
    default:
      return state;
  }
};
