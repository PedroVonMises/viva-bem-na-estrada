import { createClient } from "@supabase/supabase-js";

// Use apenas import.meta.env para o frontend Vite
const supabaseUrl = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Isso ajuda a depurar: se aparecer no console do navegador, você sabe o que falta.
  console.error("Erro Crítico: Variáveis de ambiente do Supabase não encontradas.");
  // Não lançar erro aqui pode permitir que a UI de erro apareça, em vez de tela branca total
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

// Mantenha o process.env APENAS para o cliente de servidor (se usado em Node.js/API routes)
export const createServiceRoleClient = () => {
  // Verifica se process existe antes de acessar (segurança para não quebrar no browser)
  const serviceRoleKey = typeof process !== "undefined" ? process.env.SUPABASE_SERVICE_ROLE_KEY : undefined;
  
  if (!serviceRoleKey) {
    throw new Error("Missing Supabase Service Role Key");
  }
  return createClient(supabaseUrl || "", serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
};