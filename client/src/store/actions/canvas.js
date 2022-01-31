import { canvasService } from "../services/canvas.service";
import {
    SET_MESSAGE,
    PAGE_ADD_SUCCESS,
    PAGE_ADD_FAILURE,
    PAGE_DELETE_SUCCESS,
    PAGE_DELETE_FAILURE,
    PAGE_LOAD_SUCCESS,
    PAGE_LOAD_FAILURE,
    PAGE_EDIT_SUCCESS,
    PAGE_EDIT_FAILURE,
} from "./types";

export const canvasAddPage = (projectId, pageNumber, authToken) => (dispatch) => {

    return canvasService.addPage(projectId, pageNumber, authToken)
        .then(
            (response) => {
                console.log("Page added");
                dispatch({
                    type: PAGE_ADD_SUCCESS,
                    payload: { newPageData: response },
                });

                return Promise.resolve();
            },
            (error) => {
                console.log("Error adding page: " + error);
                dispatch({
                    type: PAGE_ADD_FAILURE,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: error,
                });

                return Promise.reject();
            }
        )
};

export const canvasDeletePage = (projectId, pageNumber, authToken) => (dispatch) => {
    return canvasService.deletePage(projectId, pageNumber, authToken)
        .then(
            (response) => {
                console.log("Page deleted");
                dispatch({
                    type: PAGE_DELETE_SUCCESS,
                });

                return Promise.resolve();
            },
            (error) => {
                console.log("Error deleting page: " + error);
                dispatch({
                    type: PAGE_DELETE_FAILURE,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: error,
                });

                return Promise.reject();
            }
        )
};

export const canvasLoadPage = (projectId, pageNumber, authToken) => (dispatch) => {
    return canvasService.loadPage(projectId, pageNumber, authToken)
        .then(
            (response) => {
                console.log("Page loaded");
                dispatch({
                    type: PAGE_LOAD_SUCCESS,
                    payload: { pageData: response },
                });

                return Promise.resolve();
            },
            (error) => {
                console.log("Error loading page: " + error);
                dispatch({
                    type: PAGE_LOAD_FAILURE,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: error,
                });

                return Promise.reject();
            }
        )
};

export const canvasEditPage = (projectId, pageNumber, newPageData, authToken) => (dispatch) => {
    return canvasService.editPage(projectId, pageNumber, newPageData, authToken)
        .then(
            (response) => {
                console.log("Page saved");
                dispatch({
                    type: PAGE_EDIT_SUCCESS,
                });

                return Promise.resolve();
            },
            (error) => {
                console.log("Error saving page: " + error);
                dispatch({
                    type: PAGE_EDIT_FAILURE,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: error,
                });

                return Promise.reject();
            }
        )
};