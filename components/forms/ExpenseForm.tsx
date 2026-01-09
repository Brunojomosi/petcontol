import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Expense, ExpenseCategory, PaymentMethod } from '../../types';
import { PAYMENT_METHODS } from '../../constants';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ExpenseForm: React.FC = () => {
  const navigate = useNavigate();
  const { addExpense, pets, categories, currency } = useApp();
  
  // Form State
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(categories[0] || 'Other');
  const [petId, setPetId] = useState<string>(pets.length > 0 ? pets[0].id : '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId) {
        alert("Please select a pet");
        return;
    }

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      category,
      petId,
      date: new Date(date).toISOString(),
      paymentMethod,
      notes: notes || undefined
    };

    addExpense(newExpense);
    navigate('/expenses'); // Or back to dashboard
  };

  if (pets.length === 0) {
    return (
        <div className="text-center py-10">
            <p className="mb-4">You need to add a pet before tracking expenses.</p>
            <button 
                onClick={() => navigate('/pets/add')}
                className="text-primary font-bold underline"
            >
                Add your first pet
            </button>
        </div>
    )
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 text-gray-500 hover:text-gray-800">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">New Expense</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        
        {/* Amount Input - Prominent */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Amount ({currency})</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">{currency}</span>
            <input 
              autoFocus
              required
              type="number" 
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-16 pr-4 py-4 text-3xl font-bold text-gray-800 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder-gray-300"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Pet Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pet</label>
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
            {pets.map(pet => (
              <button
                key={pet.id}
                type="button"
                onClick={() => setPetId(pet.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  petId === pet.id 
                  ? 'bg-blue-50 border-blue-500 text-blue-600 ring-1 ring-blue-500' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {pet.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment</label>
            <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-primary outline-none"
            >
                {PAYMENT_METHODS.map(pm => (
                <option key={pm} value={pm}>{pm}</option>
                ))}
            </select>
            </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
          <input 
            type="text" 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
            placeholder="e.g. Premium brand"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary hover:bg-green-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 mt-6 active:scale-[0.98]"
        >
          <CheckCircle2 className="w-6 h-6" />
          Save Expense
        </button>

      </form>
    </div>
  );
};