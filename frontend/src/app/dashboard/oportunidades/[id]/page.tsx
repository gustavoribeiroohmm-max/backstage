'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function DetalhesOportunidadePage() {
  const params = useParams();
  const router = useRouter();
  const idOportunidade = params.id;

  const [oportunidade, setOportunidade] = useState<Oportunidade | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserId(parsed.id_usuario || parsed.id);
      } catch (e) {
        console.error(e);
      }
    }

    if (idOportunidade) {
      carregarDetalhes();
    }
  }, [idOportunidade]);

  async function carregarDetalhes() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/oportunidade/${idOportunidade}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Trata caso venha array ou objeto direto
        setOportunidade(Array.isArray(data) ? data[0] : data);
      } else {
        setOportunidade(null);
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes da oportunidade:', err);
      setOportunidade(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletar() {
    if (!confirm('Deseja realmente remover esta oportunidade?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/oportunidade/${idOportunidade}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        router.push('/dashboard/oportunidades');
      } else {
        alert('Erro ao excluir oportunidade.');
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Falha na conexão ao tentar excluir.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] text-gray-100 p-8 flex items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">Carregando detalhes...</p>
      </div>
    );
  }

  // 🔴 404 Customizado: se a oportunidade não existir ou tiver sido apagada
  if (!oportunidade) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] text-gray-100 p-8 flex flex-col items-center justify-center space-y-4">
        <div className="bg-[#16161a] border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <span className="text-4xl">🔍</span>
          <h2 className="text-xl font-bold text-white">Oportunidade não encontrada</h2>
          <p className="text-xs text-gray-400">
            Este anúncio pode ter sido removido pelo criador ou o link está incorreto.
          </p>
          <div className="pt-4">
            <Link 
              href="/dashboard/oportunidades" 
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition shadow-lg"
            >
              ← Voltar para Oportunidades
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Define se o usuário atual é quem criou o anúncio
  const ehDonoDoAnuncio = userId === oportunidade.anunciante?.id_usuario;

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-gray-100 p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header e Voltar */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <Link href="/dashboard/oportunidades" className="text-gray-400 hover:text-white text-sm transition">
            ← Voltar às Oportunidades
          </Link>
          {ehDonoDoAnuncio && (
            <button
              onClick={handleDeletar}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              🗑️ Excluir meu anúncio
            </button>
          )}
        </div>

        {/* Card Principal da Oportunidade */}
        <div className="bg-[#16161a] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
          
          <div className="space-y-3">
            <span className="inline-block bg-red-500/10 text-red-400 text-xs px-3 py-1.5 rounded-full font-semibold border border-red-500/20">
              Procura-se: {oportunidade.instrumento_procurado}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">{oportunidade.titulo}</h1>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              📍 Localização: <strong className="text-gray-200">{oportunidade.cidade}</strong>
            </p>
          </div>

          <div className="space-y-2 border-t border-b border-gray-800/80 py-5">
            <h3 className="text-sm font-semibold text-gray-300">Descrição & Requisitos:</h3>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {oportunidade.descricao}
            </p>
          </div>

          {/* Seção do Anunciante e Ação por E-mail */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div>
              <p className="text-xs text-gray-400">Publicado por:</p>
              <p className="text-sm font-bold text-white">{oportunidade.anunciante?.nome || 'Usuário do Backstage'}</p>
            </div>

            {/* ✉️ Funcionalidade de Envio de E-mail Integrada */}
            {oportunidade.anunciante?.email ? (
              <a
                href={`mailto:${oportunidade.anunciante.email}?subject=Interesse na Oportunidade: ${encodeURIComponent(oportunidade.titulo)}&body=${encodeURIComponent(`Olá, ${oportunidade.anunciante.nome}!\n\nVi sua oportunidade "${oportunidade.titulo}" no Backstage e gostaria de conversar mais sobre a vaga.`)}`}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
              >
                ✉️ Demonstrar Interesse (Enviar E-mail)
              </a>
            ) : (
              <p className="text-xs text-gray-500 italic">E-mail de contato indisponível.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}