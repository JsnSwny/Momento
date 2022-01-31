import config from './config';

export const projectService = {
    createProject,
    loadProject,
    editProject
};



function createProject(projectTitle, projectDescription, authToken) { 

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "x-access-token": authToken
        },
        body: JSON.stringify({ title: projectTitle, description: projectDescription })
    };

    return fetch(`${config.apiUrl}/api/project`, requestOptions)
        .then(handleResponse)
        .then(res => { return res })
}

function loadProject(projectId, authToken) { 

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "x-access-token": authToken
        }
    };

    return fetch(`${config.apiUrl}/api/project/${projectId}`, requestOptions)
        .then(handleResponse)
        .then(res => { return res })
}

function editProject(projectId, newTitle, newDescription, authToken) { 

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "x-access-token": authToken
        },
        body: JSON.stringify({ projectId: projectId, newTitle: newTitle, newDescription: newDescription })
    };

    return fetch(`${config.apiUrl}/api/project`, requestOptions)
        .then(handleResponse)
        .then(res => { return res })
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}