export interface GitProject {
    id: number,
    name: string,
    url: string,
    jdk: string,
    children: null | GitProject[]
}