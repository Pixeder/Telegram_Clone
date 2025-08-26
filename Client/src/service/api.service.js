import axios from 'axios'

const apiClient = axios.create(
  {
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
    timeout: 5000,
    headers: {
    "Content-Type": "application/json",
    }
  }
)

const registerUser = async (data) => {
  return await apiClient.post("/users/register", data)
}

const loginUser = async (data) => {
  return await apiClient.post("/users/login", data)
}

const logoutUser = async () => {
  return await apiClient.post("/users/logout")
}

const getMessages = async (recipientId) => {
  return await apiClient.get(`/messages/${recipientId}`)
}

const getUserList = async () =>{
  return await apiClient.get("/users/getlist")
}

const createGroup = async (data) =>{
  return await apiClient.post("/groups/",data)
}

const getGroups = async () =>{
  return await apiClient.get("/groups/")
}

export { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getMessages,
  getUserList,
  getGroups,
}