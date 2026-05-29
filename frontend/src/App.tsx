import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { BarChart3, Users } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import EmployeesPage from './pages/EmployeesPage';
import InsightsPage from './pages/InsightsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type Tab = 'employees' | 'insights';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('employees');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'employees', label: 'Employees', icon: <Users className="w-4 h-4" /> },
    { id: 'insights', label: 'Salary Insights', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">Salary Management</h1>
            <nav className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary key={activeTab}>
          {activeTab === 'employees' ? <EmployeesPage /> : <InsightsPage />}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}