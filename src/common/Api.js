export const serverAddress = "localhost";
export const port = 5158;

// region FileComponents
export async function getFiles(token, folder) {
    const qArg = folder ? `?parentId=${encodeURIComponent(folder)}` : "";

    const result = await apiFetch(`api/content${qArg}`, "GET", null, null, true, token);

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

export async function uploadFile(token, file, folder) {
    const formData = new FormData();

    formData.append("File", file);

    const qArg = folder ? `&CreateDto.ParentId=${encodeURIComponent(folder)}` : "";

    const result = await apiFetch(`api/content?CreateDto.Name=${file.name}${qArg}`, "POST", null, formData, true, token);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, file: data };
}

export async function createFolder(token, name, folder) {
    const requestData = {
        "name": name,
        "parentId": folder
    }

    console.log(requestData);
    const result = await apiFetch(`api/content/folder`, "POST", "application/json", JSON.stringify(requestData), true, token);

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
// endregion

// region Comments
export async function getComments(token, fileId) {
    const result = await apiFetch(`api/content/comments/for-file/${fileId}`, "GET", null, null, true, token);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, comments: data };
}

export async function postComment(token, fileId, comment) {
    const requestData = {
        "fileId": fileId,
        "comment": comment
    }

    const result = await apiFetch('api/content/comments', "POST", "application/json",
        JSON.stringify(requestData), true, token);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, comment: data };
}

export async function updateComment(token, commentId, newComment) {
    const endpoint = `api/content/comments/${commentId}`;

    const result = await apiFetch(endpoint, "PATCH", "application/json", JSON.stringify(newComment), true, token);

    if (!result.success) {
        return result;
    }

    return { success: true };
}

export async function deleteComment(token, commentId) {
    const endpoint = `api/content/comments/${commentId}`;

    const result = await apiFetch(endpoint, "DELETE", null, null, true, token);

    if (!result.success) {
        return result;
    }

    return { success: true };
}
// endregion

// region User
export async function createUser(token, username, email, password, role) {
    const requestData = {
        "username": username,
        "email": email,
        "password": password,
        "role": role,
    }

    const result = await apiFetch('api/user/create-user', "POST", "application/json",
        JSON.stringify(requestData), true, token);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, user: data };
}

export async function getUsers(token) {
    const result = await apiFetch(`api/user/all`, "GET", null, null, true, token);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, users: data };
}

export async function updateUser(token, userId, username, email, role) {
    const requestData = {
        "username": username !== null ? username : null,
        "email": email !== null ? email : null,
        "role": role !== null ? role : null,
    }

    const endpoint = `api/user/${userId}`;

    const result = await apiFetch(endpoint, "PATCH", "application/json", JSON.stringify(requestData), true, token);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, user: data };
}

export async function updateUsername(token, userId, newUsername) {
    const endpoint = `api/user/change-name/${userId}`;

    const result = await apiFetch(endpoint, "PATCH", "application/json", JSON.stringify(newUsername), true, token);

    if (!result.success) {
        return result;
    }

    return { success: true };
}

export async function updateEmail(token, userId, newEmail) {
    const endpoint = `api/user/change-email/${userId}`;

    const result = await apiFetch(endpoint, "PATCH", "application/json", JSON.stringify(newEmail), true, token);

    if (!result.success) {
        return result;
    }

    return { success: true };
}

export async function updateRole(token, userId, newRole) {
    const endpoint = `api/user/change-role/${userId}`;

    const result = await apiFetch(endpoint, "PATCH", "application/json", JSON.stringify({ newRole }), true, token);

    if (!result.success) {
        return result;
    }

    return { success: true };
}

export async function deleteUser(token, userId) {
    const endpoint = `api/user/${userId}`;

    const result = await apiFetch(endpoint, "DELETE", null, null, true, token);

    if (!result.success) {
        return result;
    }

    return { success: true };
}
// endregion

// region Audit Logs
export async function getAuditLogs(token, level) {
    const result = await apiFetch(`api/audit-log?level=${level}`, "GET", null, null, true, token);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, logs: data };
}
// endregion

// region Auth
export async function login(email, password) {
    const result = await apiFetch('api/auth/login', "POST",
        "application/json", JSON.stringify({ email, password }), false, null);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, token: data.token, userInfo: data.userInfo };
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
// endregion

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