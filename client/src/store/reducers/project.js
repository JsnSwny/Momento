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
  };

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case PROJECT_CREATE_SUCCESS:
            return {
                ...state,
                operationSuccess: true,
                newProjectId: payload.newProjectId,
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
                projectData: payload.projectData,
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
            return {
                ...state,
                operationSuccess: true,
                newPageNumber: payload,
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
                pageData: payload.pageData,
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