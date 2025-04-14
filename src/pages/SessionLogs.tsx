
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Filter, Download, Search } from 'lucide-react';

const SessionLogs: React.FC = () => {
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
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">#1001</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">SKY BOOST v1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">John Doe</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">2025-04-14 10:23:45</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">1m 45s</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">€12.50</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">€5.40</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">€17.90</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">#1002</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">SKY BOOST v2</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">Jane Smith</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">2025-04-14 09:15:30</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">2m 20s</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">€15.30</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">€8.75</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">€24.05</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">#1003</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">SKY BOOST v1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">Robert Johnson</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">2025-04-13 16:40:12</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">0m 50s</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">€6.25</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">€2.15</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">€8.40</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">#1004</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">SKY BOOST v3</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">Emily Davis</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">2025-04-13 14:22:05</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">3m 15s</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">€18.75</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">€10.30</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">€29.05</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">#1005</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">SKY BOOST v2</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">Michael Brown</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">2025-04-12 11:05:37</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">1m 10s</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">€9.80</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">€4.25</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">€14.05</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Failed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Showing 1 to 5 of 24 entries
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
