import api from "./api.axios";

export const canvasService = {
    addPage,
    deletePage,
    loadPage,
    editPage
};

function addPage(projectId, newPageNumber, pageTitle, pageDescription) {
    
    return api.post("/page", {
        projectId,
        newPageNumber,
        pageTitle,
        pageDescription
    })
}

function deletePage(projectId, pageNumber) { 
    return api.delete(`/page/${projectId}/${pageNumber}`, {
    })
}

function loadPage(projectId, pageNumber) { 
    return api.get(`/page/${projectId}/${pageNumber}`)
}

function editPage(projectId, pageNumber, newPageData) { 
    return api.put("/page", {
        projectId,
        pageNumber,
        newPageData
    })
}