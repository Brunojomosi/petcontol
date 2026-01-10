import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, ChevronRight, Calendar } from 'lucide-react';
import { SPECIES_EMOJI } from '../constants';

export const PetList: React.FC = () => {
  const { pets, deletePet } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 px-1">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-black text-gray-800">Meus Pets</h1>
            <p className="text-sm text-gray-400">{pets.length} amigo{pets.length !== 1 ? 's' : ''} cadastrado{pets.length !== 1 ? 's' : ''}</p>
        </div>
        <button 
          onClick={() => navigate('/pets/add')}
          className="bg-primary text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-green-100 hover:bg-green-600 transition-all active:scale-90"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pets.length === 0 && (
            <div className="text-center py-16 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                    <Plus className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-gray-400 font-medium">Nenhum pet por aqui ainda.</p>
                <button 
                    onClick={() => navigate('/pets/add')}
                    className="mt-4 text-primary font-bold hover:underline"
                >
                    Adicionar agora
                </button>
            </div>
        )}

        {pets.map(pet => (
          <div 
            key={pet.id} 
            onClick={() => navigate(`/pets/${pet.id}`)}
            className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-5 min-w-0">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl shadow-inner border border-gray-100">
                {SPECIES_EMOJI[pet.species]}
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-xl text-gray-800 truncate pr-2">{pet.name}</h3>
                <p className="text-sm font-semibold text-gray-400 truncate">{pet.breed || pet.species}</p>
                <div className="mt-2 flex items-center gap-3">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${pet.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'}`}>
                        {pet.status === 'Active' ? 'Ativo' : pet.status}
                    </span>
                    {pet.birthDate && (
                        <span className="text-xs text-gray-300 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(pet.birthDate).getFullYear()}
                        </span>
                    )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
                <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};