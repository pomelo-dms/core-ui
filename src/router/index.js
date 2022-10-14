import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    {path: '/', redirect: 'login'},
    {path: '/login', name: 'LoginView', component: () => import('../views/LoginView.vue')},
    {
        path: '/main',
        name: 'MainView',
        component: () => import('../views/MainView.vue'),
        children: [
            {
                path: '/welcome',
                name: 'WelcomeView',
                component: () => import('../views/WelcomeView.vue')
            },
            {
                path: '/dataSource',
                name: 'DataSourceView',
                component: () => import('../views/dataSource/DataSourceView.vue')
            },
        ]
    },
    {path: '/console/mysql', name: 'MySQLView', component: () => import('../views/mysql/MySQLView.vue')},
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