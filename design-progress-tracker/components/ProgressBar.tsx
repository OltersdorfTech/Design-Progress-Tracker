
import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label = 'Progress' }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm font-medium text-gray-300">{Math.round(clampedProgress)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
