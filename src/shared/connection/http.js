import axios from 'axios'
import { renderToStaticMarkup } from 'react-dom/server'

export const http = axios.create({
    baseURL: '/api/react-exam/',
    timeout: 10000,
    headers: {contentType: 'application/json'}
})

// Http Error Logging Handle
http.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error('[HTTP ERROR]', err?.resopnse?.status, err?.message);
        return Promise.reject(err);
    }
);