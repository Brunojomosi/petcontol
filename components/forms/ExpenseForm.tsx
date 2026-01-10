
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
  // Fix: Use 'Crédito' instead of 'Credit' to match PaymentMethod type
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Crédito');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId) {
        alert("Por favor, selecione um pet");
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
    navigate('/expenses');
  };

  if (pets.length === 0) {
    return (
        <div className="text-center py-12 animate-fade-in px-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <p className="mb-6 text-gray-500 leading-relaxed">Você precisa adicionar um pet antes de registrar gastos.</p>
                <button 
                    onClick={() => navigate('/pets/add')}
                    className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-95"
                >
                    Adicionar meu primeiro pet
                </button>
            </div>
        </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 -ml-2 text-gray-400 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Novo Gasto</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
        
        {/* Amount Input */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Valor do Gasto</label>
          <div className="relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-2xl group-focus-within:text-primary transition-colors">{currency}</span>
            <input 
              autoFocus
              required
              type="number" 
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-20 pr-6 py-6 text-4xl font-black text-gray-800 rounded-3xl border-2 border-gray-50 bg-gray-50/30 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder-gray-200"
              placeholder="0,00"
            />
          </div>
        </div>

        {/* Pet Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">Para qual Pet?</label>
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1 px-1 -mx-1">
            {pets.map(pet => (
              <button
                key={pet.id}
                type="button"
                onClick={() => setPetId(pet.id)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all ${
                  petId === pet.id 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100 scale-105' 
                  : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {pet.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-1 gap-5">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Categoria</label>
                <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-primary outline-none appearance-none transition-all font-medium text-gray-700"
                >
                    {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Data</label>
                    <input 
                        type="date" 
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-primary outline-none transition-all font-medium text-gray-700"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Pagamento</label>
                    <select 
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-full px-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-primary outline-none transition-all font-medium text-gray-700"
                    >
                        {PAYMENT_METHODS.map(pm => (
                        <option key={pm} value={pm}>{pm}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Notas (Opcional)</label>
          <textarea 
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-primary outline-none transition-all font-medium text-gray-700 resize-none"
            placeholder="Ex: Ração Premium do mês..."
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary hover:bg-green-600 text-white font-black text-xl py-5 rounded-3xl shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-3 mt-4 active:scale-95"
        >
          <CheckCircle2 className="w-7 h-7" />
          Registrar Gasto
        </button>

      </form>
    </div>
  );
};
