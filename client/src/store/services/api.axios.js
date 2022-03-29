import config from "./config";
import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? config.dev_API_URL : config.prod_API_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

export default instance;