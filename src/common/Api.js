const serverAddress = "localhost";
const port = 5158;

export async function getImages() {
    const result = await apiFetch('api/image', "GET", null, null, true);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, files: data };
}

export async function uploadImage(files) {
    const formData = new FormData();

    for (const file of files) {
        formData.append("Name", file.name);
        formData.append("File", file);
    }

    const result = await apiFetch('api/image', "POST", null, formData, true);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();
    return { success: true, files: Array.isArray(data) ? data : [data]};
}

export async function renameImage(fileId, newFilename) {
    const endpoint = `api/image/${fileId}/rename?newName=${encodeURIComponent(newFilename)}`;

    const result = await apiFetch(endpoint, "PATCH", null, null, true);

    if (!result.success) {
        return result;
    }

    return { success: true };
}

export async function getThumbnailUrl(fileId) {
    const endpoint = `file/image/thumbnail/request-url`;

    const result = await apiFetch(endpoint, "GET", null, null, true);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    return { success: true, url: constructUrl(`file/image/thumbnail/${fileId}?expiresAt=${data.expiresAt}&token=${encodeURIComponent(data.token)}`)};
}

export async function getImageBlobUrl(fileId) {
    const endpoint = `file/image/${fileId}`;

    const result = await apiFetch(endpoint, "GET", null, null, true);

    if (!result.success) {
        return result;
    }

    const blob = await result.result.blob();
    const url = URL.createObjectURL(blob);

    return { success: true, url: url };
}

export async function deleteImage(fileId) {
    const endpoint = `api/image/${fileId}`;

    const result = await apiFetch(endpoint, "DELETE", null, null, true);

    if (!result.success) {
        return result;
    }

    return { success: true };
}

export async function login(email, password) {
    const result = await apiFetch('api/auth/login', "POST", "application/json", JSON.stringify({ email, password }), false);

    if (!result.success) {
        return result;
    }

    const data = await result.result.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);

    return { success: true };
}

async function apiFetch(endpoint, method, contentType, body, authorize) {
    const headers = {}

    try {
        let token;

        if (authorize) {
            token = getToken();

            if (!token) {
                return { success: false, error: "No auth token found" };
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

function getToken() {
    return localStorage.getItem("token");
}

function constructUrl(endpoint) {
    return `http://${serverAddress}:${port}/${endpoint}`;
}