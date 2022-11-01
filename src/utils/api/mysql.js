import axios from '../axios.js'

export default {
    getTreeLevel0(dataSourceId) {
        return axios.get('/database/tree0', dataSourceId);
    },
    getTreeLevel1(params) {
        return axios.get('/database/tree1', params);
    },
    getTreeLevel2Table(params) {
        return axios.get('/table/tree', params);
    },
    getTreeLevel2View(params) {
        return axios.get('/view/tree', params);
    },
    getCharacterSets(dataSourceId) {
        return axios.get('/database/characterSet', dataSourceId);
    },
    getCollations(params) {
        return axios.get('/database/collation', params);
    },

    /**
     * 创建数据库
     * @param data
     * @returns {Promise<unknown>}
     */
    createDatabase(data) {
        return axios.post('/database', data)
    }
}