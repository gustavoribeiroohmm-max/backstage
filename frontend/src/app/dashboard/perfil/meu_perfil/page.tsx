'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditarPerfilPage() {
  const router = useRouter();

  const [nomeArtistico, setNomeArtistico] = useState('');
  const [instrumentos, setInstrumentos] = useState('');
  const [generos, setGeneros] = useState('');
  const [cidade, setCidade] = useState('');
  const [biografia, setBiografia] = useState('');

  const [nomeUsuarioPadrao, setNomeUsuarioPadrao] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.nome) {
          setNomeUsuarioPadrao(parsed.nome);
        }
      } catch (e) {
        console.error(e);
      }
    }
    carregarPerfilAtual();
  }, []);

  async function carregarPerfilAtual() {
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
        if (p) {
          setNomeArtistico(p.nome_artistico || '');
          setInstrumentos(p.instrumentos || '');
          setGeneros(p.generos || '');
          setCidade(p.cidade || '');
          setBiografia(p.biografia || '');
        }
      }
    } catch (err) {
      console.error('Erro ao carregar dados do perfil:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSalvarPerfil(e: FormEvent) {
    e.preventDefault();
    setMensagemErro('');
    setMensagemSucesso('');
    setSaving(true);

    const token = localStorage.getItem('token');
    const valorNomeArtistico = nomeArtistico.trim() !== '' ? nomeArtistico : nomeUsuarioPadrao;

    try {
      const res = await fetch('/api/perfil', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome_artistico: valorNomeArtistico,
          instrumentos,
          generos,
          cidade,
          biografia
        })
      });

      if (res.ok) {
        setMensagemSucesso('Perfil atualizado com sucesso!');
        setTimeout(() => {
          router.push('/dashboard/perfil');
        }, 1200);
      } else {
        const errData = await res.json().catch(() => ({}));
        const msg = Array.isArray(errData.message)
          ? errData.message.join(' | ')
          : errData.message || 'Erro ao salvar as alterações.';
        setMensagemErro(msg);
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
      setMensagemErro('Falha na conexão com o servidor.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] text-gray-100 p-8 flex items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">Carregando formulário...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-gray-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header e Cancelar */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition">
            ← Voltar ao Dashboard
          </Link>
          <Link
            href="/dashboard/perfil"
            className="bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-800/60 text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            ✕ Cancelar Edição
          </Link>
        </div>

        {/* Alertas */}
        {mensagemErro && (
          <div className="bg-red-950/30 border border-red-800/80 text-red-400 text-sm p-4 rounded-xl text-center">
            {mensagemErro}
          </div>
        )}
        {mensagemSucesso && (
          <div className="bg-emerald-950/30 border border-emerald-800/80 text-emerald-400 text-sm p-4 rounded-xl text-center">
            {mensagemSucesso}
          </div>
        )}

        {/* Card do Formulário */}
        <div className="bg-[#16161a] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
          <h1 className="text-xl font-extrabold text-white">Editar Perfil Profissional</h1>

          <form onSubmit={handleSalvarPerfil} className="space-y-4">
            
            {/* Campo Nome Artístico */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Nome Artístico *
              </label>
              <input
                type="text"
                value={nomeArtistico}
                onChange={(e) => setNomeArtistico(e.target.value)}
                placeholder={nomeUsuarioPadrao || "Ex: Vivi Ribeiro, DJ Vini"}
                className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-red-500"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Caso deixe em branco, será utilizado seu nome de cadastro ({nomeUsuarioPadrao || 'seu nome'}).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Instrumento Principal / Função
                </label>
                <input
                  type="text"
                  value={instrumentos}
                  onChange={(e) => setInstrumentos(e.target.value)}
                  placeholder="Ex: Baixo, Guitarra, Vocal"
                  className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Gênero Musical Preferido
                </label>
                <input
                  type="text"
                  value={generos}
                  onChange={(e) => setGeneros(e.target.value)}
                  placeholder="Ex: Rock, MPB, Metal"
                  className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Cidade / Estado
              </label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: Taubaté - SP"
                className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Biografia / Apresentação
              </label>
              <textarea
                rows={4}
                value={biografia}
                onChange={(e) => setBiografia(e.target.value)}
                placeholder="Conte um pouco sobre sua trajetória musical, influências e projetos..."
                className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-red-500 resize-y"
              />
            </div>

            {/* Ações */}
            <div className="flex justify-end gap-3 pt-4">
              <Link
                href="/dashboard/perfil"
                className="bg-[#21232d] hover:bg-[#2a2d3a] text-gray-300 font-medium px-5 py-2.5 rounded-lg text-sm transition flex items-center justify-center"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition disabled:opacity-50 shadow-lg"
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}