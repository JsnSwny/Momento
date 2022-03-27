import { awsService } from "../services/aws.service";
import {
    AWS_SIGNEDURL_SUCCESS,
    AWS_UPLOAD_SUCCESS
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
        }
    )
}

export const deleteProfilePic = () => (dispatch) => {
    return awsService.deleteProfilePic()
    .then(
        (response) => {
            dispatch({
                type: AWS_UPLOAD_SUCCESS,
                payload: response
            });

            return Promise.resolve();
        }
    )
}

export const uploadImage = (url) => (dispatch) => {
    return awsService.updateProfilePic(url)
    .then(
        (response) => {
            dispatch({
                type: AWS_UPLOAD_SUCCESS,
                payload: response
            });

            return Promise.resolve();
        }
    )
}