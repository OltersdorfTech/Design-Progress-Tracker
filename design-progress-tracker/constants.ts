
import { Project, User } from './types';

export const DEFAULT_USERS: User[] = [
  { id: 'user-1', name: 'Alex' },
  { id: 'user-2', name: 'Sam' },
];

const initialSystemDefinition = {
  inputs: [],
  outputs: [],
  parameters: [],
};

export const INITIAL_PROJECT: Project = {
  id: 'proj-1',
  name: 'Aries V Launch Vehicle',
  description: 'A reusable heavy-lift launch vehicle for lunar and interplanetary missions.',
  systemDefinition: { ...initialSystemDefinition },
  moduleTypes: [
    {
      id: 'mt-1',
      name: 'Avionics Bus',
      stepsTemplate: [
        { name: 'Finalize schematics' },
        { name: 'Layout PCB' },
        { name: 'Procure components' },
        { name: 'Assemble prototype' },
        { name: 'Functional testing' },
        { name: 'Environmental testing (Vibe)' },
        { name: 'Software integration' },
      ],
    },
    {
      id: 'mt-2',
      name: 'Primary Structure',
      stepsTemplate: [
        { name: 'Structural analysis' },
        { name: 'CAD modeling' },
        { name: 'Material procurement' },
        { name: 'Fabrication' },
        { name: 'Load testing' },
        { name: 'Integration' },
      ],
    },
  ],
  endItems: [
    {
      id: 'ei-1',
      name: 'First Stage',
      description: 'The primary booster stage with 9 rocket engines.',
      projectId: 'proj-1',
      systemDefinition: { ...initialSystemDefinition },
      modules: [
        {
          id: 'mod-1',
          name: 'FS Avionics',
          typeId: 'mt-1',
          endItemId: 'ei-1',
          bom: [],
          steps: [
            { id: 's-1-1', name: 'Finalize schematics', completed: true, completedBy: 'user-1', completedAt: new Date().toISOString() },
            { id: 's-1-2', name: 'Layout PCB', completed: true, completedBy: 'user-2', completedAt: new Date().toISOString() },
            { id: 's-1-3', name: 'Procure components', completed: false },
            { id: 's-1-4', name: 'Assemble prototype', completed: false },
            { id: 's-1-5', name: 'Functional testing', completed: false },
            { id: 's-1-6', name: 'Environmental testing (Vibe)', completed: false },
            { id: 's-1-7', name: 'Software integration', completed: false },
          ],
        },
        {
          id: 'mod-2',
          name: 'FS Thrust Structure',
          typeId: 'mt-2',
          endItemId: 'ei-1',
          bom: [],
          steps: [
            { id: 's-2-1', name: 'Structural analysis', completed: true, completedBy: 'user-1', completedAt: new Date().toISOString() },
            { id: 's-2-2', name: 'CAD modeling', completed: false },
            { id: 's-2-3', name: 'Material procurement', completed: false },
            { id: 's-2-4', name: 'Fabrication', completed: false },
            { id: 's-2-5', name: 'Load testing', completed: false },
            { id: 's-2-6', name: 'Integration', completed: false },
          ],
        },
      ],
    },
  ],
};
