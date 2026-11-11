'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';

interface Anunciante {
  id_usuario: number;
  nome: string;
  email: string;
}

interface Oportunidade {
  id_oportunidade: number;
  titulo: string;
  descricao: string;
  cidade: string;
  instrumento_procurado: string;
  anunciante?: Anunciante;
}

export default function OportunidadesPage() {
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  const [titulo, setTitulo] = useState('');
  const [instrumento, setInstrumento] = useState('');
  const [cidade, setCidade] = useState('');
  const [descricao, setDescricao] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const id = parsed.id_usuario || parsed.id;
        setUserId(id);
      } catch (e) {
        console.error(e);
      }
    }
    carregarOportunidades();
  }, []);

async function carregarOportunidades() {
    const token = localStorage.getItem('token'); 
    try {
      const res = await fetch('/api/oportunidade', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOportunidades(data);
        } else if (Array.isArray(data.oportunidades)) {
          setOportunidades(data.oportunidades);
        } else if (Array.isArray(data.data)) {
          setOportunidades(data.data);
        } else {
          setOportunidades([]);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar oportunidades:', err);
    }
  }

  async function handleCriarOportunidade(e: FormEvent) {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    let currentUserId = userId;
    if (!currentUserId && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        currentUserId = parsed.id_usuario || parsed.id;
      } catch (e) {
        console.error(e);
      }
    }

    if (!currentUserId) {
      alert('Sessão inválida. Por favor, faça login novamente.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/oportunidade?id_anunciante=${currentUserId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Header JWT adicionado aqui
        },
        body: JSON.stringify({
          titulo,
          instrumento_procurado: instrumento,
          cidade,
          descricao,
        }),
      });

      if (res.ok) {
        setTitulo('');
        setInstrumento('');
        setCidade('');
        setDescricao('');
        await carregarOportunidades();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Não foi possível criar o anúncio: ${errData.message || res.statusText}`);
      }
    } catch (err) {
      console.error('Erro ao criar oportunidade:', err);
      alert('Erro de conexão com o servidor.');
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
            <h1 className="text-2xl font-bold tracking-tight">Oportunidades & Vagas 🎙️</h1>
          </div>
        </div>

        {/* Form para Anunciar */}
        <div className="bg-[#16161a] p-6 rounded-xl border border-gray-800 shadow-xl space-y-4">
          <h2 className="text-lg font-semibold text-gray-200">Publicar Nova Oportunidade</h2>
          <form onSubmit={handleCriarOportunidade} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Título do Anúncio *</label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Procuro Baixista para banda de Rock"
                className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Instrumento Procurado *</label>
              <input
                type="text"
                required
                value={instrumento}
                onChange={(e) => setInstrumento(e.target.value)}
                placeholder="Ex: Baixo, Bateria, Vocalista"
                className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1">Cidade / Região *</label>
              <input
                type="text"
                required
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: Taubaté - SP"
                className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1">Descrição / Requisitos *</label>
              <textarea
                rows={3}
                required
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o estilo musical, disponibilidade para ensaios e detalhes do projeto..."
                className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="md:col-span-2 text-right">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition disabled:opacity-50"
              >
                {loading ? 'Publicando...' : '+ Anunciar Vaga'}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Vagas */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-200">Vagas Abertas na Comunidade</h2>
          {oportunidades.length === 0 ? (
            <div className="border border-dashed border-gray-800 rounded-xl p-8 text-center text-gray-500 text-sm">
              Nenhuma oportunidade publicada no momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {oportunidades.map((op) => (
                <Link
                  key={op.id_oportunidade}
                  href={`/dashboard/oportunidades/${op.id_oportunidade}`}
                  className="bg-[#16161a] hover:bg-[#1a1a20] border border-gray-800 hover:border-red-500/40 rounded-xl p-5 transition flex flex-col justify-between space-y-4 group shadow-lg"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition">{op.titulo}</h3>
                    </div>
                    <span className="inline-block bg-red-500/10 text-red-400 text-xs px-2.5 py-1 rounded font-medium border border-red-500/20">
                      Procura-se: {op.instrumento_procurado}
                    </span>
                    <p className="text-xs text-gray-400">📍 {op.cidade}</p>
                    <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">{op.descricao}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
                    <span>Anunciado por: <strong className="text-gray-200">{op.anunciante?.nome || 'Usuário'}</strong></span>
                    <span className="text-red-400 font-medium group-hover:translate-x-1 transition-transform">
                      Ver detalhes e contato →
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