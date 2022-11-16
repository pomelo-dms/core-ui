import axios from "axios";
import {ElMessage, ElMessageBox} from 'element-plus'
import router from "../router/index.js";

const service = axios.create({
    // baseURL: 'http://localhost:9001/api/v1/',
    baseURL: import.meta.env.VITE_BASE_URL,
    // headers: {
    //     'Content-Type': 'application/json;charset=utf-8',
    // },
    withCredentials: true,
    timeout: 30000, // 请求超时时间
})
service.interceptors.request.use(
    config => {
        const token = window.localStorage.getItem('token') || ''
        return {
            ...config,
            headers: {
                'Token': token
            }
        }

    },
    error => {
        Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        if (response.data.code === -1) { // 未登录或 token 过期
            ElMessage.error(response.data.msg)
            window.localStorage.setItem('token', '')
            ElMessageBox.confirm("您尚未登录或会话已过期，是否重新登录~", "Warning", {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                router.push('/login')
            })
            return Promise.reject(response.data);
        } else if (response.data.code === 1) {  // 服务出错了
            ElMessage.error(response.data.msg)
            return Promise.reject(response.data);
        } else {  // 正常响应
            return response.data
        }
    },
    error => {
        ElMessage.error('111' + error)
    }
)

// 常用方法封装
export default {
    post(url, data) {
        return new Promise((resolve, reject) => {
            service.post(url, data)
                .then(res => {
                    resolve(res)
                }).catch(err => {
                reject(err)
            });
        })
    },

    get(url, params) {
        return new Promise((resolve, reject) => {
            service.get(url, {params: params})
                .then(res => {
                    resolve(res)
                }).catch(err => {
                reject(err)
            })
        })
    },
    put(url, data) {
        return new Promise((resolve, reject) => {
            service.put(url, data)
                .then(res => {
                    resolve(res)
                }).catch(err => {
                reject(err)
            });
        })
    },
    delete(url, params) {
        return new Promise((resolve, reject) => {
            service.delete(url, {params: params})
                .then(res => {
                    resolve(res)
                }).catch(err => {
                reject(err)
            });
        })
    },
}
