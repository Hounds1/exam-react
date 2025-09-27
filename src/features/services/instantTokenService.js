import { connector, setAuth } from './network/axiosSupport.js';

const GENERATE_PATH = "/auth/generate";
const SWAP_PATH = "/auth/swap"

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function generate() {
    const token = await connector.get(GENERATE_PATH);

    if (token.status != 201) {
        const uuid = uuidv4();
        const swap = {
            "token": uuid
        }

        const { res } = await connector.post(SWAP_PATH, swap);
        if (res.status === 200) console.log("Instant token has been swapped.");
        else connector.setAuth(uuid);

        return token;
    }

    setAuth(token);
    return token;
}