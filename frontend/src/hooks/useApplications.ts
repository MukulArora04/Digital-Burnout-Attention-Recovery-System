import { useState, useEffect } from 'react';

interface Application {
  id: string;
  name: string;
  category: 'productive' | 'distracting';
}

const DEFAULT_APPS: Application[] = [
  { id: '1', name: 'Visual Studio Code', category: 'productive' },
  { id: '2', name: 'IntelliJ IDEA', category: 'productive' },
  { id: '3', name: 'Microsoft Word', category: 'productive' },
  { id: '4', name: 'Google Docs', category: 'productive' },
  { id: '5', name: 'PowerPoint', category: 'productive' },
  { id: '6', name: 'Adobe Acrobat', category: 'productive' },
  { id: '7', name: 'Notion', category: 'productive' },
  { id: '8', name: 'Slack', category: 'productive' },
  { id: '9', name: 'Facebook', category: 'distracting' },
  { id: '10', name: 'Instagram', category: 'distracting' },
  { id: '11', name: 'Twitter/X', category: 'distracting' },
  { id: '12', name: 'YouTube', category: 'distracting' },
  { id: '13', name: 'TikTok', category: 'distracting' },
  { id: '14', name: 'Reddit', category: 'distracting' },
  { id: '15', name: 'Netflix', category: 'distracting' },
];

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('focus-guardian-apps');
    if (stored) {
      setApplications(JSON.parse(stored));
    } else {
      setApplications(DEFAULT_APPS);
      localStorage.setItem('focus-guardian-apps', JSON.stringify(DEFAULT_APPS));
    }
  }, []);

  const saveApplications = (apps: Application[]) => {
    setApplications(apps);
    localStorage.setItem('focus-guardian-apps', JSON.stringify(apps));
  };

  const addApplication = (name: string, category: 'productive' | 'distracting') => {
    const newApp: Application = {
      id: Date.now().toString(),
      name,
      category,
    };
    saveApplications([...applications, newApp]);
  };

  const updateApplication = (id: string, name: string, category: 'productive' | 'distracting') => {
    saveApplications(
      applications.map((app) => (app.id === id ? { ...app, name, category } : app))
    );
  };

  const removeApplication = (id: string) => {
    saveApplications(applications.filter((app) => app.id !== id));
  };

  return {
    applications,
    addApplication,
    updateApplication,
    removeApplication,
  };
}
