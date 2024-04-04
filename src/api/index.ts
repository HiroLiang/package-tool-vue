import request from "./request";

const jsonHeader = { headers: { "Content-Type": "application/json" } }

const reqTest = () => request.get("/", jsonHeader);

export { reqTest }