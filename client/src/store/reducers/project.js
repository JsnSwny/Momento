// import {
//     PAGE_ADD_SUCCESS,
//     PAGE_ADD_FAILURE,
//     PAGE_DELETE_SUCCESS,
//     PAGE_DELETE_FAILURE,
//     PAGE_LOAD_SUCCESS,
//     PAGE_LOAD_FAILURE,
//     PAGE_EDIT_SUCCESS,
//     PAGE_EDIT_FAILURE,
//     PROJECT_CREATE_SUCCESS,
//     PROJECT_CREATE_FAILURE,
//     PROJECT_DELETE_SUCCESS,
//     PROJECT_DELETE_FAILURE,
//     PROJECT_LOAD_SUCCESS,
//     PROJECT_LOAD_FAILURE,
//     PROJECT_EDIT_SUCCESS,
//     PROJECT_EDIT_FAILURE,
// } from "../actions/types";

// const initialState = {
//     operationSuccess: false,
//     currentProjectData: {
//         projectId: -1,
//         ownerId: -1,
//         title: "",
//         description: "",
//         pageCount: 0
//     },
//     currentPageData: {
//         pageId: -1,
//         pageNumber: -1,
//         title: "",
//         pageData: ""
//     },
//     pages: [],
//   };

// export default function (state = initialState, action) {
//     const { type, payload } = action;

//     switch (type) {
//         case PROJECT_CREATE_SUCCESS:
//             return {
//                 ...state,
//                 operationSuccess: true,
//                 currentProjectData: {
//                     projectId: payload.newProjectId,
//                     ownerId: localStorage.getItem("user").id,
//                     title: payload.title,
//                     description: payload.description,
//                     pageCount: 0
//                 },
//         };

//         case PROJECT_CREATE_FAILURE:
//             return {
//                 ...state,
//                 operationSuccess: false,
//         };

//         case PROJECT_DELETE_SUCCESS:
//             return {
//                 ...state,
//                 operationSuccess: true,
//         };

//         case PROJECT_DELETE_FAILURE:
//             return {
//                 ...state,
//                 operationSuccess: false,
//         };

//         case PROJECT_LOAD_SUCCESS:
//             for (let i = 0; i < payload.projectData.pageCount; i++){
//                 state.pages.push({ pageNumber: i + 1, pageTitle: payload.projectData.pageInfo[i].title, pageDescription: payload.projectData.pageInfo[i].description });
//             }

//             return {
//                 ...state,
//                 operationSuccess: true,
//                 currentProjectData: {
//                     projectId: payload.projectData.projectId,
//                     ownerId: localStorage.getItem("user").id,
//                     title: payload.projectData.title,
//                     description: payload.projectData.description,
//                     pageCount: payload.projectData.pageCount
//                 },
//         };

//         case PROJECT_LOAD_FAILURE:
//             return {
//                 ...state,
//                 operationSuccess: false,
//         };

//         case PROJECT_EDIT_SUCCESS:
//             return {
//                 ...state,
//                 operationSuccess: true,
//         };

//         case PROJECT_EDIT_FAILURE:
//             return {
//                 ...state,
//                 operationSuccess: false,
//         };

//         case PAGE_ADD_SUCCESS:
//             state.currentProjectData.pageCount++;
//             state.pages.push({ pageNumber: state.pages.length + 1, pageTitle: payload.newPageData.pageTitle, pageDescription: payload.newPageData.pageDescription });
//             return {
//                 ...state,
//                 operationSuccess: true,
//                 currentPageData: {
//                     pageId: payload.pageNumber,
//                     pageNumber: payload.pageNumber,
//                     title: payload.pageTitle,
//                     pageData: payload.pageData
//                 }
//             };

//         case PAGE_ADD_FAILURE:
//             return {
//                 ...state,
//                 operationSuccess: false,
//         };

//         case PAGE_DELETE_SUCCESS:
//             return {
//                 ...state,
//                 operationSuccess: true,
//         };

//         case PAGE_DELETE_FAILURE:
//             return {
//                 ...state,
//                 operationSuccess: false,
//         };

//         case PAGE_LOAD_SUCCESS:
//             return {
//                 ...state,
//                 operationSuccess: true,
//                 currentPageData: {
//                     pageId: payload.pageData.pageNumber,
//                     pageNumber: payload.pageData.pageNumber,
//                     pageData: payload.pageData.pageData
//                 }
//         };

//         case PAGE_LOAD_FAILURE:
//             return {
//                 ...state,
//                 operationSuccess: false,
//         };

//         case PAGE_EDIT_SUCCESS:
//             return {
//                 ...state,
//                 operationSuccess: true,
//         };

//         case PAGE_EDIT_FAILURE:
//             return {
//                 ...state,
//                 operationSuccess: false,
//         };

//         default:
//             return state;
//     }
// }
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
