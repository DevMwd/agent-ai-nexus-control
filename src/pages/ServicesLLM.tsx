
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAgents } from '@/contexts/AgentContext';
import { Edit, ArrowLeft, Settings, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const ServicesLLM: React.FC = () => {
  const [activeTab, setActiveTab] = useState("services");
  const { services, llmModels } = useAgents();

  return (
    <div className="container mx-auto px-6 py-8">
      <Tabs defaultValue="services" onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="services" className="rounded-md">Servizi</TabsTrigger>
          <TabsTrigger value="llm" className="rounded-md">LLM Models</TabsTrigger>
          <TabsTrigger value="categories" className="rounded-md">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Servizi</h1>
            <div className="flex gap-4">
              <Button variant="outline" className="flex items-center gap-2" onClick={() => {}}>
                <Settings className="w-5 h-5" />
                <span>Gestisci Categorie</span>
              </Button>
              <Button className="bg-action-primary flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span>Nuovo Servizio</span>
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 text-gray-700">Nome</th>
                  <th className="text-left p-4 text-gray-700">Categoria</th>
                  <th className="text-left p-4 text-gray-700">Struttura Costi</th>
                  <th className="text-left p-4 text-gray-700">Costo per Unità</th>
                  <th className="text-left p-4 text-gray-700">Free Tier</th>
                  <th className="text-left p-4 text-gray-700">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b">
                    <td className="p-4">{service.name}</td>
                    <td className="p-4">
                      <CategoryBadge category={service.category} />
                    </td>
                    <td className="p-4">{service.costStructure}</td>
                    <td className="p-4">{service.costPerUnit}</td>
                    <td className="p-4">
                      {service.hasFreeier ? (
                        <span className="text-green-500">Sì</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" className="text-gray-600 hover:text-action-primary">
                        <Edit className="w-5 h-5" />
                        <span className="ml-1">Modifica</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="llm" className="mt-6">
          {activeTab === "llm" && (
            <>
              <div className="mb-6">
                <Link to="/services-llm" className="flex items-center text-gray-600 hover:text-action-primary">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  <span>Gestione Modelli LLM</span>
                </Link>
              </div>

              <div className="mb-6">
                <Tabs defaultValue="browse">
                  <TabsList className="bg-gray-100 p-1 rounded-lg inline-flex">
                    <TabsTrigger value="browse" className="rounded-md">Browse LLMs</TabsTrigger>
                    <TabsTrigger value="tested" className="rounded-md">LLMs Testati (0)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Cerca modelli LLM..."
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 pl-12"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {llmModels.map((model) => (
                  <div key={model.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-200 rounded-lg p-2">
                            {model.logo || (
                              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                              </svg>
                            )}
                          </div>
                          <h3 className="text-xl font-bold">{model.name}</h3>
                        </div>
                        <div className="text-gray-500 text-sm mt-1">{model.provider}</div>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">OpenAI</span>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-gray-700 font-medium mb-2">Costi</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-500 text-sm">Input</div>
                          <div>${model.inputCost.toFixed(6)} / token</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">Output</div>
                          <div>${model.outputCost.toFixed(6)} / token</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">Contesto max</div>
                          <div>{model.maxContext}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-gray-700 font-medium mb-2">Punti di forza</h4>
                      <ul className="space-y-2">
                        {model.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-gray-700 font-medium mb-2">Limitazioni</h4>
                      <ul className="space-y-2">
                        {model.limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className="w-full bg-white border border-action-primary text-action-primary font-medium py-2 rounded-lg hover:bg-action-primary hover:text-white transition-colors">
                      Seleziona
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-4">Service Categories</h1>
            <p className="text-gray-600 mb-6">
              Manage the categories that services can be assigned to.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <CategoryCard name="INTEGRATIONS" color="blue" />
              <CategoryCard name="REASONING" color="red" />
              <CategoryCard name="DB" color="yellow" />
              <CategoryCard name="DOCUMENT COMPOSITION" color="red" />
              <CategoryCard name="SCRAPING - CRAWLING" color="green" />
              <CategoryCard name="LLM PROVIDER" color="purple" />
              <div className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <Plus className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-gray-500">Add New Category</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  let badgeClass = '';
  
  switch (category) {
    case 'DB':
      badgeClass = 'service-badge-db';
      break;
    case 'DOCUMENT COMPOSITION':
      badgeClass = 'service-badge-document';
      break;
    case 'SCRAPING - CRAWLING':
      badgeClass = 'service-badge-scraping';
      break;
    case 'REASONING':
      badgeClass = 'service-badge-reasoning';
      break;
    case 'INTEGRATIONS':
      badgeClass = 'service-badge-integrations';
      break;
    case 'LLM PROVIDER':
      badgeClass = 'service-badge-provider';
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`service-badge ${badgeClass}`}>
      {category}
    </span>
  );
};

interface CategoryCardProps {
  name: string;
  color: 'blue' | 'red' | 'yellow' | 'green' | 'purple';
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, color }) => {
  let colorClass = '';
  
  switch (color) {
    case 'blue':
      colorClass = 'bg-blue-100 text-blue-800 border-blue-300';
      break;
    case 'red':
      colorClass = 'bg-red-100 text-red-800 border-red-300';
      break;
    case 'yellow':
      colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
      break;
    case 'green':
      colorClass = 'bg-green-100 text-green-800 border-green-300';
      break;
    case 'purple':
      colorClass = 'bg-purple-100 text-purple-800 border-purple-300';
      break;
  }
  
  return (
    <div className={`border rounded-lg p-4 ${colorClass}`}>
      <div className="flex justify-between items-center">
        <span className="font-medium">{name}</span>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-white hover:bg-opacity-30 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-white hover:bg-opacity-30 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesLLM;
