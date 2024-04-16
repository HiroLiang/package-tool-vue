<script setup lang="ts">
import { ref, watch, PropType, Ref } from 'vue'
import { NButton, useNotification, useDialog } from 'naive-ui';

const dialog = useDialog();
const notification = useNotification();

const isLoading = ref(false);

const serverMsg: Ref<string[]> = ref([]);
const messageBox: any = ref(null);

const search: Ref<string[]> = ref([]);

const selected: Ref<string[]> = ref([]);

const props = defineProps({
    branchList:{
        type: Object as PropType<[{
            name: string,
            list: string[]
        }]>,
        required: true
    },
    selectedProject:{
        type: String,
        required: true
    },
    gitAccount:{
        type: String,
        required: true
    },
    accessToken:{
        type: String,
        required: true
    }
})

watch(props, () => {
    search.value = [];
    props.branchList.forEach(() => {
        search.value.push('');
    })
})

const isSelected = (name: string, index: number) => {
    if(name == selected.value[index])
        return 'background-color: #e7ebec;';
    return '';
}

const confirmSelect = () => {
    if(selected.value.length != props.branchList.length)
        return;
    
    checkBranch(0);
    
}

const checkBranch = (c: number) => {
    let result = false;
    let project = props.branchList[c];
    let branch = selected.value[c];
    
    dialog.info({
        title: `確認 ${project.name} 分支`,
        content: `${branch}`,
        positiveText: '確認',
        negativeText: '取消',
        onPositiveClick: () => {    
            if(c < props.branchList.length - 1)
                result = checkBranch(c + 1);
            if(c == props.branchList.length - 1){
                let branchs: string[] = [];
                branchs.push('compile')
                branchs.push(props.selectedProject);
                branchs.push(props.gitAccount);
                let objs = [];
                for(let i = 0 ; i < selected.value.length ; i ++){
                    objs.push({
                        name: props.branchList[i].name,
                        branch: selected.value[i].replace('origin/', '')
                    });
                }
                branchs.push(btoa(JSON.stringify(objs)));
                socket.send(branchs.join(',split,'));
                isLoading.value = true;
            }
        },
        onNegativeClick: () => {
            result = false;
            notification.warning({
                description: '取消包版',
                duration: 1000
            })
        }
    });
    return result;
}

const scrollBox = () => {
    if(messageBox.value){
        messageBox.value.scroll({
            top: messageBox.value.scrollHeight,
            way: 'instant'
        })

    }
    
}

// -----------------------------------------------------------------------------------------

const socket = new WebSocket('ws://localhost:8080/compiler');

socket.onopen = (event) => {
    socket.send("Project : " + props.selectedProject);
}

socket.onmessage = function(event) {
    if(event.data == 'y'){
        isLoading.value = false;
        serverMsg.value = []; 
        notification.success({
            description: '包版完成',
            duration:3000
        });
        return;
    }
    if(event.data == 'n'){
        isLoading.value = false; 
        serverMsg.value = [];   
        notification.error({
            description: '包版失敗'
        });
        return;
    }
    if(event.data.startsWith('{show}') && isLoading){
        serverMsg.value.push(event.data.replace('{show}', ''));
        scrollBox();
    }
};

 socket.onclose = function(event) {
    
};

</script>
<template>
    <div class="list-box">
        <div class="project-box">
            <template v-for="(projct,index) in $props.branchList">
                <div class="branch-box">
                    <span>
                        {{ projct.name + " " }}分支：
                        <input type="text" v-model="search[index]">
                    </span>
                    <div class="branch-list">
                        <ul>
                            <li v-if="'master'.includes(search[index])" @click="selected[index] = 'master'" :style="isSelected('master', index)">origin/master</li>
                            <template v-for="branch in projct.list" :key="branch">
                                <li v-if="branch.includes(search[index]) && !branch.startsWith('  origin/HEAD')" @click="selected[index] = branch" :style="isSelected(branch, index)">{{ branch }}</li>
                            </template>
                        </ul>
                    </div>
                </div>
            </template>
        </div>
        <div class="button-box">
            <n-button v-if="props.branchList.length > 0" type="info" strong secondary @click="confirmSelect">確認</n-button>
        </div>
    </div>
    <div v-if="isLoading" class="overlay-cover">
        <div class="server-message" ref="messageBox">
            <ul>
                <li v-for="line in serverMsg" :key="line">{{ line }}</li>
            </ul>
        </div>
    </div>
</template>
<style scoped>
.list-box {
    display: flex;
    justify-content: center;
    align-items: center;

    padding-top: 64px;
    height: 80vh;
    width: 100%;
    background-color: #f1f5f7;
}

.project-box {
    width: 80%;
    height: 95%;
    
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.branch-box {
    height: 100%;
    width: 100%;

}

.branch-list {
    margin-top: 12px;
    width: 95%;
    height: 85%;
    background-color:white;

    overflow: auto;
}

.branch-list>ul {
    margin-left: 12px;
    margin-right: 12px;
    list-style-type: none;
}

.branch-list>ul>li {
    user-select: none;
    cursor: pointer;
}

.branch-list>ul>li:hover {
    background-color: #f1f5f7;
}

.button-box {
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: end;
}

.overlay-cover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 10000;
    user-select: none;

    display: flex;
    justify-content: center;
    align-items: center;
}

.server-message{
    width: 70%;
    height: 90%;
    padding: 12px;
    background-color: #142334;
    overflow: auto;
}

.server-message>ul{
    margin: 12px;
    list-style-type: none;

}

.server-message>ul>li {
    padding-left: 5px;
    color: #a7a8bd;
}
</style>