import apiClient from './api';

export const projectAPI = {
  getAllProjects: () => apiClient.get('/projects/'),
  getProjectById: (projectId) => apiClient.get(`/projects/${projectId}`),
  createProject: (data) => apiClient.post('/projects/', data),
  updateProject: (projectId, data) => apiClient.put(`/projects/${projectId}`, data),
  deleteProject: (projectId) => apiClient.delete(`/projects/${projectId}`),

  // Project Members
  getProjectMembers: (projectId) => apiClient.get(`/projects/${projectId}/members`),
  addProjectMember: (projectId, data) => apiClient.post(`/projects/${projectId}/members`, data),
  updateMemberRole: (projectId, userId, data) =>
    apiClient.put(`/projects/${projectId}/members/${userId}`, data),
  removeMember: (projectId, userId) => apiClient.delete(`/projects/${projectId}/members/${userId}`),
};
