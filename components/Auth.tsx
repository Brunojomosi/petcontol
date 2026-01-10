import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PawPrint, Loader2, KeyRound, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthProps {
  initialMode?: 'signIn' | 'signUp' | 'forgotPassword' | 'updatePassword';
}

export const Auth: React.FC<AuthProps> = ({ initialMode = 'signIn' }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signIn' | 'signUp' | 'forgotPassword' | 'updatePassword'>(initialMode);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Escuta eventos de auth para mudar o modo se o Supabase disparar PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY' && mode !== 'updatePassword') {
        setMode('updatePassword');
        setMessage({ text: 'Link validado! Digite sua nova senha abaixo.', type: 'success' });
      }
    });

    // Verificação forçada inicial via URL
    const hash = window.location.hash;
    if (hash.includes('type=recovery') || hash.includes('access_token=')) {
      setMode('updatePassword');
    }

    return () => subscription.unsubscribe();
  }, [mode]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const redirectTo = window.location.origin + '/';

    try {
      if (mode === 'signUp') {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: redirectTo }
        });
        if (error) throw error;
        setMessage({ text: 'Verifique seu e-mail para confirmar a conta.', type: 'success' });
      } 
      else if (mode === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } 
      else if (mode === 'forgotPassword') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectTo,
        });
        if (error) throw error;
        setMessage({ text: `Link de recuperação enviado para ${email}.`, type: 'success' });
      } 
      else if (mode === 'updatePassword') {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMessage({ text: 'Senha atualizada com sucesso! Redirecionando...', type: 'success' });
        
        // Limpa a URL e recarrega para entrar no Dashboard limpo
        setTimeout(() => {
          window.location.href = window.location.origin;
        }, 2000);
      }
    } catch (error: any) {
      console.error('Erro Auth:', error);
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 w-full max-w-md border border-gray-100 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-4 rounded-3xl mb-4">
            <PawPrint className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">PetControl</h1>
          <p className="text-gray-400 font-medium text-center mt-1">
            {mode === 'forgotPassword' ? 'Recuperação de Acesso' : 
             mode === 'updatePassword' ? 'Criar Nova Senha' : 
             'Gestão Inteligente para Pets'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {mode !== 'updatePassword' && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-primary outline-none transition-all font-medium"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
          )}

          {mode !== 'forgotPassword' && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                {mode === 'updatePassword' ? 'Sua Nova Senha' : 'Senha'}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-primary outline-none transition-all font-medium"
                  placeholder="No mínimo 6 caracteres"
                />
              </div>
            </div>
          )}

          {message && (
            <div className={`p-4 rounded-2xl text-sm font-bold flex items-start gap-3 animate-fade-in ${
              message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
              <span>{message.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-green-600 text-white font-black text-lg py-5 rounded-3xl shadow-xl shadow-green-100 transition-all flex items-center justify-center active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 
             mode === 'signIn' ? 'Entrar' : 
             mode === 'signUp' ? 'Criar Conta' : 
             mode === 'forgotPassword' ? 'Enviar Link' : 'Salvar Nova Senha'}
          </button>
        </form>

        <div className="mt-8 space-y-3 text-center">
          {mode === 'signIn' && (
            <>
              <button
                onClick={() => { setMode('forgotPassword'); setMessage(null); }}
                className="block w-full text-sm font-bold text-gray-400 hover:text-primary transition-colors"
              >
                Esqueceu a senha?
              </button>
              <button
                onClick={() => { setMode('signUp'); setMessage(null); }}
                className="text-sm font-bold text-gray-600 hover:text-primary transition-colors"
              >
                Não tem conta? <span className="text-primary underline">Cadastre-se</span>
              </button>
            </>
          )}

          {(mode === 'signUp' || mode === 'forgotPassword' || mode === 'updatePassword') && (
            <button
              onClick={() => { setMode('signIn'); setMessage(null); }}
              className="flex items-center justify-center gap-2 w-full text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};