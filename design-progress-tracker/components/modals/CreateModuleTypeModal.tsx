import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { suggestStepsForModuleType } from '../../services/geminiService';
// FIX: Removed unused XIcon import.
import { PlusIcon, SparklesIcon, TrashIcon } from '../ui/icons';

interface CreateModuleTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, stepsTemplate: { name: string }[]) => void;
}

const CreateModuleTypeModal: React.FC<CreateModuleTypeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [steps, setSteps] = useState<{ id: number; name: string }[]>([{ id: Date.now(), name: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStepChange = (id: number, value: string) => {
    setSteps(currentSteps => currentSteps.map(step => (step.id === id ? { ...step, name: value } : step)));
  };

  const addStep = () => {
    setSteps([...steps, { id: Date.now(), name: '' }]);
  };

  const removeStep = (id: number) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const handleSuggestSteps = async () => {
    if (!name.trim()) {
      setError('Please enter a module type name first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const suggestedSteps = await suggestStepsForModuleType(name);
      setSteps(suggestedSteps.map(step => ({ id: Date.now() + Math.random(), name: step.name })));
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSteps = steps.map(s => ({ name: s.name.trim() })).filter(s => s.name);
    if (name.trim() && finalSteps.length > 0) {
      onSubmit(name.trim(), finalSteps);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Module Type">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <Input
              label="Module Type Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., On-Board Computer"
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">Template Steps</label>
              <Button type="button" variant="outline" size="sm" onClick={handleSuggestSteps} disabled={isLoading}>
                {isLoading ? 'Thinking...' : <><SparklesIcon className="w-4 h-4 mr-2" /> Suggest with AI</>}
              </Button>
            </div>
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-2">
                  <Input
                    value={step.name}
                    onChange={(e) => handleStepChange(step.id, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                    className="flex-grow"
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    className="p-2 text-gray-400 hover:text-red-400"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
             <Button type="button" size="sm" variant="secondary" onClick={addStep} className="mt-2">
               <PlusIcon className="w-4 h-4 mr-2"/> Add Step
            </Button>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Type
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateModuleTypeModal;
