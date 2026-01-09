import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { format, parseISO } from 'date-fns';
import { Trash2, Filter } from 'lucide-react';
import { getCategoryColor, SPECIES_EMOJI } from '../constants';

export const ExpenseList: React.FC = () => {
  const { expenses, pets, deleteExpense, currency } = useApp();
  const [filterPet, setFilterPet] = useState<string>('all');

  const filteredExpenses = filterPet === 'all' 
    ? expenses 
    : expenses.filter(e => e.petId === filterPet);

  // Helper to get pet details
  const getPetDetails = (id: string) => pets.find(p => p.id === id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-800">History</h1>
        
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            <select 
                value={filterPet}
                onChange={(e) => setFilterPet(e.target.value)}
                className="bg-transparent border-none text-sm text-gray-600 py-1 pl-2 pr-6 outline-none focus:ring-0"
            >
                <option value="all">All Pets</option>
                {pets.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredExpenses.length === 0 && (
            <div className="text-center py-12 text-gray-400">
                No expenses found.
            </div>
        )}

        {filteredExpenses.map(expense => {
          const pet = getPetDetails(expense.petId);
          const dateObj = parseISO(expense.date);
          
          return (
            <div key={expense.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center transition-transform active:scale-[0.99]">
              <div className="flex items-center space-x-4">
                {/* Category Icon/Color Indicator */}
                <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: getCategoryColor(expense.category) }}
                >
                    {expense.category.substring(0,2).toUpperCase()}
                </div>
                
                <div>
                  <h4 className="text-gray-800 font-semibold">{expense.category}</h4>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{format(dateObj, 'dd MMM yyyy')}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center">
                        {pet ? `${SPECIES_EMOJI[pet.species]} ${pet.name}` : 'Unknown Pet'}
                    </span>
                  </div>
                  {expense.notes && <p className="text-xs text-gray-400 mt-0.5 italic">{expense.notes}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-800">
                   {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency }).format(expense.amount)}
                </span>
                <button 
                    onClick={() => deleteExpense(expense.id)}
                    className="text-gray-300 hover:text-red-500"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};