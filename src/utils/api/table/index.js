import axios from '../../axios.js'

export default {
    listDataInfos() {
        return axios.get('/table/dataType')
    },
}