import config from './config';

export const userService = {
    login
};

function login(username, passwordHash) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, passwordHash })
    };

    return fetch(`${config.apiUrl}/api/auth/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and JWT token in session storage
            sessionStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    sessionStorage.removeItem('user');
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                //location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}