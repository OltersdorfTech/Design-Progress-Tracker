import React, { useState } from 'react';
import { SystemDefinition, SystemIO } from '../types';
import Input from './ui/Input';
import Button from './ui/Button';
import { PlusIcon, TrashIcon, ChevronDownIcon } from './ui/icons';

type ItemType = keyof SystemDefinition;

interface SystemDefinitionPanelProps {
  title: string;
  definition: SystemDefinition;
  onAddItem: (itemType: ItemType, name: string) => void;
  onRemoveItem: (itemType: ItemType, itemId: string) => void;
}

const DefinitionSection: React.FC<{
  title: string;
  items: SystemIO[];
  itemType: ItemType;
  onAddItem: (itemType: ItemType, name: string) => void;
  onRemoveItem: (itemType: ItemType, itemId: string) => void;
}> = ({ title, items, itemType, onAddItem, onRemoveItem }) => {
  const [newItemName, setNewItemName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onAddItem(itemType, newItemName.trim());
      setNewItemName('');
    }
  };

  return (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
      <h4 className="font-semibold text-cyan-400 mb-3">{title}</h4>
      <ul className="space-y-2 mb-4 h-32 overflow-y-auto pr-2">
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between bg-gray-800 p-2 rounded-md text-sm">
            <span className="text-gray-300">{item.name}</span>
            <button onClick={() => onRemoveItem(itemType, item.id)} className="text-gray-500 hover:text-red-400">
              <TrashIcon className="w-4 h-4" />
            </button>
          </li>
        ))}
        {items.length === 0 && <p className="text-gray-500 text-sm italic">No {title.toLowerCase()} defined.</p>}
      </ul>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input
          value={newItemName}
          onChange={e => setNewItemName(e.target.value)}
          placeholder={`New ${title.slice(0, -1)}...`}
          className="flex-grow text-sm py-1.5"
        />
        <Button type="submit" size="sm" variant="secondary" className="px-2 py-1.5">
          <PlusIcon className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

const SystemDefinitionPanel: React.FC<SystemDefinitionPanelProps> = ({ title, definition, onAddItem, onRemoveItem }) => {
  return (
    <details className="group bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800">
        <h3 className="font-semibold text-lg text-gray-200">{title}</h3>
        <ChevronDownIcon className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
      </summary>
      <div className="p-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
        <DefinitionSection 
            title="Inputs" 
            items={definition.inputs} 
            itemType="inputs"
            onAddItem={onAddItem} 
            onRemoveItem={onRemoveItem} 
        />
        <DefinitionSection 
            title="Outputs" 
            items={definition.outputs} 
            itemType="outputs"
            onAddItem={onAddItem} 
            onRemoveItem={onRemoveItem} 
        />
        <DefinitionSection 
            title="Parameters" 
            items={definition.parameters} 
            itemType="parameters"
            onAddItem={onAddItem} 
            onRemoveItem={onRemoveItem} 
        />
      </div>
    </details>
  );
};

export default SystemDefinitionPanel;