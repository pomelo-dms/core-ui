import axios from '../axios.js'

export default {
    getTreeLevel0(dataSourceId) {
        return axios.get('/database/tree0', dataSourceId);
    },
    getTreeLevel1(params) {
        return axios.get('/database/tree1', params);
    },
}