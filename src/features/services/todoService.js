import axios from "axios";

const http = axios.create({
    baseURL: '/api/react-exam/todos',
    headers: {"Content-Type": 'application/json'}
});

export const getTodos = async () => {
    const {data} = await http.get('/list');
    return data;
};

export const getDetails = async (signature) => {
    const {data} = await http.get(`/${signature}`);
    return data;
};

export const creation = async (insReq) => {
    const {data} = await http.post('', insReq);
    return data;
};

export const modification = async (modReq) => {
    const {data} = await http.put('', modReq);
    return data;
};

export const deletion = async (signature) => {
    const {data} = await http.delete(`/${signature}`);
    return data;
};
