import React, { useState, useEffect } from 'react';
import { BoMItem } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ManageBoMItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<BoMItem, 'id'> | BoMItem) => void;
  bomItem?: BoMItem;
}

const ManageBoMItemModal: React.FC<ManageBoMItemModalProps> = ({ isOpen, onClose, onSubmit, bomItem }) => {
  const [formData, setFormData] = useState({
    partNumber: '',
    revision: '',
    name: '',
    description: '',
    category: '',
    weight: '0',
    cost: '0',
  });

  const isEditMode = bomItem != null;

  useEffect(() => {
    if (bomItem) {
      setFormData({
        partNumber: bomItem.partNumber,
        revision: bomItem.revision,
        name: bomItem.name,
        description: bomItem.description,
        category: bomItem.category,
        weight: String(bomItem.weight),
        cost: String(bomItem.cost),
      });
    } else {
      // Reset for "add" mode
      setFormData({
        partNumber: '', revision: '', name: '', description: '', category: '', weight: '0', cost: '0',
      });
    }
  }, [bomItem, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submittedData = {
      ...formData,
      weight: parseFloat(formData.weight) || 0,
      cost: parseFloat(formData.cost) || 0,
    };

    if (isEditMode) {
      onSubmit({ ...submittedData, id: bomItem.id });
    } else {
      onSubmit(submittedData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit BoM Item' : 'Add BoM Item'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <Input name="name" label="Part Name" value={formData.name} onChange={handleChange} required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="partNumber" label="Part Number" value={formData.partNumber} onChange={handleChange} required />
            <Input name="revision" label="Revision" value={formData.revision} onChange={handleChange} />
          </div>
          <Input name="description" label="Description" value={formData.description} onChange={handleChange} />
          <Input name="category" label="Category" value={formData.category} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <Input name="cost" label="Cost" type="number" step="0.01" value={formData.cost} onChange={handleChange} />
            <Input name="weight" label="Weight" type="number" step="0.01" value={formData.weight} onChange={handleChange} />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditMode ? 'Save Changes' : 'Add Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ManageBoMItemModal;