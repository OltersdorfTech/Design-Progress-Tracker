
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  const inputId = id || `input-${Math.random()}`;
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
