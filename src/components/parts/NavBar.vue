<script setup lang="ts">
import { ref, PropType, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NInput, NButton } from 'naive-ui'
import { reqGetAllProject } from '../../api';
import { GitProject } from '../model/git-project.ts';

const router = useRouter();

const emit = defineEmits(['update-user-data', 'select-project', 'new-project'])

const unuseds = ref(['dap-api']);

// User Data
const hasUser = ref(false);
const isSettingUser = ref(false);
const user = ref({ userName: '', gitAccount: '', accessToken: '' });

// Project Data
const currenProject: any = ref(null);
const isSelecting = ref(false);
const isShowProjectBox = ref(false);

// cms
const isCms = ref(false);

// Define Props
const props = defineProps({
    user: {
        type: Object as PropType<{
            id: number,
            userName: string,
            gitAccount: string,
            accessToken: string
        }>,
        required: true
    },
    projects: {
        type: Object as PropType<[{
            name: string
        }]>,
        required: true
    }
})

const updateUserData = () => {
    isSettingUser.value = false;
    emit('update-user-data', user.value);
}

const showProjectBox = () => {
    isShowProjectBox.value = true;
}

const newProjet = (name: string) => {
    isShowProjectBox.value = false;
    emit('new-project', name);
}

watch(isCms, () => {
    if(isCms.value){
        router.replace({name:'cms'})
    } else {
        router.replace({name:'branchList'})
        if(currenProject.value != null)
            emit('select-project', currenProject.value);
    }
});

watch(isSettingUser, () => {
    if (isSettingUser.value && hasUser.value) {
        user.value.userName = props.user.userName;
        user.value.gitAccount = props.user.gitAccount;
        user.value.accessToken = props.user.accessToken;
    }
});

watch(currenProject, () => {
    emit('select-project', currenProject.value);
});

watch(props, async () => {
    if (props.user.id > 0) {
        hasUser.value = true;
        user.value.userName = props.user.userName;
        user.value.gitAccount = props.user.gitAccount;
        user.value.accessToken = props.user.accessToken;
    } else {
        hasUser.value = false;
    }

    unuseds.value = [];
    let allproj: GitProject[] = (await reqGetAllProject()).data;
    allproj.forEach(p => {
        unuseds.value.push(p.name);
    });

    if (props.projects.length > 0) {
        props.projects.forEach(p => {
            let i = unuseds.value.indexOf(p.name);
            if (i != -1)
                unuseds.value.splice(i, 1);
        });
    }
});

onMounted(() => {
    router.replace({name:'branchList'})
    if (props.user.id > 0) {
        hasUser.value = true;
        user.value.userName = props.user.userName;
        user.value.gitAccount = props.user.gitAccount;
        user.value.accessToken = props.user.accessToken;
    } else {
        hasUser.value = false;
    }
});

</script>
<template>
    <div class="navbar">
        <div style="display: flex; justify-content: center; align-items: center;">
            <div class="project-selector" v-if="hasUser" @click="isSelecting = !isSelecting">
                <h1 v-if="currenProject == null">請選擇專案</h1>
                <h1 v-else>{{ currenProject }}</h1>
                <img v-if="!isSelecting" class="select-arrow" src="/src/assets/images/icons/right-arrow-svgrepo-com.svg" alt="選擇專案">
                <img v-if="isSelecting" class="select-arrow" src="/src/assets/images/icons/down-arrow-svgrepo-com.svg" alt="選擇專案">
                <div class="project-list" v-show="isSelecting">
                    <div>
                        <ul>
                            <li v-for="project in props.projects" @click="currenProject = project.name">
                                {{ project.name }}
                            </li>
                            <li @click="showProjectBox">
                                <img style="height: 12px; width: 12px;"
                                     src="/src/assets/images/icons/add-circle-outline.svg" alt="設定">
                                新增專案
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="project-selector" v-else>
                <h1 style="opacity: 0.5;">請選擇專案</h1>
                <img class="select-arrow" style="opacity: 0.5;" src="/src/assets/images/icons/right-arrow-svgrepo-com.svg" alt="選擇專案">
            </div>
            <n-button round color="#a7a8bd" size="tiny" ghost style="margin-left: 12px;" @click="isCms = !isCms">{{ isCms ? `包版` : `管理` }}</n-button>
        </div>
        <div class="role-selector">
            <div v-if="hasUser" style="color: #a7a8bd; font-weight: bolder;">
                <p>使用者： No.{{ props.user.id + ' ' + props.user.userName }}</p>
            </div>
            <div v-else>
                <p style="color: #a7a8bd; font-weight: bolder;">請設定使用者：</p>
            </div>
            <div class="setting-button" @click="isSettingUser = !isSettingUser">
                <img class="setting-icon" src="/src/assets/images/icons/settings-outline.svg" alt="設定">
            </div>
            <div v-show="isSettingUser" class="user-input" @blur="isSettingUser = false">
                姓名：
                <n-input size="small" type="text" v-model:value="user.userName" round placeholder="請輸入姓名" />
                GitLab帳號：
                <n-input size="small" type="text" v-model:value="user.gitAccount" round placeholder="請輸入使用者帳號" />
                Access Token：
                <n-input size="small" type="password" show-password-on="mousedown" v-model:value="user.accessToken"
                    round placeholder="請輸入 Token" style="margin-bottom: 12px;" />
                <n-button  round type="info" style="margin-right: 12px;" @click="updateUserData">確認</n-button>
                <n-button  round type="error" @click="isSettingUser = false">取消</n-button>
            </div>
            <div v-show="isSettingUser" class="overlay" @click="isSettingUser = false"></div>
        </div>
    </div>
    <div class="project-box" v-if="isShowProjectBox">
        <div class="projects-in-box">
            <ul>
                <li v-for="unused in unuseds" :key="unused" @click="newProjet(unused)">{{ unused }}</li>
                <li v-show="unuseds.length == 0">無更多專案</li>
            </ul>
        </div>
    </div>
    <div v-if="isShowProjectBox" class="overlay" @click="isShowProjectBox = false"></div>
</template>
<style scoped>
.navbar {
    padding-left: 2%;
    padding-right: 2%;
    width: 100%;
    height: 64px;
    background-color: #142334;

    position: fixed;
    top: 0;
    left: 0;

    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box
}

.project-selector {
    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
}

.project-selector>h1 {
    margin-right: 12px;
    font-size: 24px;

    user-select: none;
    font-weight: bolder;
    color: #a7a8bd;
}

.select-arrow {
    width: 12px;
    height: 12px;

    cursor: pointer;
}

.project-list {
    position: fixed;
    top: 68px;
    left: 3%;
    padding: 16px;

    height: auto;
    width: 600px;
    background-color: #142334;
    border-radius: 10px;

    display: flex;
    align-items: center;
    justify-content: center;
}

.project-list>div {
    height: 100%;
    width: 100%;
    background-color: #142334;
}

.project-list>div>ul {
    list-style-type: none;
}

.project-list>div>ul>li {
    height: 28px;
    line-height: 28px;

    padding-left: 12px;
    padding-right: 12px;
    margin-bottom: 2px;

    color: #a7a8bd;
}

.project-list>div>ul>li:hover {
    background-color: rgb(178, 193, 211);
    color: #142334;
}

.role-selector {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.role-selector>div {
    margin-right: 12px;
}

.setting-button {
    width: 28px;
    height: 28px;
    background-color: rgb(194, 193, 193);
    border-radius: 5px;
    border: 1px double rgb(120, 120, 120);

    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
}

.setting-button:hover {
    background-color: rgb(161, 161, 161);
}

.setting-icon {
    width: 90%;
    height: 90%;
}

.user-input {
    position: fixed;
    z-index: 1000;
    top: 68px;
    right: 5%;

    width: 250px;
    height: 250px;
    background-color: #142334;
    border-radius: 10px;
    border: #a7a8bd double;
    padding: 32px;

    color: #d3d3ee;

}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 999;
}

.project-box {
    position: fixed;
    z-index: 1000;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;

    width: 200px;
    height: auto;
    padding: 12px;
    border-radius: 5px;
    background-color: #142334;
}

.projects-in-box {
    width: 100%;
    height: 100%;
    border-radius: 2px;
}

.projects-in-box>ul {
    list-style-type: none;
}

.projects-in-box>ul>li {
    line-height: 28px;
    text-align: center;
    font-weight: bold;
    color: #a7a8bd;
    border-radius: 2px;

    cursor: pointer;
    user-select: none
}

.projects-in-box>ul>li:hover {
    background-color: rgb(178, 193, 211);
    color: #142334;
}
</style>