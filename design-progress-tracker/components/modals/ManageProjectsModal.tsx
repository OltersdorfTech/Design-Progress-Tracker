import React, { useState } from 'react';
import { Project } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { PlusIcon, TrashIcon } from '../ui/icons';

interface ManageProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  currentProjectId: string | null;
  onSelectProject: (id: string) => void;
  onAddProject: (name: string, description: string) => void;
  onDeleteProject: (id: string) => void;
}

const ManageProjectsModal: React.FC<ManageProjectsModalProps> = ({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onAddProject,
  onDeleteProject,
}) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onAddProject(newProjectName.trim(), newProjectDesc.trim());
      setNewProjectName('');
      setNewProjectDesc('');
      setIsCreating(false);
    }
  };

  const handleSelectProject = (id: string) => {
    onSelectProject(id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Projects">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Existing Projects</h4>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2 border-b border-gray-700 pb-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between bg-gray-700/50 p-2 rounded-md">
                <button
                  onClick={() => handleSelectProject(project.id)}
                  className={`text-left text-sm flex-grow ${project.id === currentProjectId ? 'font-semibold text-cyan-400' : 'text-gray-300 hover:text-white'}`}
                >
                  {project.name} {project.id === currentProjectId && '(Current)'}
                </button>
                {project.id !== currentProjectId && (
                  <button
                    onClick={() => onDeleteProject(project.id)}
                    className="p-1 text-gray-500 rounded-md hover:bg-red-500/20 hover:text-red-400"
                    aria-label={`Delete ${project.name}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {isCreating ? (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Create New Project</h4>
            <form onSubmit={handleAddProject} className="space-y-3">
              <Input
                label="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g., Mission Jupiter"
                required
              />
              <Input
                label="Description"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                placeholder="A brief project description"
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Create</Button>
              </div>
            </form>
          </div>
        ) : (
          <Button onClick={() => setIsCreating(true)} variant="outline" className="w-full">
            <PlusIcon className="w-4 h-4 mr-2" /> Create New Project
          </Button>
        )}
      </div>
      <div className="mt-6 flex justify-end">
        <Button type="button" variant="primary" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
};

export default ManageProjectsModal;
