
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Expense, ExpenseCategory, PaymentMethod } from '../../types';
import { PAYMENT_METHODS } from '../../constants';
import { ArrowLeft, CheckCircle2, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

export const ExpenseForm: React.FC = () => {
  const navigate = useNavigate();
  const { addExpense, pets, categories, currency } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(categories[0] || 'Other');
  const [petId, setPetId] = useState<string>(pets.length > 0 ? pets[0].id : '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit');
  const [notes, setNotes] = useState('');
  
  // UI State
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanError(null);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: file.type,
                data: base64Data,
              },
            },
            {
              text: `Analise este recibo de gastos com pet. Extraia as seguintes informações em formato JSON:
              - amount: o valor total (apenas número)
              - category: uma das seguintes categorias: ${categories.join(', ')}
              - date: a data no formato YYYY-MM-DD
              - notes: um resumo curto do que foi comprado.
              Se não tiver certeza, chute a categoria mais próxima baseada nos itens.`
            }
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              amount: { type: Type.NUMBER },
              category: { type: Type.STRING },
              date: { type: Type.STRING },
              notes: { type: Type.STRING }
            },
            required: ["amount", "category", "date"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      
      if (result.amount) setAmount(result.amount.toString());
      if (result.category && categories.includes(result.category)) setCategory(result.category);
      if (result.date) setDate(result.date);
      if (result.notes) setNotes(result.notes);

    } catch (err) {
      console.error("Erro no escaneamento:", err);
      setScanError("Não foi possível ler o recibo. Tente preencher manualmente.");
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
        
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isScanning}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            isScanning 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-100'
          }`}
        >
          {isScanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {isScanning ? 'Lendo...' : 'Escanear'}
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
        capture="environment"
      />

      {scanError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-sm text-red-600 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {scanError}
        </div>
      )}

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
                className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all whitespace-nowrap ${
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
          disabled={isScanning}
          className="w-full bg-primary hover:bg-green-600 disabled:bg-gray-200 text-white font-black text-xl py-5 rounded-3xl shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-3 mt-4 active:scale-95"
        >
          <CheckCircle2 className="w-7 h-7" />
          Registrar Gasto
        </button>

      </form>
    </div>
  );
};
