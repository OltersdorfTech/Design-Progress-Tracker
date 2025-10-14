
import React from 'react';
import { Project, User, SystemDefinition, BoMItem } from '../types';
import ProjectInfoPanel from './ProjectInfoPanel';
import EndItemCard from './EndItemCard';
import Button from './ui/Button';

interface DashboardProps {
  project: Project | null;
  users: User[];
  onToggleStep: (moduleId: string, stepId: string) => void;
  onAddSystemDefItem: (targetType: 'project' | 'endItem', id: string, itemType: keyof SystemDefinition, data: { name: string }) => void;
  onRemoveSystemDefItem: (targetType: 'project' | 'endItem', id: string, itemType: keyof SystemDefinition, itemId: string) => void;
  onManageProjects: () => void;
  onOpenImportBoMModal: (moduleId: string) => void;
  onOpenManageBoMItemModal: (moduleId: string, bomItem?: BoMItem) => void;
  onOpenEditModuleModal: (moduleId: string) => void;
  onRemoveBoMItem: (moduleId: string, bomItemId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  project, 
  users, 
  onToggleStep, 
  onAddSystemDefItem, 
  onRemoveSystemDefItem, 
  onManageProjects,
  onOpenImportBoMModal,
  onOpenManageBoMItemModal,
  onOpenEditModuleModal,
  onRemoveBoMItem
}) => {
  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-white">No Project Selected</h2>
        <p className="mt-2 text-gray-400">Please select a project to view its details or create a new one.</p>
        <Button onClick={onManageProjects} className="mt-6">
            Manage Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProjectInfoPanel 
        project={project}
        onAddSystemDefItem={onAddSystemDefItem}
        onRemoveSystemDefItem={onRemoveSystemDefItem}
      />

      <div className="space-y-8">
        {project.endItems.map(endItem => (
          <EndItemCard
            key={endItem.id}
            endItem={endItem}
            moduleTypes={project.moduleTypes}
            users={users}
            onToggleStep={onToggleStep}
            onAddSystemDefItem={onAddSystemDefItem}
            onRemoveSystemDefItem={onRemoveSystemDefItem}
            onOpenImportBoMModal={onOpenImportBoMModal}
            onOpenManageBoMItemModal={onOpenManageBoMItemModal}
            onOpenEditModuleModal={onOpenEditModuleModal}
            onRemoveBoMItem={onRemoveBoMItem}
          />
        ))}
         {project.endItems.length === 0 && (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
              <h3 className="text-xl font-medium text-white">No End-Items</h3>
              <p className="mt-1 text-gray-400">This project doesn't have any end-items yet. Create one to get started.</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default Dashboard;
