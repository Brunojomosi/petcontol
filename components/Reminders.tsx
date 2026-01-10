
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Reminder } from '../types';
import { format, isPast, isToday, parseISO } from 'date-fns';
import { Calendar, CheckCircle2, Circle, Plus, Trash2, Syringe, Pill, Stethoscope, AlertCircle } from 'lucide-react';

export const Reminders: React.FC = () => {
  const { pets, reminders, addReminder, toggleReminder, deleteReminder } = useApp();
  const [selectedPetId, setSelectedPetId] = useState<string>(pets.length > 0 ? pets[0].id : '');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  // Filter reminders for the selected pet
  const petReminders = reminders
    .filter(r => r.petId === selectedPetId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcomingReminders = petReminders.filter(r => !r.isCompleted);
  const completedReminders = petReminders.filter(r => r.isCompleted);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId) return;

    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      petId: selectedPetId,
      title,
      date,
      isCompleted: false
    };

    addReminder(newReminder);
    setTitle('');
    setDate('');
    setIsFormOpen(false);
  };

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('vacina') || t.includes('vaccine')) return <Syringe className="w-5 h-5 text-pink-500" />;
    if (t.includes('remedio') || t.includes('medicine') || t.includes('vermifugo')) return <Pill className="w-5 h-5 text-blue-500" />;
    if (t.includes('consulta') || t.includes('vet')) return <Stethoscope className="w-5 h-5 text-green-500" />;
    return <AlertCircle className="w-5 h-5 text-orange-500" />;
  };

  if (pets.length === 0) {
    return (
        <div className="text-center py-20 px-6 animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 leading-relaxed">Adicione um pet primeiro para gerenciar lembretes de saúde.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in px-1">
      {/* Header with improved wrapping for small screens */}
      <div className="flex justify-between items-start gap-4">
        <h1 className="text-2xl font-black text-gray-800 leading-tight">Saúde e Lembretes</h1>
        <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-primary text-white px-4 py-2.5 rounded-2xl flex items-center text-sm font-bold shadow-lg shadow-green-100 hover:bg-green-600 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Novo
        </button>
      </div>

      {/* Pet Selector - Simplified Pill Style */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {pets.map(pet => (
            <button
              key={pet.id}
              onClick={() => setSelectedPetId(pet.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold border-2 transition-all ${
                  selectedPetId === pet.id 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100 scale-105' 
                  : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600'
              }`}
            >
              {pet.name}
            </button>
        ))}
      </div>

      {/* Add Form with better spacing */}
      {isFormOpen && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-5 animate-fade-in">
            <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">O que lembrar?</label>
                <input 
                    type="text" 
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-primary outline-none transition-all font-medium text-gray-700"
                    placeholder="Ex: Vacina de Raiva"
                />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Quando?</label>
                <input 
                    type="date" 
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-primary outline-none transition-all font-medium text-gray-700"
                />
            </div>
            <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-3.5 text-sm font-bold text-gray-400 hover:bg-gray-50 rounded-2xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-600 transition-all active:scale-95">Salvar</button>
            </div>
        </form>
      )}

      {/* Upcoming List */}
      <div className="pt-2">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Próximos
        </h3>
        <div className="space-y-4">
            {upcomingReminders.length === 0 && (
              <div className="text-center py-10 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 text-sm font-medium">Nenhum lembrete pendente.</p>
              </div>
            )}
            {upcomingReminders.map(r => {
                const dateObj = parseISO(r.date);
                const isOverdue = isPast(dateObj) && !isToday(dateObj);
                return (
                    <div key={r.id} className={`bg-white p-5 rounded-[2rem] border shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all ${isOverdue ? 'border-red-100 bg-red-50/30' : 'border-gray-50'}`}>
                        <div className="flex items-center gap-4 min-w-0">
                            <button 
                              onClick={() => toggleReminder(r.id, true)}
                              className="shrink-0 group-active:scale-90 transition-transform"
                            >
                                <Circle className="w-7 h-7 text-gray-200 hover:text-primary transition-colors" />
                            </button>
                            <div className="p-2.5 bg-gray-50 rounded-2xl shrink-0">
                              {getIcon(r.title)}
                            </div>
                            <div className="min-w-0">
                                <p className={`font-bold text-lg truncate ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>{r.title}</p>
                                <p className={`text-xs font-semibold ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                                    {isOverdue ? 'Atrasado: ' : ''}{format(dateObj, 'dd/MM/yyyy')}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => deleteReminder(r.id)} className="p-2 text-gray-200 hover:text-red-500 transition-colors">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Completed List */}
      {completedReminders.length > 0 && (
          <div className="pt-8 mt-4 border-t border-gray-100">
            <h3 className="text-sm font-black text-gray-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Histórico concluído
            </h3>
            <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity">
                {completedReminders.map(r => (
                    <div key={r.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4 min-w-0">
                            <button onClick={() => toggleReminder(r.id, false)}>
                                <CheckCircle2 className="w-7 h-7 text-green-500" />
                            </button>
                            <div className="min-w-0">
                                <p className="font-bold text-gray-500 line-through truncate">{r.title}</p>
                                <p className="text-[10px] font-bold text-gray-400">{format(parseISO(r.date), 'dd/MM/yyyy')}</p>
                            </div>
                        </div>
                        <button onClick={() => deleteReminder(r.id)} className="p-2 text-gray-300 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
          </div>
      )}
    </div>
  );
};
