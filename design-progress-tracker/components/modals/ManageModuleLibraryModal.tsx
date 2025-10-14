
import React from 'react';
import { ModuleType } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { TrashIcon } from '../ui/icons';

interface ManageModuleLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleTypes: ModuleType[];
  onDelete: (moduleTypeId: string) => void;
  onAdd: () => void;
}

const ManageModuleLibraryModal: React.FC<ManageModuleLibraryModalProps> = ({ isOpen, onClose, moduleTypes, onDelete, onAdd }) => {
  
  const handleAdd = () => {
    onAdd();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Module Type Library">
      <div className="space-y-4">
        <div className="flex justify-end">
            <Button onClick={handleAdd}>Add New Module Type</Button>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
            {moduleTypes.map(mt => (
                <div key={mt.id} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-md">
                    <div>
                        <p className="font-semibold text-gray-200">{mt.name}</p>
                        <p className="text-xs text-gray-400">{mt.stepsTemplate.length} template steps</p>
                    </div>
                    <div className="space-x-2">
                        <Button variant="secondary" size="sm" onClick={() => onDelete(mt.id)} className="hover:bg-red-500/20 hover:text-red-400">
                            <TrashIcon className="w-4 h-4"/>
                        </Button>
                    </div>
                </div>
            ))}
            {moduleTypes.length === 0 && (
                <p className="text-center text-gray-500 py-4">No module types in library.</p>
            )}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
          <Button type="button" variant="primary" onClick={onClose}>
            Done
          </Button>
      </div>
    </Modal>
  );
};

export default ManageModuleLibraryModal;
