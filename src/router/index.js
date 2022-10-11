import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    {path: '/', redirect: 'login'},
    {path: '/login', name: 'LoginView', component: () => import('../views/LoginView.vue')},
    {path: '/dataSource', name: 'DataSourceView', component: () => import('../views/DataSourceView.vue')},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
router.beforeEach((to, from, next) => {
    if (to.name !== 'LoginView' && !window.localStorage.getItem('token')) {
        next({name: 'LoginView'})
    } else {
        next()
    }
})

export default router