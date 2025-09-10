import {createRouter, createWebHashHistory} from 'vue-router'
import IndexComponent from "@/components/page/index/IndexComponent.vue";
import RunCodeComponent from "@/components/page/code/RunCodeComponent.vue";


const routes = [
    {
        path: '/index',
        name: 'index',
        component: IndexComponent,
    },
    {
        path: '/run',
        name: 'run',
        component: RunCodeComponent
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})


export default router
