import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyUser } from "../store/actions/auth"

const VerificationPage = () => {

    const dispatch = useDispatch();
    const token = window.location.pathname.split('/')[3]

    useEffect(() => {
        dispatch(verifyUser(token))
    }, [token]);

    const message = useSelector(state => state.message.message)

    return (
    <div className="container">
        {message === "Account verified" && (
            <div>
            <header className="jumbotron">
            <h2>
                <strong>Account confirmed!</strong>
            </h2>
            </header>
            <Link to={"/login"}>Please Login</Link>
            </div>
        )}
        {message !== "Account verified" && (
            <div>
            <header className="jumbotron">
            <h2>
                <strong>Invalid token or URL</strong>
            </h2>
            </header>
            </div>
        )}
    </div>
);
};

export default VerificationPage;