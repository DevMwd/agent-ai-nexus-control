
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { agentsDB, servicesDB, llmModelsDB, initializeDatabase } from '@/utils/database';

// Define types for our agent and related data
export type ServiceCategory = 'INTEGRATIONS' | 'REASONING' | 'DB' | 'DOCUMENT COMPOSITION' | 'SCRAPING - CRAWLING' | 'LLM PROVIDER';
export type LLMModel = 'gpt-4o' | 'lama' | 'Claude 3 Opus' | 'Azure OpenAI' | 'GPT-4o Mini' | 'GPT-3.5 Turbo';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  costStructure: string;
  costPerUnit: string;
  hasFreetier: boolean;
  logo?: string;
}

export interface OptimizationScore {
  quality: number;
  speed: number;
  saving: number;
  privacy: number;
}

export interface AgentNode {
  id: string;
  name: string;
  type: string;
  cost: number;
  calls: number;
  tokens: number;
  scores?: {
    quality?: number;
    speed?: number;
  };
}

export interface AgentSession {
  id: string;
  date: Date;
  totalCost: number;
  llmCost: number;
  servicesCost: number;
  services: Service[];
  llms: LLMModel[];
}

export interface AIAgent {
  id: string;
  title: string;
  version: string;
  subtitle: string;
  description: string;
  logo: string;
  isActive: boolean;
  services: Service[];
  llms: LLMModel[];
  totalCost: number;
  servicesCost: number;
  llmCost: number;
  categoriesDistribution: Record<ServiceCategory, number>;
  scores: OptimizationScore;
  nodes: AgentNode[];
  sessions: AgentSession[];
  prompt?: string;
}

export interface LLMModelDetails {
  id: string;
  name: string;
  provider: string;
  inputCost: number;
  outputCost: number;
  maxContext: string;
  strengths: string[];
  limitations: string[];
  logo?: string;
}

interface AgentContextType {
  agents: AIAgent[];
  services: Service[];
  llmModels: LLMModelDetails[];
  currentAgent: AIAgent | null;
  setCurrentAgent: (agent: AIAgent | null) => void;
  updateAgent: (updatedAgent: Partial<AIAgent> & { id: string }) => void;
  loading: boolean;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

// Define some mock data for our application
const mockServices: Service[] = [
  { 
    id: '1', 
    name: 'Airtable', 
    category: 'DB', 
    costStructure: 'Per record', 
    costPerUnit: 'A partire da $10/mese', 
    hasFreetier: true 
  },
  { 
    id: '2', 
    name: 'Apitemplate', 
    category: 'DOCUMENT COMPOSITION', 
    costStructure: 'Per documento', 
    costPerUnit: 'A partire da $0.01', 
    hasFreetier: true 
  },
  { 
    id: '3', 
    name: 'Firecrawl', 
    category: 'SCRAPING - CRAWLING', 
    costStructure: 'Per richiesta', 
    costPerUnit: 'Variabile', 
    hasFreetier: false 
  },
  { 
    id: '4', 
    name: 'Groq', 
    category: 'REASONING', 
    costStructure: 'Per token', 
    costPerUnit: 'Variabile', 
    hasFreetier: true 
  },
  { 
    id: '5', 
    name: 'HuggingFace', 
    category: 'LLM PROVIDER', 
    costStructure: 'Per richiesta', 
    costPerUnit: 'Variabile', 
    hasFreetier: true 
  },
];

const mockLLMModels: LLMModelDetails[] = [
  {
    id: '1',
    name: 'GPT-4o',
    provider: 'OpenAI',
    inputCost: 0.000010,
    outputCost: 0.000030,
    maxContext: '128K tokens',
    strengths: [
      'Ampia conoscenza generica',
      'Buona comprensione del contesto',
      'Capacità multimodali (testo, immagini, audio)'
    ],
    limitations: [
      'Costo più elevato rispetto ai modelli base',
      'Può generare allucinazioni'
    ]
  },
  {
    id: '2',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    inputCost: 0.000005,
    outputCost: 0.000015,
    maxContext: '128K tokens',
    strengths: [
      'Costo più contenuto rispetto a GPT-4o',
      'Buona qualità per compiti generici',
      'Capacità multimodali (testo, immagini)'
    ],
    limitations: [
      'Prestazioni leggermente inferiori a GPT-4o',
      'Meno adatto per compiti complessi'
    ]
  },
  {
    id: '3',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    inputCost: 0.000002,
    outputCost: 0.000002,
    maxContext: '16K tokens',
    strengths: [
      'Molto economico',
      'Veloce',
      'Buon rapporto qualità/prezzo'
    ],
    limitations: [
      'Meno capace di comprendere contesti complessi',
      'Prestazioni inferiori rispetto a GPT-4'
    ]
  },
  {
    id: '4',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    inputCost: 0.000015,
    outputCost: 0.000075,
    maxContext: '200K tokens',
    strengths: [
      'Eccellente in compiti di ragionamento',
      'Ampia finestra di contesto',
      'Qualità di risposta superiore'
    ],
    limitations: [
      'Costo più elevato',
      'Disponibilità geografica limitata'
    ]
  }
];

// Create mock agent data
const createMockAgent = (id: string, title: string, version: string, subtitle: string, isActive: boolean): AIAgent => {
  return {
    id,
    title,
    version,
    subtitle,
    description: 'Sales assistant for business and sales team lorem ipsum dolor sit amet donec',
    logo: 'SB',
    isActive,
    services: mockServices.slice(0, 3),
    llms: ['GPT-4o Mini'], // Default LLM is set to GPT-4o Mini only
    totalCost: 187.20,
    servicesCost: 187.20,
    llmCost: 187.20,
    categoriesDistribution: {
      'INTEGRATIONS': 32,
      'REASONING': 40,
      'DB': 28,
      'DOCUMENT COMPOSITION': 0,
      'SCRAPING - CRAWLING': 0,
      'LLM PROVIDER': 0
    },
    scores: {
      quality: 4.6,
      speed: 3.1,
      saving: 3.4,
      privacy: 4.9
    },
    nodes: [
      {
        id: '1',
        name: 'Documents validation',
        type: 'Private GPT',
        cost: 18000,
        calls: 120,
        tokens: 5000,
        scores: {
          quality: 4.6,
          speed: 3.1
        }
      }
    ],
    sessions: [
      {
        id: '1',
        date: new Date(),
        totalCost: 37.44,
        llmCost: 25.20,
        servicesCost: 12.24,
        services: mockServices.slice(0, 2),
        llms: ['GPT-4o Mini']
      }
    ]
  };
};

const mockAgents: AIAgent[] = [
  createMockAgent('1', 'SKY BOOST', 'v1', 'Sales assistant', true),
  createMockAgent('2', 'SKY BOOST', 'v2', 'Sales assistant', true),
  createMockAgent('3', 'SKY BOOST', 'v3', 'Sales assistant', false)
];

export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [llmModels, setLLMModels] = useState<LLMModelDetails[]>([]);
  const [currentAgent, setCurrentAgent] = useState<AIAgent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize database and load data
  useEffect(() => {
    const initDB = async () => {
      try {
        // Initialize the database with mock data
        initializeDatabase(mockAgents, mockServices, mockLLMModels);
        
        // Load data from database
        const dbAgents = await agentsDB.getAll();
        const dbServices = await servicesDB.getAll();
        const dbLLMModels = await llmModelsDB.getAll();
        
        // Update state with data from database
        setAgents(dbAgents.length > 0 ? dbAgents : mockAgents);
        setServices(dbServices.length > 0 ? dbServices : mockServices);
        setLLMModels(dbLLMModels.length > 0 ? dbLLMModels : mockLLMModels);
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing database:', error);
        // Fallback to mock data if database initialization fails
        setAgents(mockAgents);
        setServices(mockServices);
        setLLMModels(mockLLMModels);
        setLoading(false);
      }
    };
    
    initDB();
  }, []);

  const updateAgent = async (updatedAgent: Partial<AIAgent> & { id: string }) => {
    try {
      // Update agent in database
      await agentsDB.update(updatedAgent);
      
      // Update state
      setAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === updatedAgent.id ? { ...agent, ...updatedAgent } : agent
        )
      );
      
      // Also update currentAgent if it's the one being modified
      if (currentAgent && currentAgent.id === updatedAgent.id) {
        setCurrentAgent(prev => prev ? { ...prev, ...updatedAgent } : prev);
      }
    } catch (error) {
      console.error('Error updating agent:', error);
    }
  };

  return (
    <AgentContext.Provider
      value={{
        agents,
        services,
        llmModels,
        currentAgent,
        setCurrentAgent,
        updateAgent,
        loading
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export const useAgents = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgents must be used within an AgentProvider');
  }
  return context;
};
