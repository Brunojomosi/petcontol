import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save, RefreshCw, Download, Plus, Trash2, Coins, LogOut } from 'lucide-react';

export const Settings: React.FC = () => {
  const { 
    categories, 
    addCategory, 
    removeCategory, 
    currency, 
    setCurrency, 
    resetApp, 
    pets, 
    expenses,
    signOut
  } = useApp();

  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleExportData = () => {
    const data = {
      pets,
      expenses,
      categories,
      currency,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `petcontrol-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (confirm("⚠️ Are you sure? This will delete ALL your pets and expenses from the database permanently!")) {
      resetApp();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      {/* Account Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
            <h2 className="text-lg font-semibold text-gray-800">Account</h2>
            <p className="text-sm text-gray-500">Manage your session</p>
        </div>
        <button 
            onClick={signOut}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
        >
            <LogOut className="w-5 h-5" />
            Sign Out
        </button>
      </section>

      {/* Currency Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-50 p-2 rounded-lg">
                <Coins className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Currency</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['BRL', 'USD', 'EUR', 'GBP'].map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-4 py-3 rounded-xl border font-medium transition-all ${
                currency === c
                  ? 'bg-secondary text-white border-secondary shadow-md'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Expense Categories</h2>
            <span className="text-xs text-gray-400">{categories.length} categories</span>
        </div>

        <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add new category..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div
              key={cat}
              className="group flex items-center bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-700"
            >
              <span>{cat}</span>
              <button
                onClick={() => removeCategory(cat)}
                className="ml-2 text-gray-300 hover:text-red-500 transition-colors"
                title="Remove category"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Data Management Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h2>
        
        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-medium"
          >
            <Download className="w-5 h-5" />
            Export Data to JSON
          </button>

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-100 text-red-600 bg-red-50 hover:bg-red-100 transition-all font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Reset Database Data
          </button>
        </div>
      </section>

      <div className="text-center pt-8 pb-4">
        <p className="text-xs text-gray-400">PetControl v1.1.0 (Cloud Sync)</p>
        <p className="text-xs text-gray-400 mt-1">Made with 💚 for pet lovers</p>
      </div>
    </div>
  );
};