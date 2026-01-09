import React from 'react';
import { NavLink, Outlet } from 'react-router-dom'; // We'll assume usage of React Router in App.tsx
import { LayoutDashboard, PawPrint, Receipt, Settings, PlusCircle, HeartPulse } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Bar for Desktop/Tablet */}
      <header className="bg-white shadow-sm sticky top-0 z-10 hidden md:block">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <PawPrint className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">PetControl</span>
            </div>
            <nav className="flex space-x-8 items-center">
              <NavLink to="/" className={({ isActive }) => isActive ? "text-primary font-medium" : "text-gray-500 hover:text-gray-900"}>Dashboard</NavLink>
              <NavLink to="/pets" className={({ isActive }) => isActive ? "text-primary font-medium" : "text-gray-500 hover:text-gray-900"}>Pets</NavLink>
              <NavLink to="/health" className={({ isActive }) => isActive ? "text-primary font-medium" : "text-gray-500 hover:text-gray-900"}>Health</NavLink>
              <NavLink to="/expenses" className={({ isActive }) => isActive ? "text-primary font-medium" : "text-gray-500 hover:text-gray-900"}>Expenses</NavLink>
            </nav>
            <div className="flex items-center">
               {/* Desktop CTA */}
               <NavLink to="/add-expense" className="bg-primary hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center shadow-sm transition-colors">
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Expense
               </NavLink>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-primary' : 'text-gray-400'}`}>
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </NavLink>
          
          <NavLink to="/pets" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-primary' : 'text-gray-400'}`}>
            <PawPrint className="h-6 w-6" />
            <span className="text-xs mt-1">Pets</span>
          </NavLink>

          <NavLink to="/add-expense" className="flex flex-col items-center justify-center w-full h-full -mt-6">
            <div className="bg-primary text-white rounded-full p-4 shadow-lg ring-4 ring-white">
              <PlusCircle className="h-6 w-6" />
            </div>
            <span className="text-xs mt-1 text-primary font-medium">Add</span>
          </NavLink>

          <NavLink to="/health" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-primary' : 'text-gray-400'}`}>
            <HeartPulse className="h-6 w-6" />
            <span className="text-xs mt-1">Health</span>
          </NavLink>

          <NavLink to="/settings" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-primary' : 'text-gray-400'}`}>
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Config</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};