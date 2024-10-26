import { defineStore, StoreDefinition } from "pinia";
import { Ref, ref } from "vue";
import { User } from "../components/model/user.ts";

export const useUserAuth: StoreDefinition = defineStore('userAuth', () => {

    const isTest: boolean = localStorage.getItem('isMock') == 'true';

    const user: Ref<User | null> = ref(null);

    const init = (): void => {
        if(isTest) {
            user.value = {id: 0, name: 'robot-0', gitAccount: 'test-account', password: 'P@ssw0rd', accessToken: 'test-token'};
        } else {

        }

        if(user.value == null)
            throw new Error('Error init pinia : user-auth.')
    }

    return { user, init }
})