import apiClient from "./api";

// Authentication APIs
export const authAPI = {
  register: (data) => apiClient.post("/auth/register", data),
  login: (data) => apiClient.post("/auth/login", data),
  logout: () => apiClient.post("/auth/logout"),
  getCurrentUser: () => apiClient.get("/auth/current-user"),
  getUsers: () => apiClient.get("/auth/users"),
  verifyEmail: (token) => apiClient.get(`/auth/verify-email/${token}`),
  resendEmailVerification: () =>
    apiClient.post("/auth/resend-email-verification"),
  changePassword: (data) => apiClient.post("/auth/change-password", data),
  forgotPassword: (email) => apiClient.post("/auth/forgot-password", { email }),
  resetPassword: (token, data) =>
    apiClient.post(`/auth/reset-password/${token}`, data),
  refreshToken: () => apiClient.post("/auth/refresh-token"),
};

// Project APIs
export const projectAPI = {
  getAllProjects: () => apiClient.get("/projects/"),
  getProjectById: (projectId) => apiClient.get(`/projects/${projectId}`),
  createProject: (data) => apiClient.post("/projects/", data),
  updateProject: (projectId, data) =>
    apiClient.put(`/projects/${projectId}`, data),
  deleteProject: (projectId) => apiClient.delete(`/projects/${projectId}`),

  // Project Members
  getProjectMembers: (projectId) =>
    apiClient.get(`/projects/${projectId}/members`),
  addProjectMember: (projectId, data) =>
    apiClient.post(`/projects/${projectId}/members`, data),
  updateMemberRole: (projectId, userId, data) =>
    apiClient.put(`/projects/${projectId}/members/${userId}`, data),
  removeMember: (projectId, userId) =>
    apiClient.delete(`/projects/${projectId}/members/${userId}`),
};

// Task APIs
export const taskAPI = {
  getProjectTasks: (projectId) => apiClient.get(`/tasks/${projectId}`),
  getTaskById: (projectId, taskId) =>
    apiClient.get(`/tasks/${projectId}/t/${taskId}`),
  createTask: (projectId, data) => apiClient.post(`/tasks/${projectId}`, data),
  updateTask: (projectId, taskId, data) =>
    apiClient.put(`/tasks/${projectId}/t/${taskId}`, data),
  deleteTask: (projectId, taskId) =>
    apiClient.delete(`/tasks/${projectId}/t/${taskId}`),

  // Subtasks
  createSubtask: (projectId, taskId, data) =>
    apiClient.post(`/tasks/${projectId}/t/${taskId}/subtasks`, data),
  updateSubtask: (projectId, subTaskId, data) =>
    apiClient.put(`/tasks/${projectId}/st/${subTaskId}`, data),
  deleteSubtask: (projectId, subTaskId) =>
    apiClient.delete(`/tasks/${projectId}/st/${subTaskId}`),
};

// Note APIs
export const noteAPI = {
  getProjectNotes: (projectId) => apiClient.get(`/notes/${projectId}`),
  getNoteById: (projectId, noteId) =>
    apiClient.get(`/notes/${projectId}/n/${noteId}`),
  createNote: (projectId, data) => apiClient.post(`/notes/${projectId}`, data),
  updateNote: (projectId, noteId, data) =>
    apiClient.put(`/notes/${projectId}/n/${noteId}`, data),
  deleteNote: (projectId, noteId) =>
    apiClient.delete(`/notes/${projectId}/n/${noteId}`),
};

// Health Check
export const healthAPI = {
  check: () => apiClient.get("/healthcheck/"),
};
