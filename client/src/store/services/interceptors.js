import axiosInstance from "./api.axios";
import { tokenService } from "./token.service";
import { refreshToken } from "../actions/auth";

const setup = (store) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = tokenService.getLocalAccessToken();
            if (token) {
                config.headers["x-access-token"] = token
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const { dispatch } = store;
    axiosInstance.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            const originalConfig = err.config;
            if (originalConfig.url !== "/auth/login" && err.response) {
                // If access token is expired
                if (err.response.status === 401 && !originalConfig.retry) {
                    originalConfig.retry = true;

                    try {
                        const rs = await axiosInstance.post("/auth/refreshToken", {
                            refreshToken: tokenService.getLocalRefreshToken()
                        });
                        const accessToken = rs.data;
                        dispatch(refreshToken(accessToken));
                        tokenService.updateLocalAccessToken(accessToken);
                        
                        return axiosInstance(originalConfig);

                    } catch (error) {
                        tokenService.removeUser();
                        return Promise.reject(error);
                    }
                }
            }
            return Promise.reject(err);
        }
    );
};



export default setup;