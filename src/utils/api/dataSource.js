import axios from '../axios.js'

export default {
    doSearch(data) {
        return axios.get('/dataSource', data);
    },
    getDataSource(dataSourceId) {
        return axios.get('/dataSource/' + dataSourceId)
    },
    updateDataSource(data) {
        return axios.put('/dataSource/', data)
    },
    addDataSource(data) {
        return axios.post('/dataSource/', data)
    },
    testConnection(data) {
        return axios.post('/dataSource/testConnection', data)
    }
}