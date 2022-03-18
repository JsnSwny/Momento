import { canvasService } from "../services/canvas.service";
import {
    SET_MESSAGE,
    PAGE_ADD_SUCCESS,
    PAGE_DELETE_SUCCESS,
    PAGE_LOAD_SUCCESS,
    PAGE_EDIT_SUCCESS,
} from "./types";

export const canvasAddPage = (projectId, pageNumber, title, description) => (dispatch) => {
    
    return canvasService.addPage(projectId, pageNumber, title, description, JSON.parse(localStorage.getItem("user")).accessToken)
        .then(
            (response) => {
                console.log("Page added");
                dispatch({
                    type: PAGE_ADD_SUCCESS,
                    payload: { newPageData: response },
                });

                return Promise.resolve();
            }
        )
};

export const canvasDeletePage = (projectId, pageNumber) => (dispatch) => {
    return canvasService.deletePage(projectId, pageNumber, JSON.parse(localStorage.getItem("user")).accessToken)
        .then(
            (response) => {
                console.log("Page deleted");
                dispatch({
                    type: PAGE_DELETE_SUCCESS,
                });

                return Promise.resolve();
            }
        )
};

export const canvasLoadPage = (projectId, pageNumber) => (dispatch) => {
    return canvasService.loadPage(projectId, pageNumber, JSON.parse(localStorage.getItem("user")).accessToken)
        .then(
            (response) => {
                console.log("Page loaded");
                dispatch({
                    type: PAGE_LOAD_SUCCESS,
                    payload: { pageData: response },
                });

                return Promise.resolve();
            }
        )
};

export const canvasEditPage = (projectId, pageNumber, newPageData) => (dispatch) => {
    return canvasService.editPage(projectId, pageNumber, newPageData, JSON.parse(localStorage.getItem("user")).accessToken)
        .then(
            (response) => {
                console.log("Page saved");
                dispatch({
                    type: PAGE_EDIT_SUCCESS,
                });

                return Promise.resolve();
            }
        )
};