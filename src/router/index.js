import {createRouter, createWebHashHistory} from "vue-router";
import {ElMessage} from "element-plus";

const routes = [
    {path: '/', redirect: 'login'},
    {path: '/login', name: 'LoginView', component: () => import('../views/Login.vue')},
    {
        path: '/main',
        name: 'MainView',
        redirect: 'welcome',
        component: () => import('../views/Main.vue'),
        children: [
            {
                path: '/welcome',
                name: 'WelcomeView',
                meta: {title: '首页', hasChildren: false, icon: 'HomeFilled'},
                component: () => import('../views/Welcome.vue')
            },
            {
                path: '/dataSource',
                name: 'DataSourceView',
                meta: {title: '数据源管理', hasChildren: false, icon: 'Grid'},
                component: () => import('../views/dataSource/DataSource.vue')
            },
            {
                path: '/sys',
                meta: {title: '系统管理', hasChildren: true, icon: 'BellFilled'},
                children: [
                    {
                        path: '/user',
                        name: 'UserView',
                        meta: {title: '用户管理', hasChildren: false, icon: 'UserFilled'},
                        component: () => import('../views/sys/User.vue')
                    },
                    {
                        path: '/role',
                        name: 'RoleView',
                        meta: {title: '角色管理', hasChildren: false, icon: 'Histogram'},
                        component: () => import('../views/sys/Role.vue')
                    },
                    {
                        path: '/config',
                        name: 'SystemConfigView',
                        meta: {title: '系统设置', hasChildren: false, icon: 'Tools'},
                        component: () => import('../views/sys/SystemConfig.vue')
                    },
                ]
            },
        ]
    },
    {path: '/console/mysql', name: 'MySQLView', component: () => import('../views/mysql/MySQL.vue')},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
router.beforeEach((to, from, next) => {
    if (to.name !== 'LoginView' && !window.localStorage.getItem('token')) {
        ElMessage.error('您的回话已过期，请重新登录')
        next({name: 'LoginView'})
    } else {
        next()
    }
})

export default router