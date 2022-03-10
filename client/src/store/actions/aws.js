import { awsService } from "../services/aws.service";
import {
    AWS_SIGNEDURL_SUCCESS,
    AWS_SIGNEDURL_FAILURE,
    AWS_UPLOAD_SUCCESS,
    AWS_UPLOAD_FAILURE
} from "./types";

export const getSignedUrl = (fileType) => (dispatch) => {
    return awsService.getSignedUrl(fileType)
        .then(
            (response) => {
                dispatch({
                    type: AWS_SIGNEDURL_SUCCESS,
                    payload: response
                });

                return Promise.resolve();
            },
            (error) => {
                dispatch({
                    type: AWS_SIGNEDURL_FAILURE,
                    payload: error
                });

                return Promise.reject();
            }
        )
}

export const updateProfilePic = (url) => (dispatch) => {
    return awsService.updateProfilePic(url)
    .then(
        (response) => {
            dispatch({
                type: AWS_UPLOAD_SUCCESS,
                payload: response
            });

            return Promise.resolve();
        },
        (error) => {
            dispatch({
                type: AWS_UPLOAD_FAILURE,
                payload: error
            });

            return Promise.reject();
        }
    )
}