import request from "./request";

const jsonHeader = { headers: { "Content-Type": "application/json" } }

const reqTest = () => request.get("/", jsonHeader);

const reqGetUser = (id: string) => request.get(`/user/${id}`, jsonHeader);

const reqGetEncryptStr = (str: string) => request.get(`/user/encrypt/${str}`, jsonHeader);

const reqCreateUser = (user: { userName: string, gitAccount: string, accessToken: string }) => {
    return request.post("/user", user, jsonHeader);
}

const reqUpdateUser = (id: number, user: { id: number, userName: string, gitAccount: string, accessToken: string }) => {
    return request.put(`/user/${id}`, user, jsonHeader);
}

const reqGetProjects = (gitAccount: string) => request.get(`/git/${gitAccount}`, jsonHeader);

const reqNewProject = (project: string, user: { id: number, userName: string, gitAccount: string, accessToken: string }) => {
    return request.post(`/git/${project}`, user, jsonHeader);
}

export {
    // User requests
    reqTest, reqGetUser, reqGetEncryptStr, reqCreateUser, reqUpdateUser,
    //Git requests
    reqGetProjects, reqNewProject
}