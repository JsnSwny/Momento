import config from './config';

export const userService = {
    loadUserData
};

function loadUserData(userId, username, authToken) { 

    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "x-access-token": authToken
        }
    };

    requestOptions.body = username === -1 ? JSON.stringify({ userId }) : JSON.stringify({ userId, username });

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