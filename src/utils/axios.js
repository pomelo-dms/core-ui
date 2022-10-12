import qs from 'qs'
import axios from "axios";
import {ElMessage} from 'element-plus'

const service = axios.create({
    baseURL: 'http://localhost:9001/api/v1/',
    // headers: {
    //     'Content-Type': 'application/json;charset=utf-8',
    // },
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
            window.sessionStorage.setItem('token', '')
            return Promise.reject(response.data);
        } else if (response.data.code === 1) {  // 服务出错了
            ElMessage.error(response.data.msg)
            return Promise.reject(response.data);
        } else {  // 正常响应
            return response.data
        }
    },
    error => {
        ElMessage.error(error)
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

    get(url, data) {
        return new Promise((resolve, reject) => {
            service.get(url, data)
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
    delete(url, data) {
        return new Promise((resolve, reject) => {
            service.delete(url, data)
                .then(res => {
                    resolve(res)
                }).catch(err => {
                reject(err)
            });
        })
    },
}