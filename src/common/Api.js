export const serverAddress = "localhost";
export const port = 5158;

export async function getAllFiles(token) {
    const result = await apiFetch('api/content', "GET", null, null, true, token);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, files: data };
}

export async function queryFiles(token, query) {
    const result = await apiFetch('api/content/query', "POST", "application/json",
        JSON.stringify(query), true, token);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, files: data };
}

export async function getFile(token, fileId) {
    const result = await apiFetch(`api/content/${fileId}`, "GET", null, null, true, token);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, file: data };
}

export async function uploadFile(token, file) {
    const formData = new FormData();

    formData.append("File", file);

    const result = await apiFetch(`api/content?Name=${file.name}`, "POST", null, formData, true, token);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, file: data };
}

export async function renameFile(token, fileId, newFilename) {
    const endpoint = `api/content/${fileId}/rename?newName=${encodeURIComponent(newFilename)}`;

    const result = await apiFetch(endpoint, "PATCH", null, null, true, token);

    if (!result.success) {
        return result;
    }

    return { success: true };
}

export async function deleteFile(token, fileId) {
    const endpoint = `api/content/${fileId}`;

    const result = await apiFetch(endpoint, "DELETE", null, null, true, token);

    if (!result.success) {
        return result;
    }

    return { success: true };
}

export async function getThumbnailUrl(token) {
    const endpoint = `api/content/thumbnail/request-url`;

    const result = await apiFetch(endpoint, "GET", "application/json", null, true, token);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, expiresAt: data.expiresAt, token: data.token };
}

export async function getImageBlobUrl(token, fileId) {
    const endpoint = `file/image/${fileId}`;

    const result = await apiFetch(endpoint, "GET", null, null, true, token);

    if (!result.success) {
        return result;
    }

    const blob = await result.result.blob();
    const url = URL.createObjectURL(blob);

    return { success: true, url: url };
}

export function getVideoHlsStreamUrl(token, fileId) {
    return { success: true, url: constructUrl(`file/video/stream/${fileId}/${fileId}.m3u8`) };
}

export async function login(email, password) {
    const result = await apiFetch('api/auth/login', "POST",
        "application/json", JSON.stringify({ email, password }), false, null);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, token: data.token, refreshToken: data.refreshToken, userId: data.userId };
}

export async function refreshAccessToken(userId) {
    const result = await apiFetch('api/auth/refresh', "POST",
        "application/json", JSON.stringify({ userId }), false, null);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, token: data.token };
}

async function apiFetch(endpoint, method, contentType, body, authorize, token) {
    const headers = {}

    try {
        if (authorize) {
            if (!token) {
                return { success: false, error: "Invalid auth token found" };
            }

            headers["Authorization"] = `Bearer ${token}`;
        }

        if (contentType !== null) {
            headers["Content-Type"] = contentType;
        }

        const res = await fetch(constructUrl(endpoint), {
            method: method,
            headers: headers,
            body: body
        });

        if (!res.ok) {
            return { success: false, error: `HTTP error: ${res.status} ${res.statusText}` };
        }

        return { success: true, result: res };

    } catch (err) {
        console.error(err);
        return { success: false, error: "Network or internal error occurred" };
    }
}

function constructUrl(endpoint) {
    return `http://${serverAddress}:${port}/${endpoint}`;
}