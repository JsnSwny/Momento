import { projectService } from "../services/project.service";
import { canvasFunctions } from "../../components/project/CanvasFunctions";
import store from "../../store/store";
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
  ADD_PAGE,
  UPDATE_PAGE,
  SET_ACTIVE_PAGE,
  SET_EDITING_PAGE,
  DELETE_PAGE,
  PROJECT_INITCANVASCONNECTION_SUCCESS,
  PROJECT_INITCANVASCONNECTION_FAILURE,
  PROJECT_EDITINGSTATUSUPDATE_SUCCESS,
  PROJECT_EDITINGSTATUSUPDATE_FAILURE,
  PROJECT_EXPORT_SUCCESS,
  PROJECT_EXPORT_FAILURE,
  PROJECT_PERMISSIONCHANGE_SUCCESS,
  PROJECT_PERMISSIONCHANGE_FAILURE
} from "./types";

export const newProject = (projectTitle, projectDescription) => (dispatch) => {
  return projectService
    .createProject(
      projectTitle,
      projectDescription,
      JSON.parse(localStorage.getItem("user")).accessToken
    )
    .then(
      (response) => {
        console.log("Project created");
        dispatch({
          type: PROJECT_CREATE_SUCCESS,
          payload: { newProjectId: response.projectId },
        });

        return Promise.resolve(response);
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
    );
};

export const loadProject = (projectId) => (dispatch) => {
  return projectService
    .loadProject(
      projectId,
      JSON.parse(localStorage.getItem("user")).accessToken
    )
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
    );
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

export const initCanvasConnection = (projectId, pageNumber) => (dispatch) => {
    return projectService.initCanvasConnection(projectId, pageNumber, JSON.parse(localStorage.getItem("user")).accessToken)
        .then(
            (response) => {
                dispatch({
                    type: PROJECT_INITCANVASCONNECTION_SUCCESS,
                    payload: {  },
                });
                
                store.getState().project.canvasConnection = new WebSocket("ws://" + window.location.hostname + ":3002/ws");

                var socket = store.getState().project.canvasConnection;

                socket.addEventListener("open", () => {
                    
                    socket.send(JSON.stringify({
                        userId: JSON.parse(localStorage.getItem("user")).id,
                        projectId: projectId,
                        pageNumber: pageNumber,
                        token: JSON.parse(localStorage.getItem("user")).accessToken
                    }));
                });

                socket.addEventListener("message", (msg) => {
                    if (store.getState().project.canvasConnection == socket) {
                        canvasFunctions.loadCanvasUpdate(msg);
                    }
                });

                socket.addEventListener("close", () => {

                    if (store.getState().project.canvasConnection == socket) {
                        if (!store.getState().project.movingPage) {
                            console.log("Restarting canvas connection...");
                            store.getState().project.canvasRealtimeConnection = false;

                            dispatch(initCanvasConnection(projectId, pageNumber));
                        } else {
                            store.getState().project.movingPage = false;
                        }
                    }
                });

                return Promise.resolve();
            }
        )
};

export const stillHere = (projectId, pageNumber) => (dispatch) => {

    return projectService.stillHere(projectId, pageNumber, JSON.parse(localStorage.getItem("user")).accessToken)
        .then(
            (response) => {
                dispatch({
                    type: PROJECT_EDITINGSTATUSUPDATE_SUCCESS,
                    payload: {  },
                });

                return Promise.resolve();
            },
            (error) => {
                console.log("Error updating editing status: " + error);
                dispatch({
                    type: PROJECT_EDITINGSTATUSUPDATE_FAILURE,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: error,
                });

                return Promise.reject();
            }
        )
};

export const requestProjectExport = (projectId) => (dispatch) => {

    return projectService.exportProject(projectId, JSON.parse(localStorage.getItem("user")).accessToken)
        .then(
            (response) => {
                
                dispatch({
                    type: PROJECT_EXPORT_SUCCESS,
                    payload: { images: response.images },
                });

                return Promise.resolve();
            },
            (error) => {
                console.log("Error exporting project: " + error);
                dispatch({
                    type: PROJECT_EXPORT_FAILURE,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: error,
                });

                return Promise.reject();
            }
        )
};

export const changePermissions = (projectId, roleName, userId, add) => (dispatch) => {

    return projectService.changeProjectPermissions(
        projectId,
        userId,
        roleName,
        add)
        .then(
            (response) => {
                
                dispatch({
                    type: PROJECT_PERMISSIONCHANGE_SUCCESS,
                    payload: { images: response.images },
                });

                return Promise.resolve();
            },
            (error) => {
                console.log("Error changing project permissions: " + error);
                dispatch({
                    type: PROJECT_PERMISSIONCHANGE_FAILURE,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: error,
                });

                return Promise.reject();
            }
        )
};