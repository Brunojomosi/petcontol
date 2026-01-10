
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pet, Expense, Reminder, DashboardMetrics } from '../types';
import { startOfMonth, startOfYear, isAfter, parseISO } from 'date-fns';
import { DEFAULT_EXPENSE_CATEGORIES } from '../constants';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

interface AppContextType {
  session: Session | null;
  loading: boolean;
  isRecovering: boolean;
  pets: Pet[];
  expenses: Expense[];
  categories: string[];
  reminders: Reminder[];
  currency: string;
  addPet: (pet: Pet) => Promise<void>;
  updatePet: (pet: Pet) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  addExpense: (expense: Expense) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addCategory: (category: string) => Promise<void>;
  removeCategory: (category: string) => Promise<void>;
  addReminder: (reminder: Reminder) => Promise<void>;
  updateReminder: (reminder: Reminder) => Promise<void>;
  toggleReminder: (id: string, isCompleted: boolean) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  setCurrency: (currency: string) => Promise<void>;
  resetApp: () => Promise<void>;
  getMetrics: () => DashboardMetrics;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecovering, setIsRecovering] = useState(false);
  
  const [pets, setPets] = useState<Pet[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [currency, setCurrencyState] = useState<string>('BRL');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const isRecovery = window.location.href.includes('type=recovery') || 
                        window.location.href.includes('access_token=');
      
      if (isRecovery) setIsRecovering(true);
      setSession(session);
      if (session && !isRecovery) {
        fetchData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovering(true);
        setLoading(false);
        return;
      }

      if (session) {
        const isRecovery = window.location.href.includes('type=recovery') || 
                          window.location.href.includes('access_token=');
        if (!isRecovery) fetchData(session.user.id);
        else {
            setIsRecovering(true);
            setLoading(false);
        }
      } else {
        setPets([]);
        setExpenses([]);
        setCategories([]);
        setReminders([]);
        setLoading(false);
        setIsRecovering(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async (userId: string) => {
    setLoading(true);
    try {
      const [
        { data: settings },
        { data: catsData },
        { data: petsData },
        { data: expData },
        { data: remData }
      ] = await Promise.all([
        supabase.from('user_settings').select('currency').eq('user_id', userId).maybeSingle(),
        supabase.from('categories').select('name').eq('user_id', userId).order('created_at', { ascending: true }),
        supabase.from('pets').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
        supabase.from('expenses').select('*').eq('user_id', userId).order('date', { ascending: false }),
        supabase.from('reminders').select('*').eq('user_id', userId).order('date', { ascending: true })
      ]);

      if (settings) {
        setCurrencyState(settings.currency);
      } else {
        await supabase.from('user_settings').upsert({ user_id: userId, currency: 'BRL' });
      }

      if (catsData && catsData.length > 0) {
        setCategories(catsData.map((c: any) => c.name));
      } else {
        setCategories(DEFAULT_EXPENSE_CATEGORIES);
        const defaults = DEFAULT_EXPENSE_CATEGORIES.map(cat => ({ user_id: userId, name: cat }));
        supabase.from('categories').insert(defaults).then();
      }

      if (petsData) {
        setPets(petsData.map((p: any) => ({
          id: p.id,
          name: p.name,
          species: p.species,
          breed: p.breed,
          birthDate: p.birth_date,
          photoUrl: p.photo_url,
          status: p.status
        })));
      }

      if (expData) {
        setExpenses(expData.map((e: any) => ({
          id: e.id,
          petId: e.pet_id,
          amount: parseFloat(e.amount),
          date: e.date,
          category: e.category,
          paymentMethod: e.payment_method,
          notes: e.notes
        })));
      }

      if (remData) {
        setReminders(remData.map((r: any) => ({
          id: r.id,
          petId: r.pet_id,
          title: r.title,
          date: r.date,
          isCompleted: r.is_completed
        })));
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPet = async (pet: Pet) => {
    if (!session) return;
    setPets(prev => [...prev, pet]);
    await supabase.from('pets').insert({
        id: pet.id,
        user_id: session.user.id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        birth_date: pet.birthDate,
        status: pet.status,
        photo_url: pet.photoUrl
    });
  };

  const updatePet = async (updatedPet: Pet) => {
    if(!session) return;
    setPets(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
    await supabase.from('pets').update({
        name: updatedPet.name,
        species: updatedPet.species,
        breed: updatedPet.breed,
        birth_date: updatedPet.birthDate,
        status: updatedPet.status
    }).eq('id', updatedPet.id).eq('user_id', session.user.id);
  };

  const deletePet = async (id: string) => {
    if(!session) return;
    const uid = session.user.id;
    setPets(prev => prev.filter(p => p.id !== id));
    setExpenses(prev => prev.filter(e => e.petId !== id));
    setReminders(prev => prev.filter(r => r.petId !== id));
    await Promise.all([
      supabase.from('expenses').delete().eq('pet_id', id).eq('user_id', uid),
      supabase.from('reminders').delete().eq('pet_id', id).eq('user_id', uid),
      supabase.from('pets').delete().eq('id', id).eq('user_id', uid)
    ]);
  };

  const addExpense = async (expense: Expense) => {
    if (!session) return;
    setExpenses(prev => [expense, ...prev]);
    await supabase.from('expenses').insert({
        id: expense.id,
        user_id: session.user.id,
        pet_id: expense.petId,
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
        payment_method: expense.paymentMethod,
        notes: expense.notes
    });
  };

  const updateExpense = async (expense: Expense) => {
    if (!session) return;
    setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
    await supabase.from('expenses').update({
      pet_id: expense.petId,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      payment_method: expense.paymentMethod,
      notes: expense.notes
    }).eq('id', expense.id).eq('user_id', session.user.id);
  };

  const deleteExpense = async (id: string) => {
    if(!session) return;
    setExpenses(prev => prev.filter(e => e.id !== id));
    await supabase.from('expenses').delete().eq('id', id).eq('user_id', session.user.id);
  };

  const addCategory = async (category: string) => {
    if (!session) return;
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
      await supabase.from('categories').insert({ user_id: session.user.id, name: category });
    }
  };

  const removeCategory = async (category: string) => {
    if (!session) return;
    setCategories(prev => prev.filter(c => c !== category));
    await supabase.from('categories').delete().eq('user_id', session.user.id).eq('name', category);
  };

  const addReminder = async (reminder: Reminder) => {
    if (!session) return;
    setReminders(prev => [...prev, reminder]);
    await supabase.from('reminders').insert({
      id: reminder.id,
      user_id: session.user.id,
      pet_id: reminder.petId,
      title: reminder.title,
      date: reminder.date,
      is_completed: reminder.isCompleted
    });
  };

  const updateReminder = async (reminder: Reminder) => {
    if (!session) return;
    setReminders(prev => prev.map(r => r.id === reminder.id ? reminder : r));
    await supabase.from('reminders').update({
      pet_id: reminder.petId,
      title: reminder.title,
      date: reminder.date,
      is_completed: reminder.isCompleted
    }).eq('id', reminder.id).eq('user_id', session.user.id);
  };

  const toggleReminder = async (id: string, isCompleted: boolean) => {
    if (!session) return;
    setReminders(prev => prev.map(r => r.id === id ? { ...r, isCompleted } : r));
    await supabase.from('reminders').update({ is_completed: isCompleted }).eq('id', id).eq('user_id', session.user.id);
  };

  const deleteReminder = async (id: string) => {
    if (!session) return;
    setReminders(prev => prev.filter(r => r.id !== id));
    await supabase.from('reminders').delete().eq('id', id).eq('user_id', session.user.id);
  };

  const setCurrency = async (c: string) => {
    setCurrencyState(c);
    if (!session) return;
    await supabase.from('user_settings').upsert({ user_id: session.user.id, currency: c }, { onConflict: 'user_id' });
  };

  const resetApp = async () => {
    if(!session) return;
    const uid = session.user.id;
    setLoading(true);
    await Promise.all([
      supabase.from('expenses').delete().eq('user_id', uid),
      supabase.from('pets').delete().eq('user_id', uid),
      supabase.from('categories').delete().eq('user_id', uid),
      supabase.from('reminders').delete().eq('user_id', uid)
    ]);
    setPets([]);
    setExpenses([]);
    setCategories(DEFAULT_EXPENSE_CATEGORIES);
    setReminders([]);
    setCurrencyState('BRL');
    const defaults = DEFAULT_EXPENSE_CATEGORIES.map(cat => ({ user_id: uid, name: cat }));
    await supabase.from('categories').insert(defaults);
    setLoading(false);
  };

  const signOut = async () => { await supabase.auth.signOut(); };

  const getMetrics = (): DashboardMetrics => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const yearStart = startOfYear(now);
    let totalMonth = 0;
    let totalYear = 0;
    const categoryMap: Record<string, number> = {};
    const petMap: Record<string, number> = {};
    expenses.forEach(exp => {
      const expDate = parseISO(exp.date);
      const amount = Number(exp.amount);
      if (isAfter(expDate, monthStart)) totalMonth += amount;
      if (isAfter(expDate, yearStart)) totalYear += amount;
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + amount;
      const petName = pets.find(p => p.id === exp.petId)?.name || 'Desconhecido';
      petMap[petName] = (petMap[petName] || 0) + amount;
    });
    return {
      totalMonth,
      totalYear,
      byCategory: Object.entries(categoryMap).map(([name, value]) => ({ name, value })),
      byPet: Object.entries(petMap).map(([name, value]) => ({ name, value })),
    };
  };

  return (
    <AppContext.Provider value={{
      session, loading, isRecovering, pets, expenses, categories, reminders, currency,
      addPet, updatePet, deletePet, addExpense, updateExpense, deleteExpense, addCategory, removeCategory,
      addReminder, updateReminder, toggleReminder, deleteReminder, setCurrency, resetApp, getMetrics, signOut
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
