
import React, { useMemo } from 'react';
import { Module, ModuleType, User, BoMItem } from '../types';
import ProgressBar from './ProgressBar';
import StepItem from './StepItem';
import Button from './ui/Button';
import { PlusIcon, TrashIcon, PencilIcon } from './ui/icons';

interface ModuleCardProps {
  module: Module;
  moduleType?: ModuleType;
  users: User[];
  onToggleStep: (moduleId: string, stepId: string) => void;
  onOpenImportBoMModal: (moduleId: string) => void;
  onOpenManageBoMItemModal: (moduleId: string, bomItem?: BoMItem) => void;
  onOpenEditModuleModal: (moduleId: string) => void;
  onRemoveBoMItem: (moduleId: string, bomItemId: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  module, 
  moduleType, 
  users, 
  onToggleStep, 
  onOpenImportBoMModal, 
  onOpenManageBoMItemModal,
  onOpenEditModuleModal,
  onRemoveBoMItem
}) => {
  const progress = useMemo(() => {
    if (!module.steps || module.steps.length === 0) return 0;
    const completedSteps = module.steps.filter(s => s.completed).length;
    return (completedSteps / module.steps.length) * 100;
  }, [module.steps]);

  return (
    <div className="bg-gray-900/50 rounded-lg border border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-semibold text-white">{module.name}</h3>
                <p className="text-xs text-gray-400">{moduleType?.name}</p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => onOpenEditModuleModal(module.id)}>
                <PencilIcon className="w-4 h-4" />
            </Button>
        </div>
        <div className="mt-3">
          <ProgressBar progress={progress} />
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Steps</h4>
        <ul className="space-y-2.5">
          {module.steps.map(step => (
            <StepItem
              key={step.id}
              step={step}
              user={users.find(u => u.id === step.completedBy)}
              onToggle={() => onToggleStep(module.id, step.id)}
            />
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-900/30">
        <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-300">Bill of Materials ({module.bom.length})</h4>
            <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => onOpenImportBoMModal(module.id)}>Import CSV</Button>
                <Button size="sm" variant="secondary" onClick={() => onOpenManageBoMItemModal(module.id)}>
                    <PlusIcon className="w-4 h-4"/>
                </Button>
            </div>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {module.bom.length > 0 ? module.bom.map(item => (
                <div key={item.id} className="text-xs flex items-center justify-between bg-gray-800 p-2 rounded">
                    <div>
                        <p className="text-gray-200 font-semibold">{item.name} <span className="text-gray-400 font-normal">({item.partNumber})</span></p>
                        <p className="text-gray-400">{item.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                         <button onClick={() => onOpenManageBoMItemModal(module.id, item)} className="p-1 text-gray-400 hover:text-cyan-400">
                            <PencilIcon className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onRemoveBoMItem(module.id, item.id)} className="p-1 text-gray-500 hover:text-red-400">
                            <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )) : (
                <p className="text-xs text-gray-500 italic text-center py-2">No BoM items.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
