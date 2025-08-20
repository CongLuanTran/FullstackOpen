import axios from 'axios'
import storage from './storage'

const baseUrl = '/api/users'

const getConfit = () => ({
  headers: { Authorization: `Bearer ${storage.loadUser().token}` },
})

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getAll }
