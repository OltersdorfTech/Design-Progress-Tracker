
import React from 'react';
import { Step, User } from '../types';

interface StepItemProps {
  step: Step;
  user?: User;
  onToggle: () => void;
}

const StepItem: React.FC<StepItemProps> = ({ step, user, onToggle }) => {
    
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

  return (
    <li className="flex items-start text-sm">
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={step.completed}
          onChange={onToggle}
          className="hidden"
        />
        <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center mr-3 ${step.completed ? 'bg-cyan-500 border-cyan-500' : 'border-gray-500'}`}>
          {step.completed && (
            <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20">
              <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
            </svg>
          )}
        </div>
        <span className={`transition-colors ${step.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
          {step.name}
        </span>
      </label>
      {step.completed && user && (
         <div className="ml-auto text-xs text-gray-400 flex-shrink-0 pl-2 text-right">
            <span>{user.name}</span>
            <span className="ml-1">({formatDate(step.completedAt)})</span>
         </div>
      )}
    </li>
  );
};

export default StepItem;
