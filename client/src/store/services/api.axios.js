import config from "./config";
import axios from "axios";

const instance = axios.create({
    baseURL: config.apiUrl,
    headers: {
        "Content-Type": "application/json",
    }
});

export default instance;