
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, id, options, className, ...props }) => {
  const selectId = id || `select-${Math.random()}`;
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-400">
        {label}
      </label>
      <select
        id={selectId}
        className={`block w-full pl-3 pr-10 py-1.5 text-base bg-gray-800 border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md text-white ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
