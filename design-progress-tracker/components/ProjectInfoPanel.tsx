
import React from 'react';
import { Project, SystemDefinition } from '../types';
import SystemDefinitionPanel from './SystemDefinitionPanel';

interface ProjectInfoPanelProps {
  project: Project;
  onAddSystemDefItem: (targetType: 'project' | 'endItem', id: string, itemType: keyof SystemDefinition, data: { name: string }) => void;
  onRemoveSystemDefItem: (targetType: 'project' | 'endItem', id: string, itemType: keyof SystemDefinition, itemId: string) => void;
}

const ProjectInfoPanel: React.FC<ProjectInfoPanelProps> = ({ project, onAddSystemDefItem, onRemoveSystemDefItem }) => {
  return (
    <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white">{project.name}</h1>
        <p className="mt-1 text-md text-gray-400">{project.description}</p>
      </div>
      <SystemDefinitionPanel
        title="Project-Level System Definition"
        definition={project.systemDefinition}
        onAddItem={(itemType, name) => onAddSystemDefItem('project', project.id, itemType, { name })}
        onRemoveItem={(itemType, itemId) => onRemoveSystemDefItem('project', project.id, itemType, itemId)}
      />
    </div>
  );
};

export default ProjectInfoPanel;
