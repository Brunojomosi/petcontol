import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Pet, Species } from '../../types';
import { SPECIES_LIST, SPECIES_EMOJI } from '../../constants';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

export const PetForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addPet, updatePet, deletePet, pets } = useApp();
  
  const isEditing = !!id;
  const existingPet = isEditing ? pets.find(p => p.id === id) : null;

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('Cat');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [status, setStatus] = useState<'Active' | 'Deceased' | 'Rehomed'>('Active');

  useEffect(() => {
    if (isEditing && existingPet) {
      setName(existingPet.name);
      setSpecies(existingPet.species);
      setBreed(existingPet.breed || '');
      setBirthDate(existingPet.birthDate || '');
      setStatus(existingPet.status);
    }
  }, [isEditing, existingPet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const petData: Pet = {
      id: isEditing ? id : crypto.randomUUID(),
      name,
      species,
      breed: breed || undefined,
      birthDate: birthDate || undefined,
      status
    };

    if (isEditing) {
      updatePet(petData);
    } else {
      addPet(petData);
    }
    navigate(isEditing ? `/pets/${id}` : '/pets');
  };

  const handleDelete = () => {
    if (confirm(`⚠️ ATENÇÃO: Deseja realmente remover ${name}? Isso excluirá permanentemente todo o histórico de gastos e lembretes vinculados a este pet. Esta ação não pode ser desfeita.`)) {
      deletePet(id!);
      navigate('/pets');
    }
  };

  return (
    <div className="max-w-md mx-auto px-1 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 -ml-2 text-gray-400 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-black text-gray-800">{isEditing ? 'Editar Pet' : 'Novo Pet'}</h1>
        </div>
        {isEditing && (
            <button onClick={handleDelete} className="p-2 text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-5 h-5" />
            </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
        
        {/* Name Input */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome do Pet</label>
          <input 
            autoFocus
            required
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-primary outline-none transition-all font-medium text-gray-700"
            placeholder="Ex: Luna"
          />
        </div>

        {/* Species Select */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Espécie</label>
          <div className="grid grid-cols-5 gap-2">
            {SPECIES_LIST.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpecies(s)}
                title={s}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  species === s 
                  ? 'bg-primary/10 border-primary text-primary scale-105' 
                  : 'bg-white border-gray-50 text-gray-400 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">{SPECIES_EMOJI[s]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Breed & Status */}
        <div className="grid grid-cols-1 gap-5">
            <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Raça (Opcional)</label>
                <input 
                    type="text" 
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-primary outline-none transition-all font-medium text-gray-700"
                    placeholder="Ex: Siamês"
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full px-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-primary outline-none appearance-none transition-all font-medium text-gray-700"
                    >
                        <option value="Active">Ativo</option>
                        <option value="Deceased">Anjinho 🕊️</option>
                        <option value="Rehomed">Doado</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Nascimento</label>
                    <input 
                        type="date" 
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full px-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-primary outline-none transition-all font-medium text-gray-700 text-sm"
                    />
                </div>
            </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary hover:bg-green-600 text-white font-black text-xl py-5 rounded-3xl shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-3 mt-4 active:scale-95"
        >
          <Save className="w-7 h-7" />
          {isEditing ? 'Atualizar Pet' : 'Salvar Pet'}
        </button>

      </form>
    </div>
  );
};