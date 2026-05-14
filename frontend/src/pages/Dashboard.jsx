import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, ClipboardList, Folder, Plus, Users } from "lucide-react";
import { Button, Card, Input, Modal, Textarea } from "../components/ui";
import { useAuthStore, useProjectStore } from "../store";
import { projectAPI } from "../services";
import { useForm } from "../hooks";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { projects, setProjects } = useProjectStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectAPI.getAllProjects();
      setProjects(response.data.data);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const { values, handleChange, handleSubmit, isSubmitting, resetForm } =
    useForm({ name: "", description: "" }, async (formData) => {
      try {
        const response = await projectAPI.createProject(formData);
        setProjects([...projects, response.data.data]);
        toast.success("Project created successfully!");
        setIsCreateModalOpen(false);
        resetForm();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to create project",
        );
      }
    });

  const recentProjects = projects.slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-end bg-white border-4 border-sketch-ink rounded-[24px_18px_26px_16px] p-6 shadow-sketch-lg rotate-[-0.2deg]">
        <div>
          <p className="font-doodle text-2xl text-sketch-primary">Camp desk</p>
          <h1 className="text-4xl md:text-5xl font-black text-sketch-ink">
            Welcome back, <span className="scribble-underline">{user?.username}!</span>
          </h1>
          <p className="text-gray-700 mt-2 font-semibold">
            Here's what's happening with your projects.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} /> New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#D6ECFF] rotate-[-0.4deg]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 text-sm font-black uppercase">Total Projects</p>
              <p className="text-4xl font-black text-sketch-ink mt-2">{projects.length}</p>
            </div>
            <Folder size={42} className="text-sketch-ink" />
          </div>
        </Card>

        <Card className="bg-[#FFE0DC] rotate-[0.35deg]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 text-sm font-black uppercase">Team Members</p>
              <p className="text-4xl font-black text-sketch-ink mt-2">
                {user?.role === "admin" ? "All" : "?"}
              </p>
            </div>
            <Users size={42} className="text-sketch-ink" />
          </div>
        </Card>

        <Card className="bg-[#DDFBEA] rotate-[-0.25deg]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 text-sm font-black uppercase">Tasks Done</p>
              <p className="text-4xl font-black text-sketch-ink mt-2">Soon</p>
            </div>
            <CheckCircle size={42} className="text-sketch-ink" />
          </div>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-doodle font-bold text-sketch-ink">Your Projects</h2>
          {projects.length > 6 && (
            <Link
              to="/projects"
              className="text-sketch-primary hover:text-sketch-secondary font-black inline-flex items-center gap-1"
            >
              View all <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-sketch-ink border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-700 mt-4 font-semibold">Loading projects...</p>
          </div>
        ) : recentProjects.length === 0 ? (
          <Card className="text-center py-12 bg-white">
            <ClipboardList size={56} className="mx-auto mb-4 text-sketch-ink" />
            <p className="text-gray-700 font-semibold mb-4">
              No projects yet. Create your first one!
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Project
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`}>
                <Card className="cursor-pointer transition h-full bg-white">
                  <div className="mb-4">
                    <h3 className="text-2xl font-doodle font-bold text-sketch-ink">
                      {project.name}
                    </h3>
                    <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                      {project.description || "No description provided"}
                    </p>
                  </div>
                  <div className="pt-4 border-t-2 border-dashed border-sketch-ink flex justify-between items-center">
                    <span className="text-xs text-gray-600 font-bold">
                      {project.members?.length || 0} members
                    </span>
                    <ArrowRight size={18} className="text-sketch-primary" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create New Project"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Project Name"
            name="name"
            placeholder="My Awesome Project"
            value={values.name}
            onChange={handleChange}
            required
          />

          <Textarea
            label="Description"
            name="description"
            placeholder="What is this project about?"
            value={values.description}
            onChange={handleChange}
          />

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

