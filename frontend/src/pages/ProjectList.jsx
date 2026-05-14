import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, Plus, Search, Users } from 'lucide-react';
import { Button, Card, Input, Modal, Textarea } from '../components/ui';
import { useProjectStore } from '../store';
import { projectAPI } from '../services';
import { useForm } from '../hooks';
import { toast } from 'react-toastify';

export default function ProjectList() {
  const { projects, setProjects } = useProjectStore();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const query = searchTerm.toLowerCase();
    const filtered = projects.filter((project) => {
      const name = project?.name || '';
      const description = project?.description || '';

      return name.toLowerCase().includes(query) || description.toLowerCase().includes(query);
    });
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectAPI.getAllProjects();
      setProjects(response.data.data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const { values, handleChange, handleSubmit, isSubmitting, resetForm } = useForm(
    { name: '', description: '', githubRepo: '' },
    async (formData) => {
      try {
        const response = await projectAPI.createProject(formData);
        setProjects([response.data.data, ...projects]);
        toast.success('Project created successfully!');
        setIsCreateModalOpen(false);
        resetForm();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create project');
      }
    }
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-end bg-white border-4 border-sketch-ink rounded-[20px_26px_18px_24px] p-6 shadow-sketch-lg">
        <div>
          <p className="font-doodle text-2xl text-sketch-secondary">Project shelf</p>
          <h1 className="text-4xl md:text-5xl font-black text-sketch-ink">My Projects</h1>
          <p className="text-gray-700 mt-2 font-semibold">
            Search, sort mentally, then jump into the work.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} /> New Project
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-sketch-ink" size={20} />
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 bg-white"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-sketch-ink border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-700 mt-4 font-semibold">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="text-center py-12 bg-white">
          <ClipboardList size={56} className="mx-auto mb-4 text-sketch-ink" />
          <p className="text-gray-700 font-semibold mb-4">
            {searchTerm ? 'No projects match your search' : 'No projects yet'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateModalOpen(true)}>Create Your First Project</Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <Link key={project._id} to={`/projects/${project._id}`}>
              <Card
                className={`cursor-pointer transition h-full bg-white ${
                  index % 2 === 0 ? 'rotate-[-0.25deg]' : 'rotate-[0.25deg]'
                }`}
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-doodle font-bold text-sketch-ink line-clamp-1">
                    {project.name}
                  </h3>
                  <p className="text-gray-700 text-sm mt-3 line-clamp-3 min-h-12">
                    {project.description || 'No description provided'}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t-2 border-dashed border-sketch-ink">
                  <div className="flex justify-between items-center text-xs text-gray-700 font-bold">
                    <span className="inline-flex items-center gap-1">
                      <Users size={14} /> {project.members} members
                    </span>
                    <span className="status-pill bg-[#DDFBEA] px-3 py-1">Active</span>
                  </div>
                  <div className="w-full h-3 bg-white border-2 border-sketch-ink rounded-full overflow-hidden">
                    <div className="h-full bg-sketch-accent" style={{ width: '75%' }} />
                  </div>
                  <div className="flex justify-end">
                    <ArrowRight size={18} className="text-sketch-primary" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

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
          <Input
            label="GitHub Repository (Optional)"
            name="githubRepo"
            placeholder="https://github.com/username/repo"
            value={values.githubRepo}
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
