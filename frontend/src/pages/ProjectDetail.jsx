import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileText, Plus, Trash2, UserPlus, Users } from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { useAuthStore, useNoteStore, useProjectStore, useTaskStore } from '../store';
import { authAPI, noteAPI, projectAPI, taskAPI } from '../services';
import { useForm } from '../hooks';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/helpers';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentProject, setCurrentProject } = useProjectStore();
  const { tasks, setTasks } = useTaskStore();
  const { notes, setNotes } = useNoteStore();

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [inviteRole, setInviteRole] = useState('member');
  const [invitingUserId, setInvitingUserId] = useState('');

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setIsLoading(true);
      const [projectRes, tasksRes, notesRes, membersRes, usersRes] = await Promise.all([
        projectAPI.getProjectById(projectId),
        taskAPI.getProjectTasks(projectId),
        noteAPI.getProjectNotes(projectId),
        projectAPI.getProjectMembers(projectId),
        authAPI.getUsers(),
      ]);

      setCurrentProject(projectRes.data.data);
      setTasks(tasksRes.data.data);
      setNotes(notesRes.data.data);
      setMembers(membersRes.data.data);
      setAllUsers(usersRes.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load project details');
      navigate('/projects');
    } finally {
      setIsLoading(false);
    }
  };

  const currentMember = members.find((member) => member._id === user?._id);
  const canModify = currentMember?.role === 'admin' || currentMember?.role === 'project_admin';

  const inviteUsers = useMemo(() => {
    const memberIds = new Set(members.map((member) => String(member._id)));
    return allUsers.filter((candidate) => !memberIds.has(String(candidate._id)));
  }, [allUsers, members]);

  const tabs = [
    { id: 'tasks', label: 'Tasks', count: tasks.length },
    { id: 'notes', label: 'Notes', count: notes.length },
    { id: 'members', label: 'Members', count: members.length },
    ...(canModify ? [{ id: 'invite', label: 'Invite Members', count: inviteUsers.length }] : []),
  ];

  const [taskFiles, setTaskFiles] = useState([]);
  const handleTaskFileChange = (e) => {
    setTaskFiles(Array.from(e.target.files));
  };

  const {
    values: taskValues,
    handleChange: handleTaskChange,
    handleSubmit: handleCreateTask,
    isSubmitting: isCreatingTask,
    resetForm: resetTaskForm,
  } = useForm({ title: '', description: '', assignedTo: '' }, async (formData) => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      taskFiles.forEach((file) => {
        data.append('attachments', file);
      });

      const response = await taskAPI.createTask(projectId, data);
      setTasks([...tasks, response.data.data]);
      toast.success('Task created successfully!');
      setIsCreateTaskModalOpen(false);
      resetTaskForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  });

  const {
    values: noteValues,
    handleChange: handleNoteChange,
    handleSubmit: handleCreateNote,
    isSubmitting: isCreatingNote,
    resetForm: resetNoteForm,
  } = useForm({ title: '', content: '' }, async (formData) => {
    try {
      const response = await noteAPI.createNote(projectId, formData);
      setNotes([...notes, response.data.data]);
      toast.success('Note created successfully!');
      setIsCreateNoteModalOpen(false);
      resetNoteForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create note');
    }
  });

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;

    try {
      await taskAPI.deleteTask(projectId, taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;

    try {
      await noteAPI.deleteNote(projectId, noteId);
      setNotes(notes.filter((note) => note._id !== noteId));
      toast.success('Note deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete note');
    }
  };
  const handleDeleteProject = async () => {
    if (
      !window.confirm('Are you sure you want to delete this project? This action cannot be undone.')
    )
      return;

    try {
      await projectAPI.deleteProject(projectId);
      toast.success('Project deleted successfully!');
      navigate('/projects');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const {
    values: editProjectValues,
    handleChange: handleEditProjectChange,
    handleSubmit: handleEditProjectSubmit,
    isSubmitting: isEditingProject,
    setValues: setEditProjectValues,
  } = useForm({ name: '', description: '' }, async (formData) => {
    try {
      const response = await projectAPI.updateProject(projectId, formData);
      setCurrentProject(response.data.data);
      toast.success('Project updated successfully!');
      setIsEditProjectModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update project');
    }
  });

  useEffect(() => {
    if (currentProject) {
      setEditProjectValues({
        name: currentProject.name || '',
        description: currentProject.description || '',
      });
    }
  }, [currentProject, setEditProjectValues]);
  const handleUpdateMemberRole = async (userId, newRole) => {
    try {
      await projectAPI.updateMemberRole(projectId, userId, { role: newRole });
      setMembers((prev) => prev.map((m) => (m._id === userId ? { ...m, role: newRole } : m)));
      toast.success('Role updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      await projectAPI.removeMember(projectId, userId);
      setMembers((prev) => prev.filter((m) => m._id !== userId));
      toast.success('Member removed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleInviteMember = async (selectedUser) => {
    try {
      setInvitingUserId(selectedUser._id);
      const response = await projectAPI.addProjectMember(projectId, {
        email: selectedUser.email,
        role: inviteRole,
      });
      setMembers((currentMembers) => [...currentMembers, response.data.data]);
      toast.success(`${selectedUser.username} added to the project`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    } finally {
      setInvitingUserId('');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-sketch-ink border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 mt-4 font-semibold">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between bg-white border-4 border-sketch-ink rounded-[24px_18px_26px_16px] p-6 shadow-sketch-lg">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 bg-white rounded-xl sketch-btn"
            aria-label="Back to projects"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <p className="font-doodle text-2xl text-sketch-primary">Project board</p>
            <h1 className="text-4xl md:text-5xl font-black text-sketch-ink">
              {currentProject?.name}
            </h1>
            <p className="text-gray-700 mt-2 font-semibold">
              {currentProject?.description || 'No description provided'}
            </p>
          </div>
        </div>

        {currentMember?.role === 'admin' && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditProjectModalOpen(true)}>
              Edit
            </Button>
            <Button variant="danger" onClick={handleDeleteProject}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 whitespace-nowrap rounded-xl border-2 border-sketch-ink font-black transition ${
              activeTab === tab.id
                ? 'bg-sketch-accent text-sketch-ink shadow-sketch-hover'
                : 'bg-white text-gray-700 hover:bg-[#D6ECFF]'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {canModify && (
            <Button onClick={() => setIsCreateTaskModalOpen(true)}>
              <Plus size={20} /> Create Task
            </Button>
          )}

          {tasks.length === 0 ? (
            <Card className="text-center py-12 bg-white">
              <CheckCircle size={56} className="mx-auto mb-4 text-sketch-ink" />
              <p className="text-gray-700 font-semibold mb-4">
                No tasks yet. Start by creating one!
              </p>
              {canModify && (
                <Button onClick={() => setIsCreateTaskModalOpen(true)}>Create Task</Button>
              )}
            </Card>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <Link
                  key={task._id}
                  to={`/projects/${projectId}/tasks/${task._id}`}
                  className="block"
                >
                  <Card className="cursor-pointer bg-white">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-doodle font-bold text-sketch-ink">
                          {task.title}
                        </h3>
                        <p className="text-gray-700 mt-2">{task.description}</p>
                        <div className="flex flex-wrap gap-3 mt-4">
                          <span className="status-pill bg-[#D6ECFF] px-3 py-1 text-xs font-black">
                            {task.status?.replace('_', ' ').toUpperCase()}
                          </span>
                          {task.assignedTo && (
                            <span className="text-xs text-gray-600 font-bold">
                              Assigned to: {task.assignedTo.username}
                            </span>
                          )}
                        </div>
                      </div>
                      {canModify && (
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            handleDeleteTask(task._id);
                          }}
                          className="p-2 bg-[#FFE0DC] rounded-xl text-red-700 sketch-btn"
                          aria-label="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-6">
          {canModify && (
            <Button onClick={() => setIsCreateNoteModalOpen(true)}>
              <Plus size={20} /> Create Note
            </Button>
          )}

          {notes.length === 0 ? (
            <Card className="text-center py-12 bg-white">
              <FileText size={56} className="mx-auto mb-4 text-sketch-ink" />
              <p className="text-gray-700 font-semibold mb-4">
                No notes yet. Create one to get started!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <Card key={note._id} className="bg-white">
                  <div className="flex justify-between items-start mb-4 gap-3">
                    <h3 className="text-2xl font-doodle font-bold text-sketch-ink flex-1">
                      {note.title || 'Untitled note'}
                    </h3>
                    {canModify && (
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="p-2 bg-[#FFE0DC] rounded-xl text-red-700 sketch-btn"
                        aria-label="Delete note"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 line-clamp-4">{note.content}</p>
                  <p className="text-xs text-gray-500 mt-4">{formatDate(note.createdAt)}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-6">
          {members.length === 0 ? (
            <Card className="text-center py-12 bg-white">
              <Users size={56} className="mx-auto mb-4 text-sketch-ink" />
              <p className="text-gray-700 font-semibold mb-4">No members added yet</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <Card key={member._id} className="bg-white">
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-[45%_55%_49%_51%] bg-sketch-accent border-2 border-sketch-ink shadow-sketch-hover flex items-center justify-center text-sketch-ink font-black shrink-0">
                        {member.username?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-sketch-ink truncate">{member.username}</p>
                        <p className="text-sm text-gray-600 truncate">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {currentMember?.role === 'admin' && user?._id !== member._id ? (
                        <>
                          <div className="w-32">
                            <Select
                              value={member.role}
                              onChange={(e) => handleUpdateMemberRole(member._id, e.target.value)}
                              options={[
                                { value: 'member', label: 'Member' },
                                { value: 'project_admin', label: 'Project Admin' },
                                { value: 'admin', label: 'Admin' },
                              ]}
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveMember(member._id)}
                            className="p-2 bg-[#FFE0DC] rounded-xl text-red-700 sketch-btn ml-2"
                            aria-label="Remove member"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <span className="status-pill bg-[#DDFBEA] px-3 py-1 text-xs font-black capitalize">
                          {member.role?.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'invite' && canModify && (
        <div className="space-y-6">
          <Card className="bg-[#D6ECFF]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-doodle font-bold text-sketch-ink">
                  Invite signed-up users
                </h2>
                <p className="text-gray-700 font-semibold mt-1">
                  Pick a role, then add people who already have accounts.
                </p>
              </div>
              <div className="w-full md:w-56">
                <Select
                  label="Invite Role"
                  value={inviteRole}
                  onChange={(event) => setInviteRole(event.target.value)}
                  options={[
                    { value: 'member', label: 'Member' },
                    { value: 'project_admin', label: 'Project Admin' },
                  ]}
                />
              </div>
            </div>
          </Card>

          {inviteUsers.length === 0 ? (
            <Card className="text-center py-12 bg-white">
              <CheckCircle size={56} className="mx-auto mb-4 text-sketch-success" />
              <p className="text-gray-700 font-semibold">
                Everyone signed up is already in this project.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {inviteUsers.map((candidate) => (
                <Card key={candidate._id} className="bg-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-[45%_55%_49%_51%] bg-sketch-accent border-2 border-sketch-ink shadow-sketch-hover flex items-center justify-center text-sketch-ink font-black shrink-0">
                        {candidate.username?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-sketch-ink truncate">{candidate.username}</p>
                        <p className="text-sm text-gray-600 truncate">{candidate.email}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleInviteMember(candidate)}
                      isLoading={invitingUserId === candidate._id}
                    >
                      <UserPlus size={16} /> Add
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isCreateTaskModalOpen}
        onClose={() => {
          setIsCreateTaskModalOpen(false);
          resetTaskForm();
        }}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-6">
          <Input
            label="Task Title"
            name="title"
            placeholder="Task title"
            value={taskValues.title}
            onChange={handleTaskChange}
            required
          />

          <Textarea
            label="Description"
            name="description"
            placeholder="Task description"
            value={taskValues.description}
            onChange={handleTaskChange}
          />

          <Select
            label="Assign To"
            name="assignedTo"
            value={taskValues.assignedTo}
            onChange={handleTaskChange}
            options={[
              { value: '', label: 'Nobody' },
              ...members.map((member) => ({
                value: member._id,
                label: member.username,
              })),
            ]}
          />

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Attachments</label>
            <input
              type="file"
              multiple
              onChange={handleTaskFileChange}
              className="w-full px-4 py-3 bg-white border-2 border-sketch-ink rounded-xl shadow-sketch focus:outline-none focus:ring-2 focus:ring-sketch-primary"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateTaskModalOpen(false);
                resetTaskForm();
                setTaskFiles([]);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreatingTask}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isCreateNoteModalOpen}
        onClose={() => {
          setIsCreateNoteModalOpen(false);
          resetNoteForm();
        }}
        title="Create New Note"
      >
        <form onSubmit={handleCreateNote} className="space-y-6">
          <Input
            label="Note Title"
            name="title"
            placeholder="Note title"
            value={noteValues.title}
            onChange={handleNoteChange}
            required
          />

          <Textarea
            label="Content"
            name="content"
            placeholder="Your note content..."
            value={noteValues.content}
            onChange={handleNoteChange}
            required
          />

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateNoteModalOpen(false);
                resetNoteForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreatingNote}>
              Create Note
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditProjectModalOpen}
        onClose={() => setIsEditProjectModalOpen(false)}
        title="Edit Project"
      >
        <form onSubmit={handleEditProjectSubmit} className="space-y-4">
          <Input
            label="Project Name"
            name="name"
            value={editProjectValues.name}
            onChange={handleEditProjectChange}
            placeholder="Enter project name"
            required
          />
          <Textarea
            label="Description"
            name="description"
            value={editProjectValues.description}
            onChange={handleEditProjectChange}
            placeholder="Brief description"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditProjectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isEditingProject}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
