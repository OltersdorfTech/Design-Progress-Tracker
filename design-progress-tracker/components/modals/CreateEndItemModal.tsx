
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface CreateEndItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
}

const CreateEndItemModal: React.FC<CreateEndItemModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), description.trim());
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New End-Item">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="End-Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Satellite Bus"
            required
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief description of the end-item"
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEndItemModal;
