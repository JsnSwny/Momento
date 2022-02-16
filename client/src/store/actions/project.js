import { projectService } from "../services/project.service";
import {
    SET_MESSAGE,
    PROJECT_CREATE_SUCCESS,
    PROJECT_CREATE_FAILURE,
    PROJECT_DELETE_SUCCESS,
    PROJECT_DELETE_FAILURE,
    PROJECT_LOAD_SUCCESS,
    PROJECT_LOAD_FAILURE,
    PROJECT_EDIT_SUCCESS,
    PROJECT_EDIT_FAILURE,

} from "./types";

export const newProject = (projectTitle, projectDescription) => (dispatch) => {

    return projectService.createProject(projectTitle, projectDescription, JSON.parse(localStorage.getItem("user")).accessToken)
        .then(
            (response) => {
                console.log("Project created");
                dispatch({
                    type: PROJECT_CREATE_SUCCESS,
                    payload: { newProjectId: response.projectId },
                });

                return Promise.resolve();
            },
            (error) => {
                console.log("Error creating project: " + error);
                dispatch({
                    type: PROJECT_CREATE_FAILURE,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: error,
                });

                return Promise.reject();
            }
        )
};

export const loadProject = (projectId) => (dispatch) => {

    return projectService.loadProject(projectId, JSON.parse(localStorage.getItem("user")).accessToken)
        .then(
            (response) => {
                console.log("Project loaded");
                dispatch({
                    type: PROJECT_LOAD_SUCCESS,
                    payload: { projectData: response },
                });

                return Promise.resolve();
            },
            (error) => {
                console.log("Error loading project: " + error);
                dispatch({
                    type: PROJECT_LOAD_FAILURE,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: error,
                });

                return Promise.reject();
            }
        )
};

export const editProject = (projectId, newTitle, newDescription) => (dispatch) => {

    return projectService.editProject(projectId, newTitle, newDescription, JSON.parse(localStorage.getItem("user")).accessToken)
        .then(
            (response) => {
                console.log("Project edited");
                dispatch({
                    type: PROJECT_EDIT_SUCCESS,
                });

                return Promise.resolve();
            },
            (error) => {
                console.log("Error editing project: " + error);
                dispatch({
                    type: PROJECT_EDIT_FAILURE,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: error,
                });

                return Promise.reject();
            }
        )
};