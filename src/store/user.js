import { defineStore} from 'pinia'

export const userStore = defineStore('user',{
    state:()=>{
        return {
            currentUser: {}
        }
    },
    getters:{},
    actions:{}
})
