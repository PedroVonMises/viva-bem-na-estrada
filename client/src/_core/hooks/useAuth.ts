import { useCallback, useEffect, useState } from "react";
import { getLoginUrl } from "../../const";

// AVISO: Esta é uma autenticação *muito* simplificada e insegura,
// feita apenas para atender ao requisito de "remover autenticação ou adicionar senha simples"
// em um ambiente puramente estático (Vercel + Vite).
// A senha é exposta no código do cliente.
const SIMPLE_ADMIN_PASSWORD = "super-secret-admin-password"; // Deve ser a mesma do .env

const AUTH_TOKEN_KEY = "admin-auth-token";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(AUTH_TOKEN_KEY) === SIMPLE_ADMIN_PASSWORD;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (password: string) => {
    setLoading(true);
    setError(null);
    
    // Simulação de chamada de API
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === SIMPLE_ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_TOKEN_KEY, SIMPLE_ADMIN_PASSWORD);
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    } else {
      setError("Senha incorreta.");
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setIsAuthenticated(false);
  }, []);

  // Redirecionamento para a página de login se não estiver autenticado
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const isLoginPage = window.location.pathname === getLoginUrl();
    const isAdminRoute = window.location.pathname.startsWith("/admin");

    if (isAdminRoute && !isAuthenticated && !isLoginPage) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated]);

  return {
    user: isAuthenticated ? { role: "admin" } : null, // Simula um objeto de usuário
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    refresh: () => {}, // Não faz nada na autenticação simples
  };
}
