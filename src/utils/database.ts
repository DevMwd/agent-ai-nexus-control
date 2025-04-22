import { AIAgent, Service, LLMModelDetails } from '@/contexts/AgentContext';

class AgentsDatabase {
  private agents: AIAgent[] = [];
  private initialized = false;

  constructor() {}

  async initialize(data: AIAgent[]) {
    this.agents = data;
    this.initialized = true;
  }

  async getAll(): Promise<AIAgent[]> {
    return this.agents;
  }

  async getById(id: string): Promise<AIAgent | undefined> {
    return this.agents.find(agent => agent.id === id);
  }

  async update(updatedAgent: Partial<AIAgent> & { id: string }): Promise<void> {
    this.agents = this.agents.map(agent => 
      agent.id === updatedAgent.id ? { ...agent, ...updatedAgent } : agent
    );
  }

  async add(newAgent: AIAgent): Promise<void> {
    this.agents.push(newAgent);
  }

  async delete(id: string): Promise<void> {
    this.agents = this.agents.filter(agent => agent.id !== id);
  }
}

class ServicesDatabase {
  private services: Service[] = [];
  private initialized = false;

  constructor() {}

  async initialize(data: Service[]) {
    this.services = data;
    this.initialized = true;
  }

  async getAll(): Promise<Service[]> {
    return this.services;
  }

  async getById(id: string): Promise<Service | undefined> {
    return this.services.find(service => service.id === id);
  }

  async add(newService: Service): Promise<void> {
    this.services.push(newService);
  }

  async update(updatedService: Partial<Service> & { id: string }): Promise<void> {
    this.services = this.services.map(service =>
      service.id === updatedService.id ? { ...service, ...updatedService } : service
    );
  }

  async delete(id: string): Promise<void> {
    this.services = this.services.filter(service => service.id !== id);
  }
}

class LLMModelsDatabase {
  private llmModels: LLMModelDetails[] = [];
  private initialized = false;

  constructor() {}

  async initialize(data: LLMModelDetails[]) {
    this.llmModels = data;
    this.initialized = true;
  }

  async getAll(): Promise<LLMModelDetails[]> {
    return this.llmModels;
  }

   async getById(id: string): Promise<LLMModelDetails | undefined> {
    return this.llmModels.find(llmModel => llmModel.id === id);
  }

  async add(newLLMModel: LLMModelDetails): Promise<void> {
    this.llmModels.push(newLLMModel);
  }

  async update(updatedLLMModel: Partial<LLMModelDetails> & { id: string }): Promise<void> {
    this.llmModels = this.llmModels.map(llmModel =>
      llmModel.id === updatedLLMModel.id ? { ...llmModel, ...updatedLLMModel } : llmModel
    );
  }

  async delete(id: string): Promise<void> {
    this.llmModels = this.llmModels.filter(llmModel => llmModel.id !== id);
  }
}

export const agentsDB = new AgentsDatabase();
export const servicesDB = new ServicesDatabase();
export const llmModelsDB = new LLMModelsDatabase();

export const initializeDatabase = async (
  initialAgents: AIAgent[],
  initialServices: Service[],
  initialLLMModels: LLMModelDetails[]
): Promise<void> => {
  await agentsDB.initialize(initialAgents);
  await servicesDB.initialize(initialServices);
  await llmModelsDB.initialize(initialLLMModels);
};
