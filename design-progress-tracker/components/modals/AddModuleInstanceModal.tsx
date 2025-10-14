
import React, { useState, useEffect } from 'react';
import { ModuleType, EndItem } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';

interface AddModuleInstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, typeId: string, endItemId: string) => void;
  moduleTypes: ModuleType[];
  endItems: EndItem[];
}

const AddModuleInstanceModal: React.FC<AddModuleInstanceModalProps> = ({ isOpen, onClose, onSubmit, moduleTypes, endItems }) => {
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState<string>('');
  const [endItemId, setEndItemId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setTypeId(moduleTypes[0]?.id || '');
      setEndItemId(endItems[0]?.id || '');
    }
  }, [isOpen, moduleTypes, endItems]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && typeId && endItemId) {
      onSubmit(name.trim(), typeId, endItemId);
      onClose();
    }
  };

  const canSubmit = name.trim() && typeId && endItemId;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Module">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Module Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Flight Computer Alpha"
            required
          />
           <Select
            label="Assign to End-Item"
            value={endItemId}
            onChange={(e) => setEndItemId(e.target.value)}
            options={endItems.map(ei => ({ value: ei.id, label: ei.name }))}
            />
          <Select
            label="Module Type"
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
            options={moduleTypes.map(mt => ({ value: mt.id, label: mt.name }))}
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!canSubmit}>
            Create Module
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddModuleInstanceModal;
