import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Check } from "lucide-react";
import { Card, Button, Input, Textarea, Modal, Select } from "../components/ui";
import { useAuthStore, useTaskStore } from "../store";
import { taskAPI } from "../services";
import { useForm } from "../hooks";
import { toast } from "react-toastify";
import { formatDate } from "../utils/helpers";

export default function TaskDetail() {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentTask, setCurrentTask } = useTaskStore();

  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateSubtaskModalOpen, setIsCreateSubtaskModalOpen] =
    useState(false);

  useEffect(() => {
    fetchTaskData();
  }, [taskId, projectId]);

  const fetchTaskData = async () => {
    try {
      setIsLoading(true);
      const response = await taskAPI.getTaskById(projectId, taskId);
      setTask(response.data.data);
      setCurrentTask(response.data.data);
      setSubtasks(response.data.data.subtasks || []);
    } catch (error) {
      toast.error("Failed to load task details");
      navigate(`/projects/${projectId}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await taskAPI.updateTask(projectId, taskId, {
        status: newStatus,
      });
      setTask(response.data.data);
      toast.success("Task status updated!");
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  const {
    values: subtaskValues,
    handleChange: handleSubtaskChange,
    handleSubmit: handleCreateSubtask,
    isSubmitting: isCreatingSubtask,
    resetForm: resetSubtaskForm,
  } = useForm({ title: "" }, async (formData) => {
    try {
      const response = await taskAPI.createSubtask(projectId, taskId, formData);
      setSubtasks([...subtasks, response.data.data]);
      toast.success("Subtask created successfully!");
      setIsCreateSubtaskModalOpen(false);
      resetSubtaskForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create subtask");
    }
  });

  const handleToggleSubtask = async (subtaskId, currentStatus) => {
    try {
      const newStatus = currentStatus === "done" ? "todo" : "done";
      const response = await taskAPI.updateSubtask(projectId, subtaskId, {
        isCompleted: newStatus === "done",
      });
      setSubtasks(
        subtasks.map((st) => (st._id === subtaskId ? response.data.data : st)),
      );
      toast.success("Subtask updated!");
    } catch (error) {
      toast.error("Failed to update subtask");
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    if (window.confirm("Delete this subtask?")) {
      try {
        await taskAPI.deleteSubtask(projectId, subtaskId);
        setSubtasks(subtasks.filter((st) => st._id !== subtaskId));
        toast.success("Subtask deleted!");
      } catch (error) {
        toast.error("Failed to delete subtask");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-sketch-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 mt-4">Loading task...</p>
      </div>
    );
  }

  const canModify =
    user?.role === "admin" ||
    user?.role === "project_admin" ||
    user?._id === task?.assignedTo?._id;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg sketch-btn"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{task?.title}</h1>
          <p className="text-gray-600 mt-2">
            Created {formatDate(task?.createdAt)}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {task?.description || "No description provided"}
            </p>
          </Card>

          {/* Attachments */}
          {task?.attachment && task.attachment.length > 0 && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Attachments
              </h2>
              <div className="space-y-2">
                {task.attachment.map((file, idx) => (
                  <a
                    key={idx}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                  >
                    <span>📎</span>
                    <span className="text-gray-700">
                      {file.url.split("/").pop()}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Subtasks */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Subtasks ({subtasks.filter((st) => st.isCompleted).length}/
                {subtasks.length})
              </h2>
              {canModify && (
                <Button
                  size="sm"
                  onClick={() => setIsCreateSubtaskModalOpen(true)}
                  className="flex gap-2"
                >
                  <Plus size={16} /> Add
                </Button>
              )}
            </div>

            {subtasks.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No subtasks yet</p>
            ) : (
              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask._id}
                    className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                  >
                    <button
                      onClick={() =>
                        handleToggleSubtask(
                          subtask._id,
                          subtask.isCompleted ? "done" : "todo",
                        )
                      }
                      className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                        subtask.isCompleted
                          ? "bg-sketch-success border-sketch-success"
                          : "border-gray-300 hover:border-sketch-success"
                      }`}
                    >
                      {subtask.isCompleted && (
                        <Check size={16} className="text-white" />
                      )}
                    </button>
                    <span
                      className={`flex-1 ${subtask.isCompleted ? "line-through text-gray-500" : "text-gray-900"}`}
                    >
                      {subtask.title}
                    </span>
                    {canModify && (
                      <button
                        onClick={() => handleDeleteSubtask(subtask._id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600 sketch-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Progress Bar */}
            {subtasks.length > 0 && (
              <div className="mt-6">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sketch-success to-sketch-primary transition-all duration-500"
                    style={{
                      width: `${(subtasks.filter((st) => st.isCompleted).length / subtasks.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Status</h3>
            <Select
              value={task?.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              options={[
                { value: "todo", label: "📋 Todo" },
                { value: "in_progress", label: "🔄 In Progress" },
                { value: "done", label: "✅ Done" },
              ]}
            />
          </Card>

          {/* Assigned To */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Assigned To</h3>
            {task?.assignedTo ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sketch-primary to-sketch-secondary flex items-center justify-center text-white font-bold text-sm">
                  {task.assignedTo.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {task.assignedTo.username}
                  </p>
                  <p className="text-xs text-gray-600">
                    {task.assignedTo.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Not assigned</p>
            )}
          </Card>

          {/* Created By */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Created By</h3>
            {task?.assignedBy && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sketch-secondary to-sketch-accent flex items-center justify-center text-white font-bold text-sm">
                  {task.assignedBy.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {task.assignedBy.username}
                  </p>
                  <p className="text-xs text-gray-600">
                    {task.assignedBy.email}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Project */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Project</h3>
            <button
              onClick={() => navigate(`/projects/${projectId}`)}
              className="text-sketch-primary hover:text-sketch-secondary font-semibold text-sm"
            >
              ← Back to Project
            </button>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isCreateSubtaskModalOpen}
        onClose={() => {
          setIsCreateSubtaskModalOpen(false);
          resetSubtaskForm();
        }}
        title="Create Subtask"
      >
        <form onSubmit={handleCreateSubtask} className="space-y-6">
          <Input
            label="Subtask Title"
            name="title"
            placeholder="Subtask title"
            value={subtaskValues.title}
            onChange={handleSubtaskChange}
            required
          />

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateSubtaskModalOpen(false);
                resetSubtaskForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreatingSubtask}>
              Create Subtask
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
