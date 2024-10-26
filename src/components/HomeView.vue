<script setup lang="ts">
import { Ref, ref, onBeforeMount } from 'vue';
import { RouterView } from 'vue-router'
import { reqGetUser, reqCreateUser, reqUpdateUser, reqGetProjects, reqGetEncryptStr, reqCloneProject, reqGetBranchList } from '../api';
import { useNotification } from 'naive-ui'
import { ProjectBranchs } from './model/project-branchs';
import NavBar from './parts/NavBar.vue'
import FooterBar from './parts/FooterBar.vue';

const isLoading = ref(false);
const loadingMessage = ref('Loaging...');
const notification = useNotification();


const user: any = ref({id: 0, userName: "", gitAccount: "", accessToken: ""});

const projects: any = ref([]);

const selectedProject: any = ref('');

const branchList: any = ref([]);

onBeforeMount(async () => {
    let id = localStorage.getItem('id');

    if (id != null) {
        user.value = (await reqGetUser(id)).data;
        if(user.value.id != 0)
            projects.value = (await reqGetProjects(user.value.gitAccount)).data;
    } else {
        user.value = { id: 0, userName: "", gitAccount: "", accessToken: "" }
    }

})

const onUpdateUserData = async (data: { userName: string, gitAccount: string, accessToken: string }) => {
    if (data.userName && data.accessToken && data.gitAccount) {
        let nextUser = (await reqCreateUser(data)).data;
        user.value = (await reqUpdateUser(nextUser.id, { id: nextUser.id, userName: data.userName, gitAccount: data.gitAccount, accessToken: data.accessToken })).data;
        let id = (await reqGetEncryptStr(user.value.id + '')).data;
        localStorage.setItem('id', id);
        if(user.value.id != 0)
            projects.value = (await reqGetProjects(user.value.gitAccount)).data;
    }
}

const onNewProject = async (name: string) => {

    isLoading.value = true;
    loadingMessage.value = `Clone Project: ${name}, Loading...`;
    let result = (await reqCloneProject(name, user.value.gitAccount)).data;
    isLoading.value = false;
    loadingMessage.value = 'Loading...';

    if (result == 0) {
        notification.success({
            description: `Clone Project: ${name}`,
            content: 'Success',
            duration: 3000
        })
        projects.value = (await reqGetProjects(user.value.gitAccount)).data;
    }
}

const onSelectProject = async (project: string) => {
    selectedProject.value = project;
    branchList.value = [];
    let dto = (await reqGetBranchList(selectedProject.value, user.value.gitAccount)).data;
    putBranchsValue(dto);
}

const putBranchsValue = (dto: ProjectBranchs) => {
    branchList.value.push({
        name: dto.name,
        list: dto.branchs
    });
    dto.children.forEach(child => {
        putBranchsValue(child);
    }); 
}
</script>
<template>
    <NavBar :user="user" :projects="projects" @update-user-data="onUpdateUserData" @select-project="onSelectProject"
        @new-project="onNewProject" />
    <RouterView :branchList="branchList" :selectedProject="selectedProject" :gitAccount="user.gitAccount" :accessToken="user.accessToken" />
    <div v-if="isLoading" class="overlay-cover">{{ loadingMessage }}</div>
    <FooterBar />
</template>

<style scoped>
.overlay-cover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 10000;

    text-align: center;
    align-content: center;
    user-select: none;
}
</style>