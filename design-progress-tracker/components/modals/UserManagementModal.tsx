import React, { useState } from 'react';
import { User } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { PlusIcon, TrashIcon } from '../ui/icons';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUserId: string | null;
  onAddUser: (name: string) => void;
  onRemoveUser: (id: string) => void;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUserId,
  onAddUser,
  onRemoveUser,
}) => {
  const [newUserName, setNewUserName] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName.trim()) {
      onAddUser(newUserName.trim());
      setNewUserName('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Users">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Existing Users</h4>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2 border-b border-gray-700 pb-4">
            {users.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              const isLastUser = users.length <= 1;
              const canRemove = !isCurrentUser && !isLastUser;

              return (
                <div key={user.id} className="flex items-center justify-between bg-gray-700/50 p-2 rounded-md">
                  <span className={`text-sm ${isCurrentUser ? 'font-semibold text-cyan-400' : 'text-gray-300'}`}>
                    {user.name} {isCurrentUser && '(You)'}
                  </span>
                  <button
                    onClick={() => onRemoveUser(user.id)}
                    disabled={!canRemove}
                    className="p-1 text-gray-500 rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-500/20 hover:text-red-400"
                    aria-label={`Remove ${user.name}`}
                    title={isCurrentUser ? 'Cannot remove the active user' : isLastUser ? 'Cannot remove the last user' : 'Remove user'}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div>
           <h4 className="text-sm font-medium text-gray-400 mb-2">Add New User</h4>
            <form onSubmit={handleAddUser} className="flex items-center space-x-2">
                <Input
                label="New User Name"
                id="new-user-name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="e.g., Dana"
                className="flex-grow"
                />
                <Button type="submit" variant="secondary" className="self-end">
                    <PlusIcon className="w-4 h-4 mr-1" /> Add
                </Button>
            </form>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
          <Button type="button" variant="primary" onClick={onClose}>
            Done
          </Button>
      </div>
    </Modal>
  );
};

export default UserManagementModal;
