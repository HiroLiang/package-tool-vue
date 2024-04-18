import { GitProject } from "../components/model/git-project";
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

const reqGetAllProject = () => request.get('/project/all', jsonHeader);

const reqGetProjects = (gitAccount: string) => request.get(`/project/${gitAccount}`, jsonHeader);

const reqCloneProject = (project: string, gitAccount: string) => {
    return request.post(`/project/clone/${project}/${gitAccount}`, jsonHeader);
}

const reqGetBranchList = (projectName: string, gitAccount: string) => {
    return request.get(`/project/branch/${projectName}/${gitAccount}`, jsonHeader);
}

const reqAddProject = (project: GitProject) => {
    return request.post(`/project/add`, project, jsonHeader);
}

const reqEditProject = (project: GitProject): Promise<GitProject[]> => {
    return request.put(`/project/edit/${project.id}`, project, jsonHeader);
}

export {
    // User requests
    reqTest, reqGetUser, reqGetEncryptStr, reqCreateUser, reqUpdateUser,
    // Git requests
    reqGetAllProject, reqGetProjects, reqCloneProject, reqGetBranchList,
    // Project request
    reqAddProject, reqEditProject
}