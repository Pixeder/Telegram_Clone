import axios from 'axios'

const apiClient = axios.create(
  {
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
    timeout: 1000,
    headers: {
    "Content-Type": "application/json",
    }
  }
)

const registerUser = async (data) => {
  return await apiClient.post("users/register", data)
}

const login = async (data) => {
  return await apiClient.post("users/login", data)
}

const logout = async () => {
  return await apiClient.post("users/logout")
}

const getMessages = async (recipientId) => {
  return await apiClient.get("/messages/${recipientId}")
}

export { 
  registerUser, 
  login, 
  logout, 
  getMessages ,
}