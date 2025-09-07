import axios from 'axios';

// The base client configuration is perfect.
const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
  timeout: 5000, // Increased timeout for file uploads
});

// --- User and Auth Functions ---
export const registerUser = (data) => {
  // We set Content-Type here because the default is application/json
  return apiClient.post("/users/register", data, {
    headers: {
      "Content-Type": "application/json",
    }
  });
};

export const loginUser = (data) => {
  return apiClient.post("/users/login", data);
};

export const logoutUser = () => {
  return apiClient.post("/users/logout");
};

// 1. CORRECTED: The route for getting all users is simply GET /users
export const getUserList = () => {
  return apiClient.get("/users/");
};

// --- Message Functions ---
export const getUserMessages = (recipientId) => {
  return apiClient.get(`/messages/${recipientId}`);
};

// 2. CORRECTED: The route for group messages was updated to be more RESTful
export const getGroupMessages = (groupId) => {
  return apiClient.get(`/messages/group/${groupId}`);
};

// --- Group Functions ---
export const createGroup = (data) => {
  return apiClient.post("/groups/", data);
};

export const getGroups = () => {
  return apiClient.get("/groups/");
};

// --- File Upload Function ---
// 3. RENAMED & CORRECTED: Renamed for clarity and fixed the logic.
export const uploadFile = async (file) => {
  const formData = new FormData();
  // The field name "file" MUST match what the backend (Multer) expects
  formData.append("file", file);

  try {
    // 4. CORRECTED: The URL must match the backend route exactly.
    const response = await apiClient.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // Return just the data part of the response for easier use in components
    return response.data.data; 
  } catch (error) {
    console.error("Error uploading file:", error);
    // Re-throw the error so the component's catch block can handle it
    throw error;
  }
};