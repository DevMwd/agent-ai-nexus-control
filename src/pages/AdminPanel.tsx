
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();

  // Stato per la form di edit delle config
  const [config, setConfig] = useState({
    configName: 'site_name',
    configValue: 'My AI Platform',
  });
  const [saved, setSaved] = useState(false);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    // Qui potresti normalmente salvare la config su un backend
  };

  if (!isAdmin()) {
    return (
      <div className="container mx-auto px-6 py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
          <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Gestisci utenti, ruoli e permessi qui. (Sezione demo)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>Configure system-wide settings and parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Configura impostazioni di sistema globali. (Sezione demo)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Platform Analytics</CardTitle>
            <CardDescription>View usage statistics and platform analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Vedi statistiche di utilizzo e analytics della piattaforma. (Sezione demo)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>API Management</CardTitle>
            <CardDescription>Manage API keys and external integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Gestisci API keys e integrazioni esterne. (Sezione demo)</p>
          </CardContent>
        </Card>
      </div>

      {/* Sezione: Edit System Configurations */}
      <div className="mt-10 max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit System Configurations</CardTitle>
            <CardDescription>Modifica e salva configurazioni di sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label htmlFor="configName" className="block mb-1 font-medium">Config Name</label>
                <Input
                  id="configName"
                  name="configName"
                  value={config.configName}
                  onChange={handleConfigChange}
                />
              </div>
              <div>
                <label htmlFor="configValue" className="block mb-1 font-medium">Config Value</label>
                <Input
                  id="configValue"
                  name="configValue"
                  value={config.configValue}
                  onChange={handleConfigChange}
                />
              </div>
              <Button type="submit" className="mt-2 w-fit">Save Configuration</Button>
              {saved && <span className="text-green-600 text-sm font-semibold">Configuration saved!</span>}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;

