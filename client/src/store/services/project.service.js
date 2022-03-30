import api from "./api.axios";

export const projectService = {
    createProject,
    loadProject,
    editProject,
    initCanvasConnection,
    stillHere,
    exportProject,
    updateTitleDesc
};

function createProject(title, description) { 
    return api.post("/project", {
        title,
        description
    })
}

function loadProject(projectId) { 
    return api.get(`/project/${projectId}`)
}

function editProject(projectId, newTitle, newDescription) { 
    return api.put("/project", {
        projectId,
        newTitle,
        newDescription
    })
}

function initCanvasConnection(projectId, pageNumber) { 
    return api.post(`/projectCanvasConnection`, {
        projectId,
        pageNumber
    })
}

function stillHere(projectId, pageNumber) { 
    return api.post(`/project/${projectId}`, {
        projectId,
        pageNumber
    })
}

function exportProject(projectId, pageNumber) { 
    return api.get(`/project/export/${projectId}`, {
        projectId
    })
}

function updateTitleDesc(projectId, title, description) {
    return api.post(`/project/update/${projectId}`, {
        title,
        description
    })
}