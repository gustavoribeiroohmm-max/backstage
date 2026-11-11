'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Integrante {
  id_integrante?: number;
  nome: string;
  papel: string;
}

interface Banda {
  id_banda: number;
  nome_banda: string;
  descricao?: string;
  genero?: string;
  cidade?: string;
  id_criador?: number;
  integrantes?: Integrante[];
}

export default function DetalhesBandaPage() {
  const params = useParams();
  const router = useRouter();
  const idBanda = params.id;

  const [banda, setBanda] = useState<Banda | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  // Modo de Edição da Banda (Controla toda a edição da banda + integrantes)
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState('');
  const [genero, setGenero] = useState('');
  const [cidade, setCidade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Estados para Adicionar Integrante
  const [nomeIntegrante, setNomeIntegrante] = useState('');
  const [papelIntegrante, setPapelIntegrante] = useState('');

  // Estados para Edição de Integrante Especifico
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editNomeIntegrante, setEditNomeIntegrante] = useState('');
  const [editPapelIntegrante, setEditPapelIntegrante] = useState('');

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

    if (idBanda) {
      carregarDetalhes();
    }
  }, [idBanda]);

  async function carregarDetalhes() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/banda/${idBanda}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const b = Array.isArray(data) ? data[0] : data;
        setBanda(b);
        if (b) {
          setNome(b.nome_banda || '');
          setGenero(b.genero || '');
          setCidade(b.cidade || '');
          setDescricao(b.descricao || '');
        }
      } else {
        setBanda(null);
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes da banda:', err);
      setBanda(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSalvarEdicao(e: FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setSavingEdit(true);

    try {
      const res = await fetch(`/api/banda/${idBanda}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome_banda: nome,
          genero,
          cidade,
          descricao
        })
      });

      if (res.ok) {
        setIsEditing(false);
        setEditingIndex(null);
        await carregarDetalhes();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Erro ao atualizar banda: ${errData.message || res.statusText}`);
      }
    } catch (err) {
      console.error('Erro ao editar banda:', err);
      alert('Falha na conexão ao tentar editar.');
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDeletarBanda() {
    if (!confirm('Deseja realmente excluir esta banda?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/banda/${idBanda}?id_criador=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        router.push('/dashboard/bandas');
      } else {
        alert('Erro ao excluir banda.');
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Falha na conexão ao tentar excluir.');
    }
  }

  async function handleAdicionarIntegrante(e: FormEvent) {
    e.preventDefault();
    if (!nomeIntegrante || !papelIntegrante) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/banda/${idBanda}/integrante`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: nomeIntegrante,
          papel: papelIntegrante
        })
      });

      if (res.ok) {
        setNomeIntegrante('');
        setPapelIntegrante('');
        await carregarDetalhes();
      } else {
        // Fallback local
        setBanda((prev) => {
          if (!prev) return null;
          const novosIntegrantes = [...(prev.integrantes || []), { nome: nomeIntegrante, papel: papelIntegrante }];
          return { ...prev, integrantes: novosIntegrantes };
        });
        setNomeIntegrante('');
        setPapelIntegrante('');
      }
    } catch (err) {
      console.error('Erro ao adicionar integrante:', err);
    }
  }

  function iniciarEdicaoIntegrante(index: number, integrante: Integrante) {
    setEditingIndex(index);
    setEditNomeIntegrante(integrante.nome);
    setEditPapelIntegrante(integrante.papel);
  }

  async function handleSalvarIntegrante(index: number, idIntegrante?: number) {
    const token = localStorage.getItem('token');

    try {
      let res;
      if (idIntegrante) {
        res = await fetch(`/api/banda/${idBanda}/integrante/${idIntegrante}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            nome: editNomeIntegrante,
            papel: editPapelIntegrante
          })
        });
      }

      if (res && res.ok) {
        setEditingIndex(null);
        await carregarDetalhes();
      } else {
        setBanda((prev) => {
          if (!prev || !prev.integrantes) return prev;
          const atualizados = [...prev.integrantes];
          atualizados[index] = { ...atualizados[index], nome: editNomeIntegrante, papel: editPapelIntegrante };
          return { ...prev, integrantes: atualizados };
        });
        setEditingIndex(null);
      }
    } catch (err) {
      console.error('Erro ao editar integrante:', err);
    }
  }

  async function handleDeletarIntegrante(index: number, idIntegrante?: number) {
    if (!confirm('Deseja remover este integrante da banda?')) return;

    const token = localStorage.getItem('token');

    try {
      if (idIntegrante) {
        await fetch(`/api/banda/${idBanda}/integrante/${idIntegrante}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      setBanda((prev) => {
        if (!prev || !prev.integrantes) return prev;
        const filtrados = prev.integrantes.filter((_, i) => i !== index);
        return { ...prev, integrantes: filtrados };
      });
    } catch (err) {
      console.error('Erro ao remover integrante:', err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] text-gray-100 p-8 flex items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">Carregando detalhes da banda...</p>
      </div>
    );
  }

  if (!banda) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] text-gray-100 p-8 flex flex-col items-center justify-center space-y-4">
        <div className="bg-[#16161a] border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <span className="text-4xl">🔍</span>
          <h2 className="text-xl font-bold text-white">Banda não encontrada</h2>
          <p className="text-xs text-gray-400">
            Esta banda pode ter sido removida ou o link inserido é inválido.
          </p>
          <div className="pt-4">
            <Link 
              href="/dashboard/bandas" 
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition shadow-lg"
            >
              ← Voltar para Minhas Bandas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-gray-100 p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header e Ações */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <Link href="/dashboard/bandas" className="text-gray-400 hover:text-white text-sm transition">
            ← Voltar para Minhas Bandas
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setEditingIndex(null);
              }}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              {isEditing ? 'Concluir Edição' : '✏️ Editar Banda'}
            </button>
            <button
              onClick={handleDeletarBanda}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              🗑️ Excluir Banda
            </button>
          </div>
        </div>

        {/* Card Principal */}
        <div className="bg-[#16161a] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
          
          {isEditing ? (
            /* Formulário de Edição Inline da Banda */
            <form onSubmit={handleSalvarEdicao} className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Editar Informações da Banda</h2>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Nome da Banda *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Gênero Musical</label>
                  <input
                    type="text"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                    className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Descrição / Bio</label>
                <textarea
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg text-xs transition disabled:opacity-50"
                >
                  {savingEdit ? 'Salvando...' : 'Salvar Dados Gerais'}
                </button>
              </div>
            </form>
          ) : (
            /* Modo de Leitura Normal da Banda */
            <>
              <div className="space-y-3">
                {banda.genero && (
                  <span className="inline-block bg-red-500/10 text-red-400 text-xs px-3 py-1.5 rounded-full font-semibold border border-red-500/20">
                    {banda.genero}
                  </span>
                )}
                <h1 className="text-3xl font-extrabold text-white">{banda.nome_banda}</h1>
                {banda.cidade && <p className="text-xs text-gray-400">📍 {banda.cidade}</p>}
              </div>

              {banda.descricao && (
                <div className="space-y-2 border-t border-gray-800/80 pt-4">
                  <h3 className="text-sm font-semibold text-gray-300">Sobre a Banda:</h3>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{banda.descricao}</p>
                </div>
              )}
            </>
          )}

          {/* Seção de Integrantes */}
          <div className="space-y-4 border-t border-gray-800/80 pt-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              🥁 Integrantes da Banda
            </h3>

            {/* O Formulário de Adicionar Integrantes SÓ APARECE no modo de edição */}
            {isEditing && (
              <form onSubmit={handleAdicionarIntegrante} className="flex flex-col sm:flex-row gap-3 bg-[#0d0d0f] p-3 rounded-xl border border-gray-800">
                <input
                  type="text"
                  required
                  placeholder="Nome do integrante"
                  value={nomeIntegrante}
                  onChange={(e) => setNomeIntegrante(e.target.value)}
                  className="flex-1 bg-[#16161a] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-red-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Função (Ex: Guitarra, Vocal)"
                  value={papelIntegrante}
                  onChange={(e) => setPapelIntegrante(e.target.value)}
                  className="flex-1 bg-[#16161a] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition shrink-0"
                >
                  + Adicionar Integrante
                </button>
              </form>
            )}

            {/* Lista de Integrantes */}
            {(!banda.integrantes || banda.integrantes.length === 0) ? (
              <p className="text-xs text-gray-500 italic py-2">Nenhum integrante cadastrado ainda.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {banda.integrantes.map((item, idx) => (
                  <div key={idx} className="bg-[#0d0d0f] border border-gray-800 rounded-xl p-3.5 flex justify-between items-center">
                    {isEditing && editingIndex === idx ? (
                      /* Formulário Inline de Edição do Integrante (Modo de Edição) */
                      <div className="flex-1 flex flex-col gap-2">
                        <input
                          type="text"
                          value={editNomeIntegrante}
                          onChange={(e) => setEditNomeIntegrante(e.target.value)}
                          className="w-full bg-[#16161a] border border-gray-700 rounded p-1.5 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={editPapelIntegrante}
                          onChange={(e) => setEditPapelIntegrante(e.target.value)}
                          className="w-full bg-[#16161a] border border-gray-700 rounded p-1.5 text-xs text-white"
                        />
                        <div className="flex gap-2 justify-end mt-1">
                          <button
                            onClick={() => handleSalvarIntegrante(idx, item.id_integrante)}
                            className="bg-emerald-600 text-white text-xs px-3 py-1 rounded hover:bg-emerald-700 transition"
                          >
                            ✓ Salvar
                          </button>
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded hover:bg-gray-600 transition"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Exibição do Integrante */
                      <>
                        <div>
                          <p className="text-sm font-semibold text-white">{item.nome}</p>
                          <p className="text-xs text-red-400 font-medium">{item.papel}</p>
                        </div>

                        {/* Botões de Ação para cada integrante SÓ APARECEM quando a Banda está no modo de Edição */}
                        {isEditing && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => iniciarEdicaoIntegrante(idx, item)}
                              className="text-xs text-gray-400 hover:text-white transition p-1"
                              title="Editar integrante"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeletarIntegrante(idx, item.id_integrante)}
                              className="text-xs text-gray-400 hover:text-red-400 transition p-1"
                              title="Remover integrante"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}