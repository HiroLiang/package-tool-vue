<script setup lang="ts">
import { ref, watch, PropType, Ref } from 'vue'
import { NButton, useNotification } from 'naive-ui';

const notification = useNotification();

const isLoading = ref(false);

const search: Ref<string[]> = ref([])

const selected: Ref<string[]> = ref([])

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
    if(selected.value.length == 0)
        return;
    let branchs: string[] = [];
    branchs.push(props.selectedProject);
    branchs.push(props.gitAccount);
    branchs.push(props.accessToken);
    selected.value.forEach(e => {
        console.log(e);
        
        branchs.push(e.replace('origin/', ''));
    })
    console.log(branchs);
    socket.send(branchs.join(',split,'));
    isLoading.value = true;
}

// -----------------------------------------------------------------------------------------

const socket = new WebSocket('ws://localhost:8080/compiler');

socket.onopen = (event) => {
    console.log("WebSocket connected.");
    socket.send("Project : " + props.selectedProject);
}

socket.onmessage = function(event) {
    console.log("Message from server:", event.data);
    isLoading.value = false;
    if(event.data == 'y')
        notification.success({
            description: '包版完成',
            duration:3000
        });
    if(event.data == 'n')
        notification.error({
            description: '包版失敗'
    })
};

 socket.onclose = function(event) {
    console.log("WebSocket closed.");
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
                                <li v-if="branch.includes(search[index])" @click="selected[index] = branch" :style="isSelected(branch, index)">{{ branch }}</li>
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
    <div v-if="isLoading" class="overlay-cover">Compiling...</div>
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

    text-align: center;
    align-content: center;
    user-select: none;
}
</style>