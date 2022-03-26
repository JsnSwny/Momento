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

// export const editProject = (projectId, newTitle, newDescription) => (dispatch) => {

//     return projectService.editProject(projectId, newTitle, newDescription, JSON.parse(localStorage.getItem("user")).accessToken)
//         .then(
//             (response) => {
//                 console.log("Project edited");
//                 dispatch({
//                     type: PROJECT_EDIT_SUCCESS,
//                 });

//                 return Promise.resolve();
//             },
//             (error) => {
//                 console.log("Error editing project: " + error);
//                 dispatch({
//                     type: PROJECT_EDIT_FAILURE,
//                 });

//                 dispatch({
//                     type: SET_MESSAGE,
//                     payload: error,
//                 });

//                 return Promise.reject();
//             }
//         )
// };

// export const addPage = (title) => (dispatch) => {
//   dispatch({
//     type: ADD_PAGE,
//     payload: { id: Math.floor(Math.random() * 10000 + 1), title },
//   });
// };

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

                var socket = new WebSocket("ws://" + window.location.hostname + ":3002/ws");

                socket.addEventListener("open", () => {
                    socket.send(JSON.stringify({ userId: store.getState().user.currentUserData.userId, token: JSON.parse(localStorage.getItem("user")).accessToken }));
                });

                socket.addEventListener("message", (msg) => {
                    canvasFunctions.loadCanvasUpdate(msg);
                });

                return Promise.resolve();
            },
            (error) => {
                console.log("Error initialising canvas connection: " + error);
                dispatch({
                    type: PROJECT_INITCANVASCONNECTION_FAILURE,
                });

                dispatch({
                    type: SET_MESSAGE,
                    payload: error,
                });

                return Promise.reject();
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

                canvasFunctions.startCanvasConnection();

                return Promise.reject();
            }
        )
};
