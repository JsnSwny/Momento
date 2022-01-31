import config from './config';

export const userService = {
    loadUserData
};

function loadUserData(userId, authToken) { 

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "x-access-token": authToken
        }
    };

    return fetch(`${config.apiUrl}/api/user/${userId}`, requestOptions)
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