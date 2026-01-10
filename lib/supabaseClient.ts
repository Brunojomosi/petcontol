import { createClient } from '@supabase/supabase-js';

// URL do projeto Supabase
const SUPABASE_URL = 'https://rdbvsfbidcdsittdaunk.supabase.co'; 

/**
 * IMPORTANTE: Para o funcionamento do Auth e do Banco de Dados, 
 * a chave abaixo é a 'anon public key'.
 * 
 * SEGURANÇA: Como esta chave é pública no front-end, você DEVE habilitar 
 * o Row Level Security (RLS) no painel do Supabase para todas as tabelas.
 * Sem o RLS ativo com as políticas do arquivo supabase_rls.sql, 
 * seus dados estarão vulneráveis!
 */
const SUPABASE_ANON_KEY = 'sb_publishable_24XByIW_uLY1wM7fgK-jOw_oqlRyaPK';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);