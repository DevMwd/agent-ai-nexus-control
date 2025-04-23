
import React, { useState } from 'react';
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from '@/components/ui/accordion';
import { Calendar, Filter, Download, Search } from 'lucide-react';

type SessionStep = {
  stepId: string;
  title: string;
  details: string;
  status: 'success' | 'failed' | 'pending';
  duration: string;
  llmCost: string;
  servicesCost: string;
  timestamp: string;
};

type SessionLog = {
  id: string;
  agent: string;
  user: string;
  datetime: string;
  duration: string;
  llmCost: string;
  servicesCost: string;
  totalCost: string;
  status: 'Completed' | 'Pending' | 'Failed';
  steps?: SessionStep[];
};

const sessionLogs: SessionLog[] = [
  {
    id: "#1001",
    agent: "SKY BOOST v1",
    user: "John Doe",
    datetime: "2025-04-14 10:23:45",
    duration: "1m 45s",
    llmCost: "€12.50",
    servicesCost: "€5.40",
    totalCost: "€17.90",
    status: "Completed",
    steps: [
      {
        stepId: "S1",
        title: "Input Parsing",
        details: "Parsed user input successfully.",
        status: "success",
        duration: "20s",
        llmCost: "€2.00",
        servicesCost: "€1.00",
        timestamp: "2025-04-14 10:23:45"
      },
      {
        stepId: "S2",
        title: "Knowledge Retrieval",
        details: "Fetched relevant info from DB.",
        status: "success",
        duration: "35s",
        llmCost: "€3.50",
        servicesCost: "€1.50",
        timestamp: "2025-04-14 10:24:05"
      },
      {
        stepId: "S3",
        title: "LLM Reasoning",
        details: "Elaborated user answer.",
        status: "success",
        duration: "50s",
        llmCost: "€7.00",
        servicesCost: "€2.90",
        timestamp: "2025-04-14 10:24:40"
      }
    ],
  },
  {
    id: "#1002",
    agent: "SKY BOOST v2",
    user: "Jane Smith",
    datetime: "2025-04-14 09:15:30",
    duration: "2m 20s",
    llmCost: "€15.30",
    servicesCost: "€8.75",
    totalCost: "€24.05",
    status: "Completed"
  },
  {
    id: "#1004",
    agent: "SKY BOOST v3",
    user: "Emily Davis",
    datetime: "2025-04-13 14:22:05",
    duration: "3m 15s",
    llmCost: "€18.75",
    servicesCost: "€10.30",
    totalCost: "€29.05",
    status: "Pending"
  },
  {
    id: "#1005",
    agent: "SKY BOOST v2",
    user: "Michael Brown",
    datetime: "2025-04-12 11:05:37",
    duration: "1m 10s",
    llmCost: "€9.80",
    servicesCost: "€4.25",
    totalCost: "€14.05",
    status: "Failed",
    steps: [
      {
        stepId: "S1",
        title: "Input Parsing",
        details: "Input error: unexpected value.",
        status: "failed",
        duration: "12s",
        llmCost: "€0.80",
        servicesCost: "€0.30",
        timestamp: "2025-04-12 11:05:37"
      }
    ]
  }
];

const statusColor = {
  Completed: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Failed: 'bg-red-100 text-red-800',
};

const SessionLogs: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleAccordion = (id: string) => {
    setExpanded(prev => (prev === id ? null : id));
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Session Logs</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search sessions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              <Calendar className="w-5 h-5" />
              <span>Date Range</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LLM Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <Accordion type="single" collapsible value={expanded ?? undefined} className="w-full">
                {sessionLogs.map(row => (
                  <AccordionItem value={row.id} key={row.id} className="border-0">
                    <tr
                      className={`hover:bg-blue-50 cursor-pointer ${expanded === row.id ? "ring-2 ring-blue-200" : ""}`}
                      onClick={() => row.steps ? handleAccordion(row.id) : undefined}
                      style={row.steps ? { transition: 'background .15s' } : {}}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                        {row.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{row.agent}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{row.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{row.datetime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{row.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{row.llmCost}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{row.servicesCost}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{row.totalCost}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                    
                    {row.steps && (
                      <tr>
                        <td colSpan={9} className="p-0 border-0">
                          <AccordionContent>
                            <div className="bg-gray-50 px-6 py-4">
                              <div className="font-semibold mb-2 text-gray-700">Session Steps</div>
                              <table className="w-full text-sm border">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="px-3 py-2 text-left">Step</th>
                                    <th className="px-3 py-2 text-left">Status</th>
                                    <th className="px-3 py-2 text-left">Start Time</th>
                                    <th className="px-3 py-2 text-left">Duration</th>
                                    <th className="px-3 py-2 text-left">LLM Cost</th>
                                    <th className="px-3 py-2 text-left">Service Cost</th>
                                    <th className="px-3 py-2 text-left">Details</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {row.steps.map(step => (
                                    <tr key={step.stepId}>
                                      <td className="px-3 py-2">{step.title}</td>
                                      <td className="px-3 py-2">
                                        <span className={`px-2 rounded-full text-xs font-medium
                                          ${step.status === 'success' ? "bg-green-100 text-green-700"
                                            : step.status === 'failed' ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"}`}>
                                          {step.status === "success"
                                            ? "Success"
                                            : step.status === "failed"
                                            ? "Failed"
                                            : "Pending"}
                                        </span>
                                      </td>
                                      <td className="px-3 py-2">{step.timestamp}</td>
                                      <td className="px-3 py-2">{step.duration}</td>
                                      <td className="px-3 py-2">{step.llmCost}</td>
                                      <td className="px-3 py-2">{step.servicesCost}</td>
                                      <td className="px-3 py-2">{step.details}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </AccordionContent>
                        </td>
                      </tr>
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Showing 1 to 5 of {sessionLogs.length} entries
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-4 py-2 bg-action-primary text-white rounded-lg hover:bg-opacity-90">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Cost Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-gray-600 mb-1">Total Cost (Last 30 Days)</div>
            <div className="text-2xl font-bold text-blue-500">€458.75</div>
            <div className="text-sm text-gray-500 mt-1">+12.5% vs previous period</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-gray-600 mb-1">Avg. Cost per Session</div>
            <div className="text-2xl font-bold text-blue-500">€18.35</div>
            <div className="text-sm text-gray-500 mt-1">-2.1% vs previous period</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-gray-600 mb-1">Total Sessions</div>
            <div className="text-2xl font-bold text-blue-500">25</div>
            <div className="text-sm text-gray-500 mt-1">+15% vs previous period</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionLogs;
