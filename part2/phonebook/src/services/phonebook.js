import axios from 'axios'
const dbUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios
        .get(dbUrl)
        .then(response => response.data)
}

const create = newObject => {
    return axios
        .post(dbUrl, newObject)
        .then(response => response.data)
}

const update = (id, newObject) => {
    return axios
        .put(`${dbUrl}/${id}`, newObject)
        .then(response => response.data)
}

const remove = id => {
    axios.delete(`${dbUrl}/${id}`)
}

export default { getAll, create, remove, update }