import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './components/Dashboard';
import { PetList } from './components/PetList';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseForm } from './components/forms/ExpenseForm';
import { PetForm } from './components/forms/PetForm';
import { Reminders } from './components/Reminders';
import { Settings } from './components/Settings';
import { Auth } from './components/Auth';
import { Loader2 } from 'lucide-react';

const ProtectedRoutes = () => {
    const { session, loading } = useApp();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        )
    }

    if (!session) {
        return <Auth />;
    }

    return (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="pets" element={<PetList />} />
            <Route path="pets/add" element={<PetForm />} />
            <Route path="expenses" element={<ExpenseList />} />
            <Route path="add-expense" element={<ExpenseForm />} />
            <Route path="health" element={<Reminders />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
    );
}

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <ProtectedRoutes />
      </HashRouter>
    </AppProvider>
  );
}

export default App;