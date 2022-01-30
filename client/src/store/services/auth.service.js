import config from './config';

export const authService = {
    login,
    register,
    verifyUser
};

function register(username, firstName, lastName, emailAddress, passwordHash) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, firstName, lastName, emailAddress, passwordHash })
    };

    return fetch(`${config.apiUrl}/api/auth/register`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function verifyUser(token) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return fetch(`${config.apiUrl}/api/verify/${token}`, requestOptions)
        .then(handleResponse)
        .then(res => { return res })
}

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
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    localStorage.removeItem('user');
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