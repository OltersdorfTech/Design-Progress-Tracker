
import React from 'react';
import { Project, User } from '../types';
import Button from './ui/Button';

interface HeaderProps {
  currentProject: Project | null;
  currentUser: User | null;
  onManageProjects: () => void;
  onManageUsers: () => void;
  onCreateEndItem: () => void;
  onCreateModule: () => void;
  onCreateModuleType: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentProject,
  currentUser,
  onManageProjects,
  onManageUsers,
  onCreateEndItem,
  onCreateModule,
  onCreateModuleType,
}) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">
              {currentProject ? currentProject.name : 'Project Tracker'}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
             <div className="text-sm text-gray-400">
                Welcome, <span className="font-semibold text-cyan-400">{currentUser?.name || 'Guest'}</span>
            </div>
            <div className="w-px h-6 bg-gray-700 mx-2"></div>
            <Button onClick={onManageProjects} variant="secondary" size="sm">Manage Projects</Button>
            <Button onClick={onManageUsers} variant="secondary" size="sm">Manage Users</Button>
            {currentProject && (
              <>
                 <Button onClick={onCreateEndItem} variant="outline" size="sm">New End-Item</Button>
                 <Button onClick={onCreateModuleType} variant="outline" size="sm">New Module Type</Button>
                 <Button onClick={onCreateModule} variant="primary" size="sm">New Module</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
