<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { RouterView } from 'vue-router'
import { reqGetUser, reqCreateUser, reqUpdateUser, reqGetProjects, reqGetEncryptStr, reqNewProject } from '../api';
import { useNotification } from 'naive-ui'
import NavBar from './NavBar.vue'

const isLoading = ref(false);
const loadingMessage = ref('Loaging...');
const notification = useNotification();


const user: any = ref({});

const projects: any = ref([]);

onBeforeMount(async () => {
    let id = localStorage.getItem('id');

    if (id != null) {
        user.value = (await reqGetUser(id)).data;
        projects.value = (await reqGetProjects(user.value.gitAccount)).data;
        console.log(projects.value);
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
        projects.value = (await reqGetProjects(user.value.gitAccount)).data;
    }
}

const onNewProject = async (name: string) => {

    isLoading.value = true;
    loadingMessage.value = `Clone Project: ${name}, Loading...`;
    let result = (await reqNewProject(name, user.value)).data;
    isLoading.value = false;
    loadingMessage.value = 'Loading...';
    console.log(result);

    if (result == 0) {
        notification.success({
            description: `Clone Project: ${name}`,
            content: 'Success',
            duration: 3000
        })
        projects.value = (await reqGetProjects(user.value.gitAccount)).data;
    }
}

const onSelectProject = (project: string) => {
    console.log(project);

}

const test = () => {
    // localStorage.removeItem("id");
    isLoading.value = true;
}
</script>
<template>
    <NavBar :user="user" :projects="projects" @update-user-data="onUpdateUserData" @select-project="onSelectProject"
        @new-project="onNewProject" />
    <RouterView />
    <button style="margin-top: 64px;" @click="test">press</button>
    <div v-if="isLoading" class="overlay-cover">{{ loadingMessage }}</div>
</template>

<style scoped>
.overlay-cover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 999;

    text-align: center;
    align-content: center;
    user-select: none;
}
</style>