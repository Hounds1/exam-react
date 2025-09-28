import { connector } from './network/axiosSupport.js';

const TODO_PATH = "/todos";

export async function listTodos(params = {}) {
    const { data } = await connector.get(`${TODO_PATH}/list`, { params })

    const items = Array.isArray(data?.data) ? data.data : [];
    const total = typeof data?.size === 'number' ? data.size : items.length;
  
    return { items, total };
}

export async function details(id) {
    const { data } = await connector.get(`${TODO_PATH}/${id}`)
    return data;
}

export async function create(req) {
    const { data } = await connector.post(TODO_PATH, req);
    return data;
}

export async function complete(signature) {
    const { data } = await connector.patch(`${TODO_PATH}/${signature}/complete`);
    return data;
}

export async function incomplete(signature) {
    const { data } = await connector.patch(`${TODO_PATH}/${signature}/incomplete`);
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