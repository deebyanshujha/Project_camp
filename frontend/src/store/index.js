import { create } from "zustand";
import { authAPI } from "../services";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      const { user, accessToken, refreshToken } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register(data);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      set({
        error: message,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authAPI.logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const response = await authAPI.getCurrentUser();
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Session expired",
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),

  addProject: (project) => {
    const projects = get().projects;
    set({ projects: [...projects, project] });
  },

  updateProject: (projectId, updatedProject) => {
    const projects = get().projects;
    set({
      projects: projects.map((p) => (p._id === projectId ? updatedProject : p)),
      currentProject:
        get().currentProject?._id === projectId
          ? updatedProject
          : get().currentProject,
    });
  },

  removeProject: (projectId) => {
    const projects = get().projects;
    set({
      projects: projects.filter((p) => p._id !== projectId),
      currentProject:
        get().currentProject?._id === projectId ? null : get().currentProject,
    });
  },

  clearError: () => set({ error: null }),
}));

export const useTaskStore = create((set, get) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),
  setCurrentTask: (task) => set({ currentTask: task }),

  addTask: (task) => {
    const tasks = get().tasks;
    set({ tasks: [...tasks, task] });
  },

  updateTask: (taskId, updatedTask) => {
    const tasks = get().tasks;
    set({
      tasks: tasks.map((t) => (t._id === taskId ? updatedTask : t)),
      currentTask:
        get().currentTask?._id === taskId ? updatedTask : get().currentTask,
    });
  },

  removeTask: (taskId) => {
    const tasks = get().tasks;
    set({
      tasks: tasks.filter((t) => t._id !== taskId),
      currentTask: get().currentTask?._id === taskId ? null : get().currentTask,
    });
  },

  clearError: () => set({ error: null }),
}));

export const useNoteStore = create((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,

  setNotes: (notes) => set({ notes }),
  setCurrentNote: (note) => set({ currentNote: note }),

  addNote: (note) => {
    const notes = get().notes;
    set({ notes: [...notes, note] });
  },

  updateNote: (noteId, updatedNote) => {
    const notes = get().notes;
    set({
      notes: notes.map((n) => (n._id === noteId ? updatedNote : n)),
      currentNote:
        get().currentNote?._id === noteId ? updatedNote : get().currentNote,
    });
  },

  removeNote: (noteId) => {
    const notes = get().notes;
    set({
      notes: notes.filter((n) => n._id !== noteId),
      currentNote: get().currentNote?._id === noteId ? null : get().currentNote,
    });
  },

  clearError: () => set({ error: null }),
}));
