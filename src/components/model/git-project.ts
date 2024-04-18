export interface GitProject {
    id: null | number,
    name: string,
    url: string,
    jdk: string,
    children: null | GitProject[]
}