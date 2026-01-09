import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Pet, Species } from '../../types';
import { SPECIES_LIST } from '../../constants';
import { ArrowLeft, Save } from 'lucide-react';

export const PetForm: React.FC = () => {
  const navigate = useNavigate();
  const { addPet } = useApp();
  
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('Cat');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPet: Pet = {
      id: crypto.randomUUID(),
      name,
      species,
      breed: breed || undefined,
      birthDate: birthDate || undefined,
      status: 'Active'
    };

    addPet(newPet);
    navigate('/pets');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 text-gray-500 hover:text-gray-800">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add New Pet</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input 
            required
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="e.g. Luna"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
          <div className="grid grid-cols-3 gap-2">
            {SPECIES_LIST.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpecies(s)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  species === s 
                  ? 'bg-primary/10 border-primary text-primary' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Breed (Optional)</label>
          <input 
            type="text" 
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="e.g. Siamese"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date (Optional)</label>
          <input 
            type="date" 
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary hover:bg-green-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 mt-4"
        >
          <Save className="w-5 h-5" />
          Save Pet Profile
        </button>

      </form>
    </div>
  );
};