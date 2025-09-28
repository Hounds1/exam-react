import axios from "axios";

export const connector = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
});

let token = null;
export function setAuth(token) {
    token = token;
}

let onUnauthorized = null;
export function setOnUnauthorized(handler) {
    onUnauthorized = handler;
}

connector.interceptors.request.use((config) => {
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
}, (error) => Promise.reject(normalizeNetworkErrore(error)));

connector.interceptors.response.use(
    (res) => res,
    (error) => {
        const err = normalizeNetworkError(error);
        if (err.status === 401 && typeof onUnauthorized === 'function') {
            try {onUnauthorized(err); } catch {} 
        }

        return Promise.reject(err);
    }
)

function normalizeNetworkError(error) {
    const status = error?.response?.status ?? null;
    const code = error?.code ?? null;
    const data = error?.response?.data ?? null;
    const message = data?.message || error?.message || 'Internal Server Error.';

    const err = new Error(message);
    err.status = status;
    err.code = code;
    err.data = data;

    return err;
}