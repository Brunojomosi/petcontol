import { createClient } from '@supabase/supabase-js';

// URL do projeto Supabase
const SUPABASE_URL = 'https://rdbvsfbidcdsittdaunk.supabase.co'; 

/**
 * IMPORTANTE: Para o funcionamento do Auth e do Banco de Dados, 
 * a chave abaixo deve ser a 'anon public key' do seu projeto Supabase.
 */
const SUPABASE_ANON_KEY = 'sb_publishable_24XByIW_uLY1wM7fgK-jOw_oqlRyaPK';

// Inicialização do cliente. Em caso de erro na chave, o Supabase lançará uma exceção capturável.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);