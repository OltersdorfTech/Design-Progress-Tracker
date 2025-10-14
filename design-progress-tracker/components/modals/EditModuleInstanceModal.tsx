
import React, { useState, useEffect } from 'react';
import { Module, EndItem } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';

interface EditModuleInstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (moduleId: string, name: string, endItemId: string) => void;
  onDelete: (moduleId: string) => void;
  module: Module | null;
  endItems: EndItem[];
}

const EditModuleInstanceModal: React.FC<EditModuleInstanceModalProps> = ({ isOpen, onClose, onSubmit, onDelete, module, endItems }) => {
  const [name, setName] = useState('');
  const [endItemId, setEndItemId] = useState<string>('');

  useEffect(() => {
    if (isOpen && module) {
      setName(module.name);
      setEndItemId(module.endItemId);
    }
  }, [isOpen, module]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (module && name.trim() && endItemId) {
      onSubmit(module.id, name.trim(), endItemId);
      onClose();
    }
  };

  const handleDelete = () => {
    if (module && window.confirm(`Are you sure you want to delete the module "${module.name}"? This cannot be undone.`)) {
      onDelete(module.id);
      onClose();
    }
  };

  if (!module) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Module">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Module Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
           <Select
            label="Assigned End-Item"
            value={endItemId}
            onChange={(e) => setEndItemId(e.target.value)}
            options={endItems.map(ei => ({ value: ei.id, label: ei.name }))}
          />
        </div>
        <div className="mt-6 flex justify-between">
          <Button type="button" variant="secondary" onClick={handleDelete} className="bg-red-800 hover:bg-red-700 text-red-100">
            Delete Module
          </Button>
          <div className="space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditModuleInstanceModal;
