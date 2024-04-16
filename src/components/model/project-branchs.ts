export interface ProjectBranchs {
    name: string;
    branchs: string[];
    children: ProjectBranchs[];
}