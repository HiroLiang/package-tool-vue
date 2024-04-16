<script setup lang="ts">
import { ref, Ref, onMounted } from 'vue';
import { reqGetAllProject } from '../api';
import { NTable, NButton, NInput, NDropdown, NInputGroup, NInputGroupLabel } from 'naive-ui';
import { GitProject } from './model/git-project';

// parent projects
const allProjects: Ref<GitProject[]> = ref([]);

// curren edited project
const currenEdit: Ref<GitProject> = ref({id:0, name: '', jdk: '', url: '', children: null});
const currentEditName: Ref<string> = ref('');

const currentJdkProject: any = ref({});

// Java version options
const javaVersion = [
    {label: 'OpenJDK 8', key: 'JAVA8'},
    {label: 'OpenJDK 11', key: 'JAVA11'},
    {label: 'OpenJDK 17', key: 'JAVA17'}
]

const openEdit = (project: GitProject) => {
    if(currentEditName.value == project.name){
        currentEditName.value = '';
        currenEdit.value = {id:0, name: '', jdk: '', url: '', children: null};
    } else {
        currentEditName.value = project.name;
        copyProject(currenEdit.value, project)
    } 
    console.log(currenEdit.value);
}

const copyProject = (newProject: GitProject, oldProjext: GitProject): GitProject => {
    newProject.id = oldProjext.id;
    newProject.name = oldProjext.name;
    newProject.jdk = oldProjext.jdk;
    newProject.url = oldProjext.url;
    if(oldProjext.children != null){
        oldProjext.children.forEach(child => {
            if(newProject.children == null)
                newProject.children = [];

            let tempProject = {id:0, name: '', jdk: '', url: '', children: null};
            newProject.children.push(copyProject(tempProject, child));
        })
    }
    return newProject;
}

const getLabel = (jdk: string): string => {
    let result = '';
    javaVersion.forEach(v => {
        if(v.key == jdk)
            result = v.label;
    })
    return result;
}

const newModule = () => {
    if(currenEdit.value.children != null){
        currenEdit.value.children.push({id:0, name: '', jdk: '', url: '', children: []});
    }
}

const preSetJdkProject = (project: GitProject) => {
    currentJdkProject.value = project
}

const handleSelect = (key: string ) => {
    currentJdkProject.value.jdk = key;
}

onMounted(async () => {
    allProjects.value = (await reqGetAllProject()).data;
    currenEdit.value = {id:0, name: '', jdk: '', url: '', children: null};
});

</script>
<template>
    <div class="cms-page">
        <div class="table-container">
            <n-table single-column :single-line="false" size="small">
                <thead>
                    <tr>
                        <th style="border-radius: 5px 0 0 0 ;">No.</th>
                        <th>專案名稱</th>
                        <th>JDK</th>
                        <th style="border-radius: 0 5px 0 0 ;">詳細</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="project in allProjects" :key="project.id">
                        <tr>
                            <td>{{ project.id }}</td>
                            <td>{{ project.name }}</td>
                            <td>{{ project.jdk }}</td>
                            <td>
                                <n-button color="#142334" round ghost @click="openEdit(project)">
                                    修改
                                </n-button>
                            </td>
                        </tr>
                        <tr v-if="currentEditName == project.name">
                            <td  colspan="4" class="edit-row">
                                <div class="edit-area">
                                    <div style="display: flex; justify-content: space-between;align-items: center;">
                                        <p>
                                            專案名稱 :
                                            <n-input type="text" v-model:value="currenEdit.name"/>
                                        </p>
                                        <p>
                                            JDK 版本 :
                                            <n-dropdown trigger="click" :options="javaVersion" @select="handleSelect">
                                                <n-button @mouseover="preSetJdkProject(currenEdit)">{{ getLabel(currenEdit.jdk) }}</n-button>
                                            </n-dropdown>
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            Git URL :
                                            <n-input-group>
                                                <n-input-group-label>https://</n-input-group-label>    
                                                <n-input type="text" v-model:value="currenEdit.url"/>
                                            </n-input-group>
                                            </p>
                                    </div>
                                    <div v-for="mpdule in currenEdit.children" :key="mpdule.id" class="project-module">
                                        <div style="display: flex; justify-content: space-between;align-items: center;">
                                            <p>
                                                子專案名稱 :
                                                <n-input type="text" v-model:value="mpdule.name"/>
                                            </p>
                                            <p>
                                                JDK 版本 :
                                                <n-dropdown trigger="click" :options="javaVersion" @select="handleSelect">
                                                    <n-button @mouseover="preSetJdkProject(mpdule)">{{ getLabel(mpdule.jdk) }}</n-button>
                                                </n-dropdown>
                                            </p>   
                                            <p></p>
                                        </div>
                                        <div>
                                            <p>
                                                Git URL :
                                                <n-input-group>
                                                    <n-input-group-label>https://</n-input-group-label>    
                                                    <n-input type="text" v-model:value="mpdule.url"/>
                                                </n-input-group>
                                                </p>
                                        </div>
                                    </div>
                                    <div class="new-project-module" @click="newModule">
                                        <p>+</p>
                                    </div>
                                    <div style="display: flex; justify-content:center; align-items: center;">
                                        <n-button round color="#375881" size="tiny" ghost style="margin-top: 4px; margin-right: 4px;" @click="">
                                            更新
                                        </n-button>
                                        <n-button round color="#375881" size="tiny" ghost style="margin-top: 4px; margin-left: 4px;" @click="openEdit(project)">
                                            取消
                                        </n-button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </n-table>
            <div class="button-container">
                <n-button round color="#375881" size="tiny" ghost style="margin-left: 12px;" @click="">新增專案</n-button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.cms-page{
    display: flex;
    justify-content: center;
    align-items: center;

    padding-top: 55px;
    height: 80vh;
    width: 100%;
    background-color: #f1f5f7;
}

.table-container{
    height: 85%;
    width: 80%;
    padding: 12px;

    overflow: auto;
    background-color: #d9e0e8;
    border-radius: 15px;

    overflow: auto;
}

.table-container thead>tr>th{
    padding-left: 12px;
    background-color: #375881;
    color: #a7a8bd;
}

.table-container tbody>tr>td{
    background-color: #eef2f7;
}

::-webkit-scrollbar {
    display: none;
}

.edit-row{
    width: 100%;
}

.edit-area{
    padding-top: 12px;
    padding-left: 10%;
    padding-right: 10%;
    padding-bottom: 12px;

    background-color: #dde2eb;
}

.edit-area>div{
    margin-top: 8px;
}

.project-module{
    border: 2px dotted #375881;
    padding: 5%;
}

.new-project-module{
    border: 2px dotted #375881;
    padding: 5px;
    height: 12px;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
}
.new-project-module:hover{
    background-color: #a9b9cb;
}

.button-container{
    width: 100%;
    margin-top: 8px;

    display: flex;
    justify-content: center;
    align-items: center;
}
</style>