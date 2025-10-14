
import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Project, User, SystemDefinition, BoMItem, ModuleType, EndItem, Module, SystemIO } from './types';
import { INITIAL_PROJECT, DEFAULT_USERS } from './constants';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CreateEndItemModal from './components/modals/CreateEndItemModal';
import CreateModuleTypeModal from './components/modals/CreateModuleTypeModal';
import AddModuleInstanceModal from './components/modals/AddModuleInstanceModal';
import EditModuleInstanceModal from './components/modals/EditModuleInstanceModal';
import UserManagementModal from './components/modals/UserManagementModal';
import ManageProjectsModal from './components/modals/ManageProjectsModal';
import ImportBoMModal from './components/modals/ImportBoMModal';
import ManageBoMItemModal from './components/modals/ManageBoMItemModal';

type ModalState = 'NONE' | 'CREATE_END_ITEM' | 'CREATE_MODULE_TYPE' | 'ADD_MODULE_INSTANCE' | 'EDIT_MODULE_INSTANCE' | 'MANAGE_USERS' | 'MANAGE_PROJECTS' | 'IMPORT_BOM' | 'MANAGE_BOM_ITEM';

const App: React.FC = () => {
    const [projects, setProjects] = useLocalStorage<Project[]>('projects', [INITIAL_PROJECT]);
    const [currentProjectId, setCurrentProjectId] = useLocalStorage<string | null>('currentProjectId', INITIAL_PROJECT.id);
    const [users, setUsers] = useLocalStorage<User[]>('users', DEFAULT_USERS);
    const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>('currentUserId', DEFAULT_USERS[0].id);

    const [activeModal, setActiveModal] = useState<ModalState>('NONE');
    const [modalContext, setModalContext] = useState<any>(null);

    const currentProject = projects.find(p => p.id === currentProjectId) || null;
    const currentUser = users.find(u => u.id === currentUserId) || null;

    // Helper functions to update state
    const updateProject = (updatedProject: Project) => {
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    };

    // Event Handlers
    const handleToggleStep = (moduleId: string, stepId: string) => {
        if (!currentProject || !currentUser) return;
        
        const updatedProject = { ...currentProject };
        let stepFound = false;

        for (const endItem of updatedProject.endItems) {
            const module = endItem.modules.find(m => m.id === moduleId);
            if (module) {
                const step = module.steps.find(s => s.id === stepId);
                if (step) {
                    step.completed = !step.completed;
                    step.completedBy = step.completed ? currentUser.id : undefined;
                    step.completedAt = step.completed ? new Date().toISOString() : undefined;
                    stepFound = true;
                    break;
                }
            }
        }
        
        if (stepFound) {
            updateProject(updatedProject);
        }
    };
    
    const handleAddSystemDefItem = (
        targetType: 'project' | 'endItem',
        id: string,
        itemType: keyof SystemDefinition,
        data: { name: string }
    ) => {
        if (!currentProject) return;
        const newItem: SystemIO = { id: `sysio-${Date.now()}`, name: data.name };
        const updatedProject = JSON.parse(JSON.stringify(currentProject));

        if (targetType === 'project') {
            updatedProject.systemDefinition[itemType].push(newItem);
        } else {
            const endItem = updatedProject.endItems.find((ei: EndItem) => ei.id === id);
            if (endItem) {
                endItem.systemDefinition[itemType].push(newItem);
            }
        }
        updateProject(updatedProject);
    };

    const handleRemoveSystemDefItem = (
        targetType: 'project' | 'endItem',
        id: string,
        itemType: keyof SystemDefinition,
        itemId: string
    ) => {
        if (!currentProject) return;
        const updatedProject = JSON.parse(JSON.stringify(currentProject));
        if (targetType === 'project') {
            updatedProject.systemDefinition[itemType] = updatedProject.systemDefinition[itemType].filter((i: SystemIO) => i.id !== itemId);
        } else {
            const endItem = updatedProject.endItems.find((ei: EndItem) => ei.id === id);
            if (endItem) {
                endItem.systemDefinition[itemType] = endItem.systemDefinition[itemType].filter((i: SystemIO) => i.id !== itemId);
            }
        }
        updateProject(updatedProject);
    };

    // Modal specific handlers
    const handleCreateEndItem = (name: string, description: string) => {
        if (!currentProject) return;
        const newEndItem: EndItem = {
            id: `ei-${Date.now()}`,
            name,
            description,
            projectId: currentProject.id,
            modules: [],
            systemDefinition: { inputs: [], outputs: [], parameters: [] },
        };
        const updatedProject = { ...currentProject, endItems: [...currentProject.endItems, newEndItem] };
        updateProject(updatedProject);
    };
    
    const handleCreateModuleType = (name: string, stepsTemplate: { name: string }[]) => {
        if (!currentProject) return;
        const newModuleType: ModuleType = {
            id: `mt-${Date.now()}`,
            name,
            stepsTemplate,
        };
        const updatedProject = { ...currentProject, moduleTypes: [...currentProject.moduleTypes, newModuleType] };
        updateProject(updatedProject);
    };

    const handleAddModuleInstance = (name: string, typeId: string, endItemId: string) => {
        if (!currentProject) return;
        const moduleType = currentProject.moduleTypes.find(mt => mt.id === typeId);
        if (!moduleType) return;

        const newModule: Module = {
            id: `mod-${Date.now()}`,
            name,
            typeId,
            endItemId,
            bom: [],
            steps: moduleType.stepsTemplate.map((step, index) => ({
                id: `step-${Date.now()}-${index}`,
                name: step.name,
                completed: false,
            })),
        };
        const updatedProject = JSON.parse(JSON.stringify(currentProject));
        const endItem = updatedProject.endItems.find((ei: EndItem) => ei.id === endItemId);
        if (endItem) {
            endItem.modules.push(newModule);
        }
        updateProject(updatedProject);
    };
    
    const handleEditModuleInstance = (moduleId: string, name: string, endItemId: string) => {
        if (!currentProject) return;
        const updatedProject = JSON.parse(JSON.stringify(currentProject));
        
        let moduleToMove: Module | null = null;
        let originalEndItemId: string | null = null;
        
        // Find and remove module from old end-item
        for(const ei of updatedProject.endItems) {
            const moduleIndex = ei.modules.findIndex((m: Module) => m.id === moduleId);
            if (moduleIndex > -1) {
                originalEndItemId = ei.id;
                moduleToMove = ei.modules[moduleIndex];
                if (ei.id !== endItemId) {
                    ei.modules.splice(moduleIndex, 1);
                }
                break;
            }
        }

        if (moduleToMove) {
            moduleToMove.name = name;
            moduleToMove.endItemId = endItemId;
            
            if (originalEndItemId !== endItemId) {
                // Add module to new end-item
                const newEndItem = updatedProject.endItems.find((ei: EndItem) => ei.id === endItemId);
                if (newEndItem) {
                    newEndItem.modules.push(moduleToMove);
                }
            }
        }
        updateProject(updatedProject);
    };

    const handleDeleteModuleInstance = (moduleId: string) => {
        if (!currentProject) return;
        const updatedProject = JSON.parse(JSON.stringify(currentProject));
        updatedProject.endItems.forEach((ei: EndItem) => {
            ei.modules = ei.modules.filter((m: Module) => m.id !== moduleId);
        });
        updateProject(updatedProject);
    };

    const handleImportBoM = (items: Omit<BoMItem, 'id'>[]) => {
        if (!currentProject || !modalContext?.moduleId) return;
        const newBoMItems = items.map(item => ({ ...item, id: `bom-${Date.now()}-${Math.random()}` }));
        
        const updatedProject = JSON.parse(JSON.stringify(currentProject));
        let moduleFound = false;
        for (const endItem of updatedProject.endItems) {
            const module = endItem.modules.find((m: Module) => m.id === modalContext.moduleId);
            if (module) {
                module.bom.push(...newBoMItems);
                moduleFound = true;
                break;
            }
        }
        if (moduleFound) {
            updateProject(updatedProject);
        }
    };

    const handleManageBoMItem = (item: Omit<BoMItem, 'id'> | BoMItem) => {
        if (!currentProject || !modalContext?.moduleId) return;
        const updatedProject = JSON.parse(JSON.stringify(currentProject));
        let moduleFound = false;
        for (const endItem of updatedProject.endItems) {
            const module = endItem.modules.find((m: Module) => m.id === modalContext.moduleId);
            if (module) {
                if ('id' in item) { // Edit
                    const itemIndex = module.bom.findIndex((i: BoMItem) => i.id === item.id);
                    if (itemIndex > -1) module.bom[itemIndex] = item;
                } else { // Add
                    module.bom.push({ ...item, id: `bom-${Date.now()}` });
                }
                moduleFound = true;
                break;
            }
        }
        if (moduleFound) {
            updateProject(updatedProject);
        }
    };
    
    const handleRemoveBoMItem = (moduleId: string, bomItemId: string) => {
        if (!currentProject) return;
        const updatedProject = JSON.parse(JSON.stringify(currentProject));
        let moduleFound = false;
        for (const endItem of updatedProject.endItems) {
            const module = endItem.modules.find((m: Module) => m.id === moduleId);
            if (module) {
                module.bom = module.bom.filter((i: BoMItem) => i.id !== bomItemId);
                moduleFound = true;
                break;
            }
        }
        if (moduleFound) {
            updateProject(updatedProject);
        }
    };
    
    // Project Management
    const handleAddProject = (name: string, description: string) => {
        const newProject: Project = {
            id: `proj-${Date.now()}`,
            name,
            description,
            endItems: [],
            moduleTypes: [],
            systemDefinition: { inputs: [], outputs: [], parameters: [] },
        };
        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        setCurrentProjectId(newProject.id);
    };

    const handleDeleteProject = (id: string) => {
        if (projects.length <= 1) {
            alert("Cannot delete the last project.");
            return;
        }
        const remainingProjects = projects.filter(p => p.id !== id);
        setProjects(remainingProjects);
        if (currentProjectId === id) {
            setCurrentProjectId(remainingProjects[0]?.id || null);
        }
    };

    // User Management
    const handleAddUser = (name: string) => {
        const newUser: User = { id: `user-${Date.now()}`, name };
        setUsers([...users, newUser]);
    };

    const handleRemoveUser = (id: string) => {
        if (users.length <= 1) {
            alert("Cannot remove the last user.");
            return;
        }
        setUsers(users.filter(u => u.id !== id));
    };


    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <Header
                currentProject={currentProject}
                currentUser={currentUser}
                onManageProjects={() => setActiveModal('MANAGE_PROJECTS')}
                onManageUsers={() => setActiveModal('MANAGE_USERS')}
                onCreateEndItem={() => setActiveModal('CREATE_END_ITEM')}
                onCreateModuleType={() => setActiveModal('CREATE_MODULE_TYPE')}
                onCreateModule={() => setActiveModal('ADD_MODULE_INSTANCE')}
            />
            <main>
                <Dashboard
                    project={currentProject}
                    users={users}
                    onToggleStep={handleToggleStep}
                    onAddSystemDefItem={handleAddSystemDefItem}
                    onRemoveSystemDefItem={handleRemoveSystemDefItem}
                    onManageProjects={() => setActiveModal('MANAGE_PROJECTS')}
                    onOpenImportBoMModal={(moduleId) => {
                        setModalContext({ moduleId });
                        setActiveModal('IMPORT_BOM');
                    }}
                    onOpenManageBoMItemModal={(moduleId, bomItem) => {
                        setModalContext({ moduleId, bomItem });
                        setActiveModal('MANAGE_BOM_ITEM');
                    }}
                    onOpenEditModuleModal={(moduleId) => {
                        const module = currentProject?.endItems.flatMap(ei => ei.modules).find(m => m.id === moduleId);
                        setModalContext({ module });
                        setActiveModal('EDIT_MODULE_INSTANCE');
                    }}
                    onRemoveBoMItem={handleRemoveBoMItem}
                />
            </main>

            {/* Modals */}
            <CreateEndItemModal
                isOpen={activeModal === 'CREATE_END_ITEM'}
                onClose={() => setActiveModal('NONE')}
                onSubmit={handleCreateEndItem}
            />
            <CreateModuleTypeModal
                isOpen={activeModal === 'CREATE_MODULE_TYPE'}
                onClose={() => setActiveModal('NONE')}
                onSubmit={handleCreateModuleType}
            />
            {currentProject && <AddModuleInstanceModal
                isOpen={activeModal === 'ADD_MODULE_INSTANCE'}
                onClose={() => setActiveModal('NONE')}
                onSubmit={handleAddModuleInstance}
                moduleTypes={currentProject.moduleTypes}
                endItems={currentProject.endItems}
            />}
            {currentProject && <EditModuleInstanceModal
                isOpen={activeModal === 'EDIT_MODULE_INSTANCE'}
                onClose={() => setActiveModal('NONE')}
                onSubmit={handleEditModuleInstance}
                onDelete={handleDeleteModuleInstance}
                module={modalContext?.module}
                endItems={currentProject.endItems}
            />}
            <UserManagementModal
                isOpen={activeModal === 'MANAGE_USERS'}
                onClose={() => setActiveModal('NONE')}
                users={users}
                currentUserId={currentUserId}
                onAddUser={handleAddUser}
                onRemoveUser={handleRemoveUser}
            />
            <ManageProjectsModal
                isOpen={activeModal === 'MANAGE_PROJECTS'}
                onClose={() => setActiveModal('NONE')}
                projects={projects}
                currentProjectId={currentProjectId}
                onSelectProject={setCurrentProjectId}
                onAddProject={handleAddProject}
                onDeleteProject={handleDeleteProject}
            />
            <ImportBoMModal 
                isOpen={activeModal === 'IMPORT_BOM'}
                onClose={() => setActiveModal('NONE')}
                onImport={handleImportBoM}
            />
            <ManageBoMItemModal
                isOpen={activeModal === 'MANAGE_BOM_ITEM'}
                onClose={() => setActiveModal('NONE')}
                onSubmit={handleManageBoMItem}
                bomItem={modalContext?.bomItem}
            />
        </div>
    );
};

export default App;
