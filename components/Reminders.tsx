import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Reminder } from '../types';
import { format, isPast, isToday, parseISO, addYears } from 'date-fns';
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
        <div className="text-center py-10">
            <p className="text-gray-500">Add a pet first to manage health reminders.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Health & Reminders</h1>
        <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium shadow-sm hover:bg-green-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> New Reminder
        </button>
      </div>

      {/* Pet Selector */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
        {pets.map(pet => (
            <button
            key={pet.id}
            onClick={() => setSelectedPetId(pet.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                selectedPetId === pet.id 
                ? 'bg-blue-50 border-blue-500 text-blue-600 ring-1 ring-blue-500' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            >
            {pet.name}
            </button>
        ))}
      </div>

      {/* Add Form */}
      {isFormOpen && (
        <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (Vaccine, Vet, etc)</label>
                <input 
                    type="text" 
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none"
                    placeholder="e.g. Rabies Vaccine"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                    type="date" 
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none"
                />
            </div>
            <div className="flex gap-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-2 text-gray-500 hover:bg-gray-50 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-green-600">Save</button>
            </div>
        </form>
      )}

      {/* Upcoming List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Upcoming
        </h3>
        <div className="space-y-3">
            {upcomingReminders.length === 0 && <p className="text-gray-400 text-sm italic">No upcoming reminders.</p>}
            {upcomingReminders.map(r => {
                const dateObj = parseISO(r.date);
                const isOverdue = isPast(dateObj) && !isToday(dateObj);
                return (
                    <div key={r.id} className={`bg-white p-4 rounded-xl border flex items-center justify-between ${isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                            <button onClick={() => toggleReminder(r.id, true)}>
                                <Circle className="w-6 h-6 text-gray-300 hover:text-primary" />
                            </button>
                            <div className="p-2 bg-gray-50 rounded-full">{getIcon(r.title)}</div>
                            <div>
                                <p className={`font-semibold ${isOverdue ? 'text-red-700' : 'text-gray-800'}`}>{r.title}</p>
                                <p className={`text-sm ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                                    {isOverdue ? 'Overdue: ' : ''}{format(dateObj, 'dd MMM yyyy')}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => deleteReminder(r.id)} className="text-gray-300 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Completed List */}
      {completedReminders.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2 opacity-75">
                <CheckCircle2 className="w-5 h-5 text-gray-400" /> Completed History
            </h3>
            <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity">
                {completedReminders.map(r => (
                    <div key={r.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => toggleReminder(r.id, false)}>
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            </button>
                            <div className="p-2 bg-white rounded-full">{getIcon(r.title)}</div>
                            <div>
                                <p className="font-semibold text-gray-600 line-through">{r.title}</p>
                                <p className="text-sm text-gray-400">{format(parseISO(r.date), 'dd MMM yyyy')}</p>
                            </div>
                        </div>
                        <button onClick={() => deleteReminder(r.id)} className="text-gray-300 hover:text-red-500">
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