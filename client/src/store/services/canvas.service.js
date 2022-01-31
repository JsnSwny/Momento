import config from './config';

export const canvasService = {
    addPage,
    deletePage,
    loadPage,
    editPage
};

function addPage(projectId, pageNumber, authToken) { 

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "x-access-token": authToken
        },
        body: JSON.stringify({ projectId: projectId, newPageNumber: pageNumber })
    };

    return fetch(`${config.apiUrl}/api/page`, requestOptions)
        .then(handleResponse)
        .then(res => { return res })
}

function deletePage(projectId, pageNumber, authToken) { 

    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "x-access-token": authToken
        },
        body: JSON.stringify({ projectId: projectId, pageNumber: pageNumber })
    };

    return fetch(`${config.apiUrl}/api/page`, requestOptions)
        .then(handleResponse)
        .then(res => { return res })
}

function loadPage(projectId, pageNumber, authToken) { 

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "x-access-token": authToken
        }
    };

    return fetch(`${config.apiUrl}/api/page/${projectId}/${pageNumber}`, requestOptions)
        .then(handleResponse)
        .then(res => { return res })
}

function editPage(projectId, pageNumber, newPageData, authToken) { 

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "x-access-token": authToken
        },
        body: JSON.stringify({ projectId: projectId, pageNumber: pageNumber, newPageData: newPageData })
    };

    return fetch(`${config.apiUrl}/api/page`, requestOptions)
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