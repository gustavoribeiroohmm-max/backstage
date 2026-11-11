'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Usuario {
  nome: string;
  email: string;
}

interface Perfil {
  nome_artistico?: string;
  cidade?: string;
  instrumentos?: string;
  generos?: string;
  biografia?: string;
}

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega dados do usuário do localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUsuario(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/perfil', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const p = Array.isArray(data) ? data[0] : data;
        setPerfil(p);
      }
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
    } finally {
      setLoading(false);
    }
  }

  // Define o nome principal de exibição (Nome Artístico > Nome do Usuário > Fallback)
  const nomeExibicao = perfil?.nome_artistico || usuario?.nome || 'Usuário';
  const primeiraLetra = nomeExibicao.charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] text-gray-100 p-8 flex items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-gray-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Topo com navegação e botão de edição */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition">
            ← Voltar ao Dashboard
          </Link>
          <Link
            href="/dashboard/perfil/meu_perfil"
            className="bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-800/60 text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            ✏️ Editar Informações
          </Link>
        </div>

        {/* Card Principal do Perfil */}
        <div className="bg-[#16161a] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Banner Superior */}
          <div className="h-28 bg-gradient-to-r from-red-950/40 to-neutral-900 border-b border-gray-800/60"></div>

          {/* Conteúdo com Avatar */}
          <div className="p-6 md:p-8 space-y-6 relative -mt-14">
            
            {/* Avatar com a inicial */}
            <div className="w-20 h-20 rounded-2xl bg-red-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg border-4 border-[#16161a]">
              {primeiraLetra}
            </div>

            {/* Nome Artístico, Nome Civil e Email */}
            <div className="space-y-1">
              {/* Exibe o Nome Artístico como destaque principal */}
              <h1 className="text-2xl font-bold text-white">{nomeExibicao}</h1>
              
              {/* Se o Nome Artístico for diferente do Nome Civil, exibe o Nome Civil em menor */}
              {perfil?.nome_artistico && usuario?.nome && perfil.nome_artistico !== usuario.nome && (
                <p className="text-xs text-gray-400">Nome civil: {usuario.nome}</p>
              )}
              
              <p className="text-xs text-gray-500">{usuario?.email}</p>
            </div>

            {/* Informações Rápidas (Instrumentos, Gênero e Cidade) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-b border-gray-800/80 py-5">
              <div>
                <p className="text-xs font-medium text-gray-400 mb-1">Instrumento Principal / Função</p>
                <p className="text-sm font-semibold text-white">{perfil?.instrumentos || 'Não informado'}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-400 mb-1">Gênero Musical</p>
                <p className="text-sm font-semibold text-white">{perfil?.generos || 'Não informado'}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-400 mb-1">Cidade</p>
                <p className="text-sm font-semibold text-white">{perfil?.cidade || 'Não informada'}</p>
              </div>
            </div>

            {/* Sobre mim / Biografia */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                SOBRE MIM / BIOGRAFIA
              </h3>
              <div className="bg-[#0d0d0f] border border-gray-800 rounded-xl p-4">
                {perfil?.biografia ? (
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                    {perfil.biografia}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    Nenhuma biografia cadastrada ainda. Clique em "Editar Informações" para preencher seu perfil profissional.
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}