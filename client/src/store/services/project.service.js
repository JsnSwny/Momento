import api from "./api.axios";

export const projectService = {
    createProject,
    loadProject,
    editProject
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