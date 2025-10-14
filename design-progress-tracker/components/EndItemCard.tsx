
import React, { useMemo } from 'react';
import { EndItem, ModuleType, User, SystemDefinition, BoMItem } from '../types';
import ModuleCard from './ModuleCard';
import ProgressBar from './ProgressBar';
import SystemDefinitionPanel from './SystemDefinitionPanel';

interface EndItemCardProps {
  endItem: EndItem;
  moduleTypes: ModuleType[];
  users: User[];
  onToggleStep: (moduleId: string, stepId: string) => void;
  onAddSystemDefItem: (targetType: 'project' | 'endItem', id: string, itemType: keyof SystemDefinition, data: { name: string }) => void;
  onRemoveSystemDefItem: (targetType: 'project' | 'endItem', id: string, itemType: keyof SystemDefinition, itemId: string) => void;
  onOpenImportBoMModal: (moduleId: string) => void;
  onOpenManageBoMItemModal: (moduleId: string, bomItem?: BoMItem) => void;
  onOpenEditModuleModal: (moduleId: string) => void;
  onRemoveBoMItem: (moduleId: string, bomItemId: string) => void;
}

const EndItemCard: React.FC<EndItemCardProps> = ({ 
    endItem, 
    moduleTypes, 
    users, 
    onToggleStep, 
    onAddSystemDefItem, 
    onRemoveSystemDefItem,
    onOpenImportBoMModal,
    onOpenManageBoMItemModal,
    onOpenEditModuleModal,
    onRemoveBoMItem
}) => {
  const progress = useMemo(() => {
    const allModules = endItem.modules;
    if (!allModules || allModules.length === 0) return 0;

    const totalSteps = allModules.reduce((sum, module) => sum + (module.steps?.length || 0), 0);
    if (totalSteps === 0) return 0;

    const completedSteps = allModules.reduce((sum, module) => {
      return sum + (module.steps?.filter(s => s.completed).length || 0);
    }, 0);

    return (completedSteps / totalSteps) * 100;
  }, [endItem.modules]);

  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg overflow-hidden border border-gray-700">
      <div className="p-4 sm:p-6 bg-gray-800">
        <h2 className="text-xl font-bold text-cyan-400">{endItem.name}</h2>
        <p className="mt-1 text-sm text-gray-400">{endItem.description}</p>
        <div className="mt-4">
          <ProgressBar progress={progress} label="Overall Progress" />
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-6">
        <SystemDefinitionPanel 
            title="System Definition"
            definition={endItem.systemDefinition}
            onAddItem={(itemType, name) => onAddSystemDefItem('endItem', endItem.id, itemType, { name })}
            onRemoveItem={(itemType, itemId) => onRemoveSystemDefItem('endItem', endItem.id, itemType, itemId)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {endItem.modules.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              moduleType={moduleTypes.find(mt => mt.id === module.typeId)}
              users={users}
              onToggleStep={onToggleStep}
              onOpenImportBoMModal={onOpenImportBoMModal}
              onOpenManageBoMItemModal={onOpenManageBoMItemModal}
              onOpenEditModuleModal={onOpenEditModuleModal}
              onRemoveBoMItem={onRemoveBoMItem}
            />
          ))}
          {endItem.modules.length === 0 && (
            <div className="md:col-span-2 xl:col-span-3 text-center py-8 text-gray-500">
              No modules assigned to this end-item.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EndItemCard;
