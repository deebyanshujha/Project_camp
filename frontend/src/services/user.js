import apiClient from './api';

export const userAPI = {
  updateProfile: (data) => {
    const formData = new FormData();
    if (data.fullName) {
      formData.append('fullName', data.fullName);
    }
    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }

    return apiClient.patch('/auth/update-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
