
// Database utility for MySQL connection

// Using a TypeORM-like approach for database operations
import { AIAgent, Service, LLMModelDetails, LLMModel, ServiceCategory } from '@/contexts/AgentContext';

// Mock database connection for now
// In a real application, this would be a real database connection
const dbConnection = {
  connected: true,
  error: null
};

// Helper function to simulate database operations with localStorage
// This gives us persistence in the browser session
const getLocalStorage = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

const setLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// Database operations for Agents
export const agentsDB = {
  // Get all agents
  getAll: async (): Promise<AIAgent[]> => {
    try {
      const agents = getLocalStorage('agents');
      return agents || [];
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  },

  // Get agent by ID
  getById: async (id: string): Promise<AIAgent | null> => {
    try {
      const agents = getLocalStorage('agents');
      if (!agents) return null;
      return agents.find((agent: AIAgent) => agent.id === id) || null;
    } catch (error) {
      console.error('Error fetching agent by ID:', error);
      return null;
    }
  },

  // Create a new agent
  create: async (agent: AIAgent): Promise<AIAgent | null> => {
    try {
      const agents = getLocalStorage('agents') || [];
      const updatedAgents = [...agents, agent];
      setLocalStorage('agents', updatedAgents);
      return agent;
    } catch (error) {
      console.error('Error creating agent:', error);
      return null;
    }
  },

  // Update an agent
  update: async (updatedAgent: Partial<AIAgent> & { id: string }): Promise<AIAgent | null> => {
    try {
      const agents = getLocalStorage('agents') || [];
      const updatedAgents = agents.map((agent: AIAgent) => 
        agent.id === updatedAgent.id ? { ...agent, ...updatedAgent } : agent
      );
      setLocalStorage('agents', updatedAgents);
      
      // Return the updated agent
      const updated = updatedAgents.find((agent: AIAgent) => agent.id === updatedAgent.id);
      return updated || null;
    } catch (error) {
      console.error('Error updating agent:', error);
      return null;
    }
  },

  // Delete an agent
  delete: async (id: string): Promise<boolean> => {
    try {
      const agents = getLocalStorage('agents') || [];
      const updatedAgents = agents.filter((agent: AIAgent) => agent.id !== id);
      setLocalStorage('agents', updatedAgents);
      return true;
    } catch (error) {
      console.error('Error deleting agent:', error);
      return false;
    }
  }
};

// Database operations for Services
export const servicesDB = {
  getAll: async (): Promise<Service[]> => {
    try {
      const services = getLocalStorage('services');
      return services || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }
};

// Database operations for LLM Models
export const llmModelsDB = {
  getAll: async (): Promise<LLMModelDetails[]> => {
    try {
      const models = getLocalStorage('llmModels');
      return models || [];
    } catch (error) {
      console.error('Error fetching LLM models:', error);
      return [];
    }
  }
};

// Initialize the database with mock data
export const initializeDatabase = (
  mockAgents: AIAgent[], 
  mockServices: Service[], 
  mockLLMModels: LLMModelDetails[]
) => {
  // Check if data already exists
  const existingAgents = getLocalStorage('agents');
  const existingServices = getLocalStorage('services');
  const existingLLMModels = getLocalStorage('llmModels');

  // Only initialize if data doesn't exist
  if (!existingAgents) {
    setLocalStorage('agents', mockAgents);
  }
  if (!existingServices) {
    setLocalStorage('services', mockServices);
  }
  if (!existingLLMModels) {
    setLocalStorage('llmModels', mockLLMModels);
  }
};

export default {
  agentsDB,
  servicesDB,
  llmModelsDB,
  initializeDatabase
};
