import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Edit } from 'lucide-react';
import { SPECIES_EMOJI } from '../constants';

export const PetList: React.FC = () => {
  const { pets, deletePet } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Pets</h1>
        <button 
          onClick={() => navigate('/pets/add')}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium shadow-sm hover:bg-green-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Pet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.length === 0 && (
            <div className="col-span-full text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">No pets added yet.</p>
            </div>
        )}

        {pets.map(pet => (
          <div key={pet.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between group">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl shadow-inner">
                {SPECIES_EMOJI[pet.species]}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">{pet.name}</h3>
                <p className="text-sm text-gray-500">{pet.breed || pet.species}</p>
                <div className="mt-1 flex gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${pet.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {pet.status}
                    </span>
                    {pet.birthDate && (
                        <span className="text-xs text-gray-400 flex items-center">
                            {new Date(pet.birthDate).getFullYear()}
                        </span>
                    )}
                </div>
              </div>
            </div>
            
            <button 
                onClick={() => {
                    if(confirm(`Are you sure you want to remove ${pet.name}?`)) {
                        deletePet(pet.id);
                    }
                }}
                className="text-gray-300 hover:text-red-500 transition-colors p-2"
            >
                <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};