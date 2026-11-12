'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica se o token ou o usuário existem no localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token && !user) {
      router.replace('/login'); // Usar replace evita voltar no histórico
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Se não estiver autenticado, retorna uma tela totalmente preta/vazia.
  // Isso impede que o painel do dashboard apareça na tela por um segundo.
  if (!isAuthenticated) {
    return (
      <div style={{ background: '#121212', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  return <>{children}</>;
}