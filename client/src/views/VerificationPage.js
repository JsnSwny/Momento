import React from "react";
import {authService} from "../store/services/auth.service";
import { Link } from "react-router-dom";

const VerificationPage = (props) => {

    const token = window.location.pathname.split('/')[3]

    if (token) {
        authService.verifyUser(token);
    }

    return (
    <div className="container">
        <header className="jumbotron">
        <h2>
            <strong>Account confirmed!</strong>
        </h2>
        </header>
        <Link to={"/login"}>Please Login</Link>
    </div>
);
};

export default VerificationPage;