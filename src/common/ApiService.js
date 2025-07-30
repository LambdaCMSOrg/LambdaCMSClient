import * as Api from "./Api.js";
import {port, serverAddress} from "./Api.js";

const accessTokenExpireTimeMinutes = 15;

let refreshPromise = null;

export function hasToken() {
    return getAccessToken() !== null;
}

export async function getAllImages() {
    return await Api.getAllImages(await getOrAcquireToken());
}

export async function uploadImage(files) {
    return await Api.uploadImage(await getOrAcquireToken(), files);
}

export async function renameImage(fileId, newFilename) {
    return await Api.renameImage(await getOrAcquireToken(), fileId, newFilename);
}

export async function getThumbnailUrl(fileId) {
    const nowUnixSeconds = Math.floor(Date.now() / 1000);

    if (!getThumbnailUrlData() || getThumbnailUrlData().expiresAt < nowUnixSeconds) {
        const result = await Api.getThumbnailUrl(await getOrAcquireToken(), fileId);

        if (!result.success) {
            return result;
        }

        setThumbnailUrlData(result.expiresAt, result.token);
    }

    return { success: true, url: constructUrl(`file/image/thumbnail/${fileId}?expiresAt=${getThumbnailUrlData().expiresAt}&token=${encodeURIComponent(getThumbnailUrlData().token)}`)};
}

export async function getImageBlobUrl(fileId) {
    return await Api.getImageBlobUrl(await getOrAcquireToken(), fileId);
}

export async function deleteImage(fileId) {
    return await Api.deleteImage(await getOrAcquireToken(), fileId);
}

export async function login(email, password) {
    const result = await Api.login(email, password);

    if (!result.success) {
        return result;
    }

    setRefreshToken(result.refreshToken);
    setAccessToken(result.token);
    setUserId(result.userId);

    setTokenExpireTimestamp(new Date(Date.now() + accessTokenExpireTimeMinutes * 60 * 1000));

    return { success: true };
}

function getAccessToken() {
    return sessionStorage.getItem('accessToken');
}

function setAccessToken(accessToken) {
   sessionStorage.setItem('accessToken', accessToken);
}

function getRefreshToken() {
    return sessionStorage.getItem('refreshToken');
}

function setRefreshToken(refreshToken) {
    sessionStorage.setItem('refreshToken', refreshToken);
}

function getUserId() {
    return sessionStorage.getItem('userId');
}

function setUserId(userId) {
    sessionStorage.setItem('userId', userId);
}

function getThumbnailUrlData() {
    const raw = sessionStorage.getItem("thumbUrlData");
    return raw ? JSON.parse(raw) : null;
}

function setThumbnailUrlData(expiresAt, token) {
    const raw = JSON.stringify({ expiresAt: expiresAt, token: token})
    sessionStorage.setItem('thumbUrlData', raw);
}

function getTokenExpireTimestamp() {
    const raw = sessionStorage.getItem("tokenExpireTimestamp");
    return raw ? new Date(raw) : null;
}

function setTokenExpireTimestamp(timestamp) {
    sessionStorage.setItem("tokenExpireTimestamp", timestamp.toISOString());
}

async function getOrAcquireToken() {
    if (getAccessToken() && !isTokenExpired()) {
        return getAccessToken();
    }
    else if (getUserId() && getRefreshToken()) {
        if (!refreshPromise) {
            refreshPromise = Api.refreshAccessToken(getUserId(), getRefreshToken())
                .then(result => {
                    if (!result.success) {
                        refreshPromise = null;
                        return result;
                    }

                    setTokenExpireTimestamp(new Date(Date.now() + accessTokenExpireTimeMinutes * 60 * 1000));
                    setRefreshToken(result.refreshToken);
                    setAccessToken(result.token);

                    refreshPromise = null;
                    return result.token;
                })
                .catch(err => {
                    console.error("Token refresh failed: ", err);
                    refreshPromise = null;
                    return { success: false };
                });
        }

        return await refreshPromise;
    }

    console.error("Session invalid.")
    return null;
}

function isTokenExpired() {
    if (getTokenExpireTimestamp() === null) {
        return true;
    }

    return getTokenExpireTimestamp() <= Date.now();
}

function constructUrl(endpoint) {
    return `http://${serverAddress}:${port}/${endpoint}`;
}