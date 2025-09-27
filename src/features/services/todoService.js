import { connector } from './network/axiosSupport.js';

const TODO_PATH = "/todos";

export async function listTodos(params = {}) {
    const { data } = await connector.get(TODO_PATH, { params })
    return Array.isArray(data) ? { items: data, total: data.length } : data;
}

export async function details(id) {
    const { data } = await connector.get(`${TODO_PATH}/${id}`)
    return data;
}

export async function create(req) {
    const { data } = await connector.post(TODO_PATH, req);
    return data;
}

export async function modify(id, patch) {
    const { data } = await connector.patch(`${TODO_PATH}/${id}`, patch);
    return data; 
}

export async function remove(id) {
    const { data } = await connector.delete(`${TODO_PATH}/${id}`);
    return data;
}