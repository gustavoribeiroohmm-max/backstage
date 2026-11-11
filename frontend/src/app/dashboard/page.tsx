'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id_usuario?: number;
  id?: number;
  nome: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Erro ao ler dados do usuário:', err);
        router.push('/login');
      }
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center text-gray-400">
        Carregando painel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-gray-100 flex flex-col">
      {/* Topbar / Header */}
      <header className="bg-[#16161a] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white">
            ∏
          </div>
          <span className="text-xl font-bold tracking-wide">Backstage</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right text-xs sm:text-sm">
            <p className="font-semibold text-white">{user.nome}</p>
            <p className="text-gray-400">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-red-600/20 hover:text-red-400 text-gray-300 text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-gray-700 hover:border-red-500/40 transition"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl w-full mx-auto px-6 py-8 flex-1 space-y-8">
        {/* Banner de Boas-Vindas */}
        <div className="bg-gradient-to-r from-red-950/40 via-[#16161a] to-[#16161a] border border-red-900/30 rounded-xl p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Olá, {user.nome}! 👋
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Bem-vindo ao seu painel Backstage. Gerencie suas bandas, oportunidades e mantenha seu perfil atualizado.
          </p>
        </div>

        {/* Atalhos Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: Minhas Bandas */}
          <Link
            href="/dashboard/bandas"
            className="group bg-[#16161a] hover:bg-[#1a1a20] border border-gray-800 hover:border-red-500/50 rounded-xl p-6 transition flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 bg-red-600/10 border border-red-500/30 rounded-lg flex items-center justify-center text-xl">
                🎸
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-red-400 transition">
                Minhas Bandas
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Cadastre novas bandas, organize seus projetos musicais e edite informações da equipe.
              </p>
            </div>
            <span className="text-xs font-semibold text-red-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Gerenciar bandas →
            </span>
          </Link>

        {/* Card: Oportunidades */}
          <Link
            href="/dashboard/oportunidades"
            className="group bg-[#16161a] hover:bg-[#1a1a20] border border-gray-800 hover:border-red-500/50 rounded-xl p-6 transition flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 bg-red-600/10 border border-red-500/30 rounded-lg flex items-center justify-center text-xl">
                🎙️
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-red-400 transition">
                Oportunidades
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Busque vagas em bandas, testes para músicos e publique oportunidades para seu projeto.
              </p>
            </div>
            <span className="text-xs font-semibold text-red-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Ver vagas →
            </span>
          </Link>

          {/* Card / Módulo de Perfil */}
          <Link
            href="/dashboard/perfil" // 👈 Alterado de /dashboard/meu_perfil para /dashboard/perfil
            className="bg-[#16161a] hover:bg-[#1a1a20] border border-gray-800 hover:border-red-500/40 rounded-2xl p-6 transition flex flex-col justify-between space-y-4 group shadow-xl"
          >
            <div className="space-y-2">
              <div className="text-3xl">👤</div>
              <h2 className="text-xl font-bold text-white group-hover:text-red-400 transition">
                Meu Perfil Profissional
              </h2>
              <p className="text-xs text-gray-400">
                Visualize suas informações de artista, instrumentos, gêneros musicais e biografia.
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between text-xs font-semibold text-gray-400">
              <span>Acessar Perfil</span>
              <span className="text-red-400 group-hover:translate-x-1 transition-transform">
                Abrir →
              </span>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}