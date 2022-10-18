import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    {path: '/', redirect: 'login'},
    {path: '/login', name: 'LoginView', component: () => import('../views/LoginView.vue')},
    {
        path: '/main',
        name: 'MainView',
        redirect: 'welcome',
        component: () => import('../views/MainView.vue'),
        children: [
            {
                path: '/welcome',
                name: 'WelcomeView',
                meta: {title: '首页', hasChildren: false},
                component: () => import('../views/WelcomeView.vue')
            },
            {
                path: '/dataSource',
                name: 'DataSourceView',
                meta: {title: '首页', hasChildren: false},
                component: () => import('../views/dataSource/DataSourceView.vue')
            },
            {
                path: '/sys',
                meta: {title: '系统管理', hasChildren: true},
                children: [
                    {
                        path: '/user',
                        name: 'UserView',
                        meta: {title: '用户管理', hasChildren: false},
                        component: () => import('../views/sys/UserView.vue')
                    },
                    {
                        path: '/role',
                        name: 'RoleView',
                        meta: {title: '角色管理', hasChildren: false},
                        component: () => import('../views/sys/RoleView.vue')
                    },
                    {
                        path: '/config',
                        name: 'SystemConfigView',
                        meta: {title: '系统设置', hasChildren: false},
                        component: () => import('../views/sys/SystemConfigView.vue')
                    },
                ]
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