import { useState, useEffect, useRef } from 'react';
import { useForm } from '../hooks';
import { useAuthStore } from '../store';
import { userAPI } from '../services';
import { toast } from 'react-toastify';
import { Button, Input, Modal } from './ui';
import { Edit3 } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef(null);

  const { values, setValues, handleChange, handleSubmit, isSubmitting } = useForm(
    { fullName: '' },
    async (formData) => {
      try {
        const response = await userAPI.updateProfile(formData);
        setUser(response.data.data);
        toast.success('Profile updated successfully');
        onClose();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    }
  );

  useEffect(() => {
    if (user) {
      setValues({ fullName: user.fullName || '' });
    }
  }, [user, setValues]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValues((prev) => ({ ...prev, avatar: file }));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Settings">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            <img
              src={values.avatar ? URL.createObjectURL(values.avatar) : user?.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-sketch-ink object-cover"
            />
            <button
              type="button"
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 bg-sketch-accent p-2 rounded-full sketch-btn"
            >
              <Edit3 size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-sketch-ink">{user?.username}</h3>
            <p className="text-gray-600 capitalize">{user?.role}</p>
          </div>
        </div>

        <Input label="Full Name" name="fullName" value={values.fullName} onChange={handleChange} />

        <div className="flex justify-end gap-4 pt-6 border-t-2 border-dashed border-sketch-ink">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
