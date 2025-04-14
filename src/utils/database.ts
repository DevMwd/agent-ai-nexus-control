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

// Enhanced Database operations for Services
export const servicesDB = {
  getAll: async (): Promise<Service[]> => {
    try {
      const services = getLocalStorage('services');
      return services || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Service | null> => {
    try {
      const services = getLocalStorage('services') || [];
      return services.find((service: Service) => service.id === id) || null;
    } catch (error) {
      console.error('Error fetching service by ID:', error);
      return null;
    }
  },
  
  create: async (service: Service): Promise<Service | null> => {
    try {
      const services = getLocalStorage('services') || [];
      const updatedServices = [...services, service];
      setLocalStorage('services', updatedServices);
      return service;
    } catch (error) {
      console.error('Error creating service:', error);
      return null;
    }
  },
  
  update: async (updatedService: Partial<Service> & { id: string }): Promise<Service | null> => {
    try {
      const services = getLocalStorage('services') || [];
      const updatedServices = services.map((service: Service) => 
        service.id === updatedService.id ? { ...service, ...updatedService } : service
      );
      setLocalStorage('services', updatedServices);
      
      // Return the updated service
      const updated = updatedServices.find((service: Service) => service.id === updatedService.id);
      return updated || null;
    } catch (error) {
      console.error('Error updating service:', error);
      return null;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      const services = getLocalStorage('services') || [];
      const updatedServices = services.filter((service: Service) => service.id !== id);
      setLocalStorage('services', updatedServices);
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      return false;
    }
  }
};

// Enhanced Database operations for LLM Models
export const llmModelsDB = {
  getAll: async (): Promise<LLMModelDetails[]> => {
    try {
      const models = getLocalStorage('llmModels');
      return models || [];
    } catch (error) {
      console.error('Error fetching LLM models:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<LLMModelDetails | null> => {
    try {
      const models = getLocalStorage('llmModels') || [];
      return models.find((model: LLMModelDetails) => model.id === id) || null;
    } catch (error) {
      console.error('Error fetching LLM model by ID:', error);
      return null;
    }
  },
  
  create: async (model: LLMModelDetails): Promise<LLMModelDetails | null> => {
    try {
      const models = getLocalStorage('llmModels') || [];
      const updatedModels = [...models, model];
      setLocalStorage('llmModels', updatedModels);
      return model;
    } catch (error) {
      console.error('Error creating LLM model:', error);
      return null;
    }
  },
  
  update: async (updatedModel: Partial<LLMModelDetails> & { id: string }): Promise<LLMModelDetails | null> => {
    try {
      const models = getLocalStorage('llmModels') || [];
      const updatedModels = models.map((model: LLMModelDetails) => 
        model.id === updatedModel.id ? { ...model, ...updatedModel } : model
      );
      setLocalStorage('llmModels', updatedModels);
      
      // Return the updated model
      const updated = updatedModels.find((model: LLMModelDetails) => model.id === updatedModel.id);
      return updated || null;
    } catch (error) {
      console.error('Error updating LLM model:', error);
      return null;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      const models = getLocalStorage('llmModels') || [];
      const updatedModels = models.filter((model: LLMModelDetails) => model.id !== id);
      setLocalStorage('llmModels', updatedModels);
      return true;
    } catch (error) {
      console.error('Error deleting LLM model:', error);
      return false;
    }
  },
  
  search: async (query: string): Promise<LLMModelDetails[]> => {
    try {
      const models = getLocalStorage('llmModels') || [];
      if (!query) return models;
      
      const lowercaseQuery = query.toLowerCase();
      return models.filter((model: LLMModelDetails) => 
        model.name.toLowerCase().includes(lowercaseQuery) ||
        model.provider.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching LLM models:', error);
      return [];
    }
  }
};

// Enhanced database initialization with more LLM models
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
    // Add more LLM models if we're initializing for the first time
    const enhancedLLMModels = [
      ...mockLLMModels,
      {
        id: '12',
        name: 'GPT-4o',
        provider: 'OpenAI',
        inputCost: 0.0000025,
        outputCost: 0.00001,
        maxContext: '128K tokens',
        strengths: [
          'Capacità multimodali avanzate',
          'Prestazioni elevate su compiti complessi',
          'Eccellente ragionamento e comprensione contestuale'
        ],
        limitations: [
          'Costo più elevato rispetto a modelli meno potenti',
          'Può risultare eccessivo per compiti semplici'
        ]
      },
      {
        id: '13',
        name: 'Claude 3 Opus',
        provider: 'Anthropic',
        inputCost: 0.000015,
        outputCost: 0.000075,
        maxContext: '200K tokens',
        strengths: [
          'Prestazioni al top della categoria',
          'Eccellente per ragionamento complesso',
          'Contesto molto ampio'
        ],
        limitations: [
          'Costo molto elevato',
          'Velocità di risposta più lenta rispetto a modelli più leggeri'
        ]
      },
      {
        id: '14',
        name: 'Claude 3 Sonnet',
        provider: 'Anthropic',
        inputCost: 0.000003,
        outputCost: 0.000015,
        maxContext: '200K tokens',
        strengths: [
          'Ottimo equilibrio tra prestazioni e costi',
          'Contesto ampio',
          'Buone capacità di ragionamento'
        ],
        limitations: [
          'Meno potente rispetto a Opus',
          'Potrebbe non eccellere in compiti estremamente complessi'
        ]
      },
      {
        id: '15',
        name: 'Claude 3 Haiku',
        provider: 'Anthropic',
        inputCost: 0.00000025,
        outputCost: 0.00000125,
        maxContext: '200K tokens',
        strengths: [
          'Risposte rapide ed efficienti',
          'Costo molto contenuto',
          'Contesto ampio'
        ],
        limitations: [
          'Meno potente rispetto a Sonnet e Opus',
          'Non ottimale per compiti complessi'
        ]
      },
      {
        id: '16',
        name: 'Claude 3.5 Haiku',
        provider: 'Anthropic',
        inputCost: 0.00000025,
        outputCost: 0.00000125,
        maxContext: '200K tokens',
        strengths: [
          'Ottimizzato per assistenza clienti',
          'Eccellente per applicazioni didattiche',
          'Risposta rapida con costo contenuto'
        ],
        limitations: [
          'Limitato in compiti di ragionamento avanzato',
          'Performance inferiori su attività creative complesse'
        ]
      },
      {
        id: '17',
        name: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        inputCost: 0.000003,
        outputCost: 0.000015,
        maxContext: '200K tokens',
        strengths: [
          'Miglioramenti significativi rispetto alla versione precedente',
          'Eccellente per compiti aziendali',
          'Buon equilibrio prestazioni/costo'
        ],
        limitations: [
          'Meno potente rispetto a Opus',
          'Prestazioni inferiori su compiti molto specializzati'
        ]
      },
      {
        id: '18',
        name: 'GPT-4.5',
        provider: 'OpenAI',
        inputCost: 0.000075,
        outputCost: 0.00015,
        maxContext: '128K tokens',
        strengths: [
          'Comprensione linguistica avanzata',
          'Supporto per analisi di immagini',
          'Eccellente per compiti complessi e creativi'
        ],
        limitations: [
          'Costo molto elevato',
          'Può essere lento su richieste complesse'
        ]
      },
      {
        id: '19',
        name: 'DeepSeek V3',
        provider: 'DeepSeek',
        inputCost: 0.00000027,
        outputCost: 0.0000011,
        maxContext: '128K tokens',
        strengths: [
          'Open-source con prestazioni elevate',
          'Costo notevolmente inferiore rispetto a GPT-4o',
          'Buona comprensione tecnica e scientifica'
        ],
        limitations: [
          'Meno multimodale rispetto ai modelli OpenAI',
          'Supporto e documentazione meno estesi'
        ]
      },
      {
        id: '20',
        name: 'Gemini 2.0 Flash',
        provider: 'Google',
        inputCost: 0.00000015,
        outputCost: 0.0000006,
        maxContext: '1M tokens',
        strengths: [
          'Costo ultra-basso',
          'Contesto enorme fino a 1 milione di token',
          'Ottimo per attività semplici ad alto volume'
        ],
        limitations: [
          'Performance inferiori su compiti complessi',
          'Meno preciso dei modelli premium'
        ]
      },
      {
        id: '21',
        name: 'Gemini 1.5 Pro',
        provider: 'Google',
        inputCost: 0.0000035,
        outputCost: 0.0000105,
        maxContext: '128K tokens',
        strengths: [
          'Eccellente integrazione con servizi Google',
          'Buone prestazioni multimodali',
          'Buon equilibrio tra costo e qualità'
        ],
        limitations: [
          'Meno adatto per compiti altamente specializzati',
          'Meno personalizzabile rispetto ad alcuni competitor'
        ]
      },
      {
        id: '22',
        name: 'Mistral Large',
        provider: 'Mistral AI',
        inputCost: 0.000008,
        outputCost: 0.000008,
        maxContext: '32K tokens',
        strengths: [
          'Prestazioni elevate',
          'Eccellente comprensione in diverse lingue',
          'Costo inferiore a GPT-4'
        ],
        limitations: [
          'Contesto più limitato rispetto ad altri modelli top',
          'Meno capacità multimodali'
        ]
      },
      {
        id: '23',
        name: 'Mistral 7B',
        provider: 'Mistral AI',
        inputCost: 0,
        outputCost: 0,
        maxContext: '8K tokens',
        strengths: [
          'Completamente gratuito',
          'Leggero e veloce',
          'Può essere eseguito localmente'
        ],
        limitations: [
          'Contesto limitato a 8K token',
          'Performance inferiori su compiti complessi',
          'Limitata capacità di ragionamento avanzato'
        ]
      },
      {
        id: '24',
        name: 'LLaMA 3.1 70B',
        provider: 'Meta',
        inputCost: 0,
        outputCost: 0,
        maxContext: '128K tokens',
        strengths: [
          'Open-source e gratuito',
          'Prestazioni elevate paragonabili a modelli commerciali',
          'Ampio contesto fino a 128K token'
        ],
        limitations: [
          'Richiede hardware potente per l\'esecuzione locale',
          'Può richiedere fine-tuning per casi d\'uso specifici'
        ]
      },
      {
        id: '25',
        name: 'Yi 34B',
        provider: '01.AI',
        inputCost: 0,
        outputCost: 0,
        maxContext: '65K tokens',
        strengths: [
          'Open-source e gratuito',
          'Prestazioni sorprendenti per un modello di dimensioni medie',
          'Buon supporto multilingue'
        ],
        limitations: [
          'Meno conosciuto rispetto ad altri modelli',
          'Supporto più limitato della community'
        ]
      },
      {
        id: '26',
        name: 'Qwen',
        provider: 'Alibaba',
        inputCost: 0,
        outputCost: 0,
        maxContext: '32K tokens',
        strengths: [
          'Eccellente supporto per il cinese',
          'Prestazioni elevate su diverse attività',
          'Open-source e gratuito'
        ],
        limitations: [
          'Ottimizzato principalmente per il cinese',
          'Meno efficace in alcuni domini specializzati occidentali'
        ]
      },
      {
        id: '5',
        name: 'Gemini Pro',
        provider: 'Google',
        inputCost: 0.000007,
        outputCost: 0.000014,
        maxContext: '32K tokens',
        strengths: [
          'Eccellente per compiti multimodali',
          'Buon equilibrio tra costo e performance',
          'Ottimizzato per applicazioni Google'
        ],
        limitations: [
          'Limitazioni geografiche in alcuni paesi',
          'Meno specializzato in ragionamento complesso rispetto a GPT-4'
        ]
      },
      {
        id: '6',
        name: 'Gemini Ultra',
        provider: 'Google',
        inputCost: 0.000014,
        outputCost: 0.000042,
        maxContext: '128K tokens',
        strengths: [
          'Prestazioni all\'avanguardia in compiti multimodali',
          'Eccellente per ragionamento complesso',
          'Ottima comprensione di contesti ampi'
        ],
        limitations: [
          'Costo più elevato rispetto a Gemini Pro',
          'Disponibilità più limitata'
        ]
      },
      {
        id: '7',
        name: 'DeepSeek-Coder',
        provider: 'DeepSeek',
        inputCost: 0.000006,
        outputCost: 0.000030,
        maxContext: '32K tokens',
        strengths: [
          'Specializzato in generazione di codice',
          'Ottimizzato per completamento e correzione di codice',
          'Supporto per molti linguaggi di programmazione'
        ],
        limitations: [
          'Meno versatile per compiti non relativi al codice',
          'Base di conoscenza più limitata rispetto a modelli generici'
        ]
      },
      {
        id: '8',
        name: 'Llama 3 (70B)',
        provider: 'Meta',
        inputCost: 0.000007,
        outputCost: 0.000013,
        maxContext: '8K tokens',
        strengths: [
          'Buone performance generali',
          'Licenza aperta per uso commerciale',
          'Facilmente personalizzabile'
        ],
        limitations: [
          'Contesto più limitato rispetto ai competitor',
          'Dipende dall\'infrastruttura di deployment'
        ]
      },
      {
        id: '9',
        name: 'Claude 3 Haiku',
        provider: 'Anthropic',
        inputCost: 0.000005,
        outputCost: 0.000015,
        maxContext: '48K tokens',
        strengths: [
          'Veloce e conveniente',
          'Buon equilibrio tra efficienza e performance',
          'Eccellente per applicazioni in tempo reale'
        ],
        limitations: [
          'Meno potente rispetto a Claude 3 Opus',
          'Non ottimale per ragionamenti molto complessi'
        ]
      },
      {
        id: '10',
        name: 'Mistral Large',
        provider: 'Mistral AI',
        inputCost: 0.000007,
        outputCost: 0.000021,
        maxContext: '32K tokens',
        strengths: [
          'Eccellente comprensione del contesto',
          'Ottimo per analisi di documenti',
          'Buone capacità di ragionamento'
        ],
        limitations: [
          'Meno capacità multimodali rispetto ai competitor',
          'API meno mature rispetto a OpenAI'
        ]
      },
      {
        id: '11',
        name: 'Mixtral 8x7B',
        provider: 'Mistral AI',
        inputCost: 0.000002,
        outputCost: 0.000008,
        maxContext: '32K tokens',
        strengths: [
          'Ottimo rapporto qualità/prezzo',
          'Architettura MoE (Mixture of Experts)',
          'Buone performance in molteplici lingue'
        ],
        limitations: [
          'Meno potente dei modelli più grandi',
          'Limitazioni su alcuni compiti specialistici'
        ]
      }
    ];
    setLocalStorage('llmModels', enhancedLLMModels);
  }
};

export default {
  agentsDB,
  servicesDB,
  llmModelsDB,
  initializeDatabase
};
