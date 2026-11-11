'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

interface Banda {
  id_banda: number;
  nome_banda: string;
  descricao?: string;
  genero?: string;
  cidade?: string;
}

export default function BandasPage() {
  const [bandas, setBandas] = useState<Banda[]>([]);
  const [nome, setNome] = useState('');
  const [genero, setGenero] = useState('');
  const [cidade, setCidade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const id = parsed.id_usuario || parsed.id;
        setUserId(id);
        if (id) carregarBandas(id);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  async function carregarBandas(idCriador: number) {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/banda/minhas?id_criador=${idCriador}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setBandas(data);
        } else if (Array.isArray(data.bandas)) {
          setBandas(data.bandas);
        } else if (Array.isArray(data.data)) {
          setBandas(data.data);
        } else {
          setBandas([]);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar bandas:', err);
    }
  }

  async function handleCriarBanda(e: FormEvent) {
    e.preventDefault();
    if (!userId) return;

    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await fetch(`/api/banda?id_criador=${userId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome_banda: nome,
          genero,
          cidade,
          descricao,
        }),
      });

      if (res.ok) {
        setNome('');
        setGenero('');
        setCidade('');
        setDescricao('');
        await carregarBandas(userId);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Erro ao cadastrar banda: ${errData.message || res.statusText}`);
      }
    } catch (err) {
      console.error('Erro ao criar banda:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-gray-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">
              ← Voltar ao Dashboard
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Minhas Bandas 🎸</h1>
          </div>
        </div>

        {/* Formulário de Cadastro */}
        <div className="bg-[#16161a] p-6 rounded-xl border border-gray-800 shadow-xl">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">Cadastrar Nova Banda</h2>
          <form onSubmit={handleCriarBanda} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Nome da Banda *</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Legião Urbana"
                className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Gênero Musical</label>
              <input
                type="text"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                placeholder="Ex: Rock Nacional, Indie, Metal"
                className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Cidade</label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: Taubaté - SP"
                className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Descrição / Bio</label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Resumo sobre a banda..."
                className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="md:col-span-2 text-right">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition disabled:opacity-50"
              >
                {loading ? 'Salvando...' : '+ Cadastrar Banda'}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Bandas (Agora Clicáveis) */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-200">Bandas Cadastradas</h2>
          {bandas.length === 0 ? (
            <div className="border border-dashed border-gray-800 rounded-xl p-8 text-center text-gray-500 text-sm">
              Você ainda não cadastrou nenhuma banda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bandas.map((b) => (
                <Link
                  key={b.id_banda}
                  href={`/dashboard/bandas/${b.id_banda}`}
                  className="bg-[#16161a] hover:bg-[#1a1a20] border border-gray-800 hover:border-red-500/40 rounded-xl p-5 transition flex flex-col justify-between space-y-4 group shadow-lg"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition">{b.nome_banda}</h3>
                    {b.genero && (
                      <span className="inline-block bg-red-500/10 text-red-400 text-xs px-2.5 py-1 rounded font-medium border border-red-500/20">
                        {b.genero}
                      </span>
                    )}
                    {b.cidade && <p className="text-xs text-gray-400">📍 {b.cidade}</p>}
                    {b.descricao && <p className="text-sm text-gray-300 line-clamp-2">{b.descricao}</p>}
                  </div>

                  <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
                    <span>Ver detalhes & Integrantes</span>
                    <span className="text-red-400 font-medium group-hover:translate-x-1 transition-transform">
                      Gerenciar →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}