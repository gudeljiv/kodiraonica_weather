import axios from 'axios'

const api = axios.create({})

api.interceptors.response.use(
	(response) => response,
	(error) => error // if error 401.. error 404 etc...
)

export default api
