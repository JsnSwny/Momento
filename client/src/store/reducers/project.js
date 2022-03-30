import { canvasFunctions } from "../../components/project/CanvasFunctions";

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
  PROJECT_INITCANVASCONNECTION_SUCCESS,
  PROJECT_INITCANVASCONNECTION_FAILURE,
  PROJECT_EDITINGSTATUSUPDATE_SUCCESS,
  PROJECT_EDITINGSTATUSUPDATE_FAILURE,
  ADD_PAGE,
  UPDATE_PAGE,
  SET_ACTIVE_PAGE,
  SET_EDITING_PAGE,
  DELETE_PAGE,
  PROJECT_EXPORT_SUCCESS,
  PROJECT_EXPORT_FAILURE,
} from "../actions/types";

const initialState = {
  // pages: [
  //   { id: 1, title: "Page 1" },
  //   { id: 2, title: "Page 2" },
  //   { id: 3, title: "Page 3" },
  //   { id: 4, title: "Page 4" },
  //   { id: 5, title: "Page 5" },
  // ],
  currentPage: 2,
  editingPage: null,

  operationSuccess: false,
  currentProjectData: {
    projectId: -1,
    ownerId: -1,
    title: "",
    description: "",
    pageCount: 0,
  },
  currentPageData: {
    pageId: -1,
    pageNumber: -1,
    title: "",
    pageData: "",
  },
    pages: [],
    canvasRealtimeConnection: false,
    canvasConnection: null,
    movingPage: false,
    images: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_CREATE_SUCCESS:
      return {
        ...state,
        operationSuccess: true,
        currentProjectData: {
          projectId: action.payload.newProjectId,
          ownerId: localStorage.getItem("user").id,
          title: action.payload.title,
          description: action.payload.description,
          pageCount: 0,
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
      state.pages = [];
      for (let i = 0; i < action.payload.projectData.pageCount; i++) {
        state.pages.push({
          pageNumber: i + 1,
          pageTitle: action.payload.projectData.pageInfo[i].title,
          pageDescription: action.payload.projectData.pageInfo[i].description,
        });
      }
      return {
        ...state,
        operationSuccess: true,
        currentProjectData: {
          projectId: action.payload.projectData.projectId,
          ownerId: localStorage.getItem("user").id,
          title: action.payload.projectData.title,
          description: action.payload.projectData.description,
          pageCount: action.payload.projectData.pageCount,
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
        currentProjectData: {
          ...state.currentProjectData,
          title: action.payload.title,
          description: action.payload.description
        }
      };

    case PROJECT_EDIT_FAILURE:
      return {
        ...state,
        operationSuccess: false,
      };

      case PROJECT_EDITINGSTATUSUPDATE_SUCCESS:
        return {
            ...state,
            operationSuccess: true,
    };

    case PROJECT_EDITINGSTATUSUPDATE_FAILURE:
    
        return {
            ...state,
            operationSuccess: false,
    };

    case PROJECT_INITCANVASCONNECTION_SUCCESS:
        return {
            ...state,
            operationSuccess: true,
            canvasRealtimeConnection: true,
    };

    case PROJECT_INITCANVASCONNECTION_FAILURE:
        return {
            ...state,
            operationSuccess: false,
          };
      
    case PROJECT_EXPORT_SUCCESS:
        return {
            ...state,
            operationSuccess: true,
            images: action.payload.images
    };

    case PROJECT_EXPORT_FAILURE:
        return {
            ...state,
            operationSuccess: false,
    };
      
    case PAGE_ADD_SUCCESS:
      state.currentProjectData.pageCount++;
      state.pages.push({
        pageNumber: state.pages.length + 1,
        pageTitle: action.payload.newPageData.pageTitle,
        pageDescription: action.payload.newPageData.pageDescription,
      });
      return {
        ...state,
        operationSuccess: true,
        currentPageData: {
          pageId: action.payload.pageNumber,
          pageNumber: action.payload.pageNumber,
          title: action.payload.pageTitle,
          pageData: action.payload.pageData,
        },
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
          pageId: action.payload.pageData.pageNumber,
          pageNumber: action.payload.pageData.pageNumber,
          pageData: action.payload.pageData.pageData,
        },
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
      
          case "UPDATE_PAGES":
            return {
                ...state,
                pages: action.payload,
          };
      
    default:
      return state;
  }
};
