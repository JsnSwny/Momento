import {
  ADD_PAGE,
  UPDATE_PAGE,
  SET_ACTIVE_PAGE,
  SET_EDITING_PAGE,
  DELETE_PAGE,
} from "./types";

export const addPage = (title) => (dispatch) => {
  dispatch({
    type: ADD_PAGE,
    payload: { id: Math.floor(Math.random() * 10000 + 1), title },
  });
};

export const updatePage = (id, title) => (dispatch) => {
  dispatch({
    type: UPDATE_PAGE,
    payload: { id, title },
  });
};

export const deletePage = (id, title) => (dispatch) => {
  dispatch({
    type: DELETE_PAGE,
    payload: id,
  });
};

export const setActivePage = (id) => (dispatch) => {
  dispatch({
    type: SET_ACTIVE_PAGE,
    payload: id,
  });
};

export const setEditingPage = (id) => (dispatch) => {
  dispatch({
    type: SET_EDITING_PAGE,
    payload: id,
  });
};
