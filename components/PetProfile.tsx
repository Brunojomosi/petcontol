
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, PlusCircle, HeartPulse, Trash2, Edit2 } from 'lucide-react';
import { SPECIES_EMOJI } from '../constants';
import { format, parseISO } from 'date-fns';

export const PetProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pets, expenses, reminders, deletePet, currency } = useApp();

  const pet = pets.find(p => p.id === id);
  
  if (!pet) {
    return (
      <div className="text-center py-20 px-6">
        <p className="text-gray-500">Pet não encontrado.</p>
        <button onClick={() => navigate('/pets')} className="text-primary mt-4 font-bold">Voltar para lista</button>
      </div>
    );
  }

  const petExpenses = expenses.filter(e => e.petId === pet.id);
  const totalSpent = petExpenses.reduce((sum, e) => sum + e.amount, 0);
  const petReminders = reminders.filter(r => r.petId === pet.id && !r.isCompleted);

  const fmt = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency }).format(val);

  const handleDelete = () => {
    if (confirm(`⚠️ ATENÇÃO: Deseja realmente remover ${pet.name}? Isso excluirá permanentemente todo o histórico de gastos e lembretes vinculados a este pet. Esta ação não pode ser desfeita.`)) {
      deletePet(pet.id);
      navigate('/pets');
    }
  };

  return (
    <div className="animate-fade-in px-1 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Perfil do Pet</h1>
        <div className="flex items-center gap-1">
            <button 
                onClick={() => navigate(`/pets/edit/${pet.id}`)}
                className="p-2 text-gray-400 hover:text-primary transition-colors"
            >
                <Edit2 className="w-5 h-5" />
            </button>
            <button 
                onClick={handleDelete}
                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 mb-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-6xl shadow-inner border border-gray-100 mb-4">
          {SPECIES_EMOJI[pet.species]}
        </div>
        <h2 className="text-3xl font-black text-gray-800">{pet.name}</h2>
        <p className="text-gray-400 font-semibold mt-1">{pet.breed || pet.species}</p>
        
        <div className="flex gap-4 mt-6 w-full">
          <div className="flex-1 bg-gray-50 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Gasto</p>
            <p className="text-xl font-black text-primary">{fmt(totalSpent)}</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lembretes</p>
            <p className="text-xl font-black text-blue-500">{petReminders.length}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
          onClick={() => navigate('/add-expense')}
          className="flex items-center justify-center gap-2 bg-white border border-gray-100 p-4 rounded-2xl text-sm font-bold text-gray-700 active:scale-95 transition-all shadow-sm"
        >
          <PlusCircle className="w-5 h-5 text-primary" />
          Novo Gasto
        </button>
        <button 
          onClick={() => navigate('/health')}
          className="flex items-center justify-center gap-2 bg-white border border-gray-100 p-4 rounded-2xl text-sm font-bold text-gray-700 active:scale-95 transition-all shadow-sm"
        >
          <HeartPulse className="w-5 h-5 text-pink-500" />
          Saúde
        </button>
      </div>

      {/* Recent History Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Histórico Recente</h3>
          <button onClick={() => navigate('/expenses')} className="text-xs font-bold text-primary">Ver Tudo</button>
        </div>

        {petExpenses.length === 0 ? (
          <div className="bg-white/50 border-2 border-dashed border-gray-100 rounded-3xl p-10 text-center">
            <p className="text-gray-400 text-sm">Nenhum gasto registrado para {pet.name}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {petExpenses.slice(0, 5).map(expense => (
              <div key={expense.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{expense.category}</p>
                    <p className="text-[10px] font-bold text-gray-400">{format(parseISO(expense.date), 'dd/MM/yyyy')}</p>
                  </div>
                </div>
                <span className="font-black text-gray-700 text-sm">{fmt(expense.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details List */}
      <div className="mt-8 bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/30">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Informações Adicionais</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <div className="p-4 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Espécie</span>
            <span className="text-sm font-bold text-gray-800">{pet.species}</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Raça</span>
            <span className="text-sm font-bold text-gray-800">{pet.breed || 'Não informada'}</span>
          </div>
          {pet.birthDate && (
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Nascimento</span>
              <span className="text-sm font-bold text-gray-800">{format(parseISO(pet.birthDate), 'dd/MM/yyyy')}</span>
            </div>
          )}
          <div className="p-4 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${pet.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {pet.status === 'Active' ? 'Ativo' : pet.status === 'Deceased' ? 'Anjinho 🕊️' : 'Doado'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
