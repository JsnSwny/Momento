import {
    PAGE_ADD_SUCCESS,
    PAGE_ADD_FAILURE,
    PAGE_DELETE_SUCCESS,
    PAGE_DELETE_FAILURE,
    PAGE_LOAD_SUCCESS,
    PAGE_LOAD_FAILURE,
    PAGE_EDIT_SUCCESS,
    PAGE_EDIT_FAILURE,
    PROJECT_CREATE_SUCCESS,
    PROJECT_CREATE_FAILURE,
    PROJECT_DELETE_SUCCESS,
    PROJECT_DELETE_FAILURE,
    PROJECT_LOAD_SUCCESS,
    PROJECT_LOAD_FAILURE,
    PROJECT_EDIT_SUCCESS,
    PROJECT_EDIT_FAILURE,
} from "../actions/types";

const initialState = {
    operationSuccess: false,
    currentProjectData: {
        projectId: -1,
        ownerId: localStorage.getItem("user").id,
        title: "",
        description: "",
        pageCount: 0
    },
    currentPageData: {
        pageId: -1,
        pageNumber: -1,
        pageData: ""
    },
  };

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case PROJECT_CREATE_SUCCESS:
            return {
                ...state,
                operationSuccess: true,
                currentProjectData: {
                    projectId: payload.newProjectId,
                    ownerId: localStorage.getItem("user").id,
                    title: payload.title,
                    description: payload.description,
                    pageCount: 0
                },
        };
    
        case PROJECT_CREATE_FAILURE:
            return {
                ...state,
                operationSuccess: false,
        };
    
        case PROJECT_DELETE_SUCCESS:
            return {
                ...state,
                operationSuccess: true,
        };
    
        case PROJECT_DELETE_FAILURE:
            return {
                ...state,
                operationSuccess: false,
        };
    
        case PROJECT_LOAD_SUCCESS:
            return {
                ...state,
                operationSuccess: true,
                currentProjectData: {
                    projectId: payload.projectData.projectId,
                    ownerId: localStorage.getItem("user").id,
                    title: payload.projectData.title,
                    description: payload.projectData.description,
                    pageCount: payload.projectData.pageCount
                },
        };
    
        case PROJECT_LOAD_FAILURE:
            return {
                ...state,
                operationSuccess: false,
        };
    
        case PROJECT_EDIT_SUCCESS:
            return {
                ...state,
                operationSuccess: true,
        };
    
        case PROJECT_EDIT_FAILURE:
            return {
                ...state,
                operationSuccess: false,
        };
    
        case PAGE_ADD_SUCCESS:
            state.currentProjectData.pageCount++;
            return {
                ...state,
                operationSuccess: true,
                currentPageData: {
                    pageId: payload.pageNumber,
                    pageNumber: payload.pageNumber,
                    pageData: payload.pageData
                }
            };

        case PAGE_ADD_FAILURE:
            return {
                ...state,
                operationSuccess: false,
        };
    
        case PAGE_DELETE_SUCCESS:
            return {
                ...state,
                operationSuccess: true,
        };
    
        case PAGE_DELETE_FAILURE:
            return {
                ...state,
                operationSuccess: false,
        };
    
        case PAGE_LOAD_SUCCESS:
            return {
                ...state,
                operationSuccess: true,
                currentPageData: {
                    pageId: payload.pageData.pageNumber,
                    pageNumber: payload.pageData.pageNumber,
                    pageData: payload.pageData.pageData
                }
        };
    
        case PAGE_LOAD_FAILURE:
            return {
                ...state,
                operationSuccess: false,
        };
    
        case PAGE_EDIT_SUCCESS:
            return {
                ...state,
                operationSuccess: true,
        };
    
        case PAGE_EDIT_FAILURE:
            return {
                ...state,
                operationSuccess: false,
        };
        
        default:
            return state;
    }
}