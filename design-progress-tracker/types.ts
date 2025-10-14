
export interface User {
  id: string;
  name: string;
}

export interface Step {
  id: string;
  name: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
}

export interface BoMItem {
  id: string;
  partNumber: string;
  revision: string;
  name: string;
  description: string;
  category: string;
  weight: number;
  cost: number;
}

export interface Module {
  id: string;
  name: string;
  typeId: string;
  endItemId: string;
  steps: Step[];
  bom: BoMItem[];
}

export interface ModuleType {
  id: string;
  name: string;
  stepsTemplate: { name: string }[];
}

export interface SystemIO {
    id: string;
    name: string;
}

export interface SystemDefinition {
    inputs: SystemIO[];
    outputs: SystemIO[];
    parameters: SystemIO[];
}

export interface EndItem {
  id: string;
  name: string;
  description: string;
  projectId: string;
  modules: Module[];
  systemDefinition: SystemDefinition;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  endItems: EndItem[];
  moduleTypes: ModuleType[];
  systemDefinition: SystemDefinition;
}
