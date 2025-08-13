import * as Api from "./Api.js";
import {port, serverAddress} from "./Api.js";

const accessTokenKey = "accessToken";
const userIdKey = "userId";
const tokenExpireTimestampKey = "tokenExpireTimestamp";
const thumbUrlDataKey = "thumbUrlData";

const accessTokenExpireTimeMinutes = 15;

let refreshPromise = null;

let hasInterval = false;

const subscribers = new Set();

// region Utility
export function subscribe(callback) {
    subscribers.add(callback);

    if (!hasInterval) {
        setInterval(() => {
            getOrAcquireToken().catch(console.error);
        }, 14 * 60 * 1000);

        hasInterval = true;
    }

    // Immediately notify the new subscriber with the current token
    if (hasValidToken()) {
        callback(getAccessToken());
    }

    // Return an unsubscribe function
    return () => {
        subscribers.delete(callback);
    };
}

export function hasValidToken() {
    return getAccessToken() !== null && !isTokenExpired();
}

export function isUserId(id) {
    return getUserId() === id;
}

export async function getToken() {
    return await getOrAcquireToken();
}
// endregion

// region Files
export async function getFiles(folder = null) {
    if (folder === undefined) {
        folder = null;
    }

    return await Api.getFiles(await getOrAcquireToken(), folder);
}

export async function queryFiles(query) {
    return await Api.queryFiles(await getOrAcquireToken(), query);
}

export async function uploadFile(file, folder = null) {
    if (folder === undefined) {
        folder = null;
    }

    return await Api.uploadFile(await getOrAcquireToken(), file, folder);
}

export async function createFolder(name, folder = null) {
    if (folder === undefined) {
        folder = null;
    }

    return await Api.createFolder(await getOrAcquireToken(), name, folder);
}

export async function renameFile(fileId, newFilename) {
    return await Api.renameFile(await getOrAcquireToken(), fileId, newFilename);
}

export async function deleteFile(fileId) {
    return await Api.deleteFile(await getOrAcquireToken(), fileId);
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

    return { success: true, url: constructUrl(`api/content/thumbnail/${fileId}?expiresAt=${getThumbnailUrlData().expiresAt}&token=${encodeURIComponent(getThumbnailUrlData().token)}`)};
}

export async function getImageBlobUrl(fileId) {
    return await Api.getImageBlobUrl(await getOrAcquireToken(), fileId);
}

export async function getVideoHlsStreamUrl(fileId) {
    return Api.getVideoHlsStreamUrl(await getOrAcquireToken(), fileId);
}
// endregion

// region Comments
export async function getComments(fileId) {
    return await Api.getComments(await getOrAcquireToken(), fileId);
}

export async function postComment(fileId, comment) {
    return await Api.postComment(await getOrAcquireToken(), fileId, comment);
}

export async function updateComment(commentId, newComment) {
    return await Api.updateComment(await getOrAcquireToken(), commentId, newComment);
}

export async function deleteComment(commentId) {
    return await Api.deleteComment(await getOrAcquireToken(), commentId);
}
// endregion

// region User/Auth
export async function login(email, password) {
    const result = await Api.login(email, password);

    if (!result.success) {
        return result;
    }

    setAccessToken(result.token);
    setUserId(result.userId);

    setTokenExpireTimestamp(new Date(Date.now() + accessTokenExpireTimeMinutes * 60 * 1000));

    return { success: true };
}
// endregion

// region Getter/Setter
function getAccessToken() {
    return sessionStorage.getItem(accessTokenKey);
}

function setAccessToken(accessToken) {
   sessionStorage.setItem(accessTokenKey, accessToken);
}

function getUserId() {
    return sessionStorage.getItem(userIdKey);
}

function setUserId(userId) {
    sessionStorage.setItem(userIdKey, userId);
}

function getThumbnailUrlData() {
    const raw = sessionStorage.getItem(thumbUrlDataKey);
    return raw ? JSON.parse(raw) : null;
}

function setThumbnailUrlData(expiresAt, token) {
    const raw = JSON.stringify({ expiresAt: expiresAt, token: token})
    sessionStorage.setItem(thumbUrlDataKey, raw);
}

function getTokenExpireTimestamp() {
    const raw = sessionStorage.getItem(tokenExpireTimestampKey);
    return raw ? new Date(raw) : null;
}

function setTokenExpireTimestamp(timestamp) {
    sessionStorage.setItem(tokenExpireTimestampKey, timestamp.toISOString());
}
// endregion

async function getOrAcquireToken() {
    if (getAccessToken() && !isTokenExpired()) {
        return getAccessToken();
    }
    else if (getUserId()) {
        if (!refreshPromise) {
            refreshPromise = Api.refreshAccessToken(getUserId())
                .then(result => {
                    if (!result.success) {
                        refreshPromise = null;
                        return result;
                    }

                    setTokenExpireTimestamp(new Date(Date.now() + accessTokenExpireTimeMinutes * 60 * 1000));
                    setAccessToken(result.token);

                    subscribers.forEach(callback => callback(getAccessToken()));

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