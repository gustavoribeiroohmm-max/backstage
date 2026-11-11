
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Ajuste o endpoint se no seu controller for /api/user ou /api/usuarios
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          senha: password, // Mantendo 'senha' para casar com o DTO do seu back-end
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao realizar cadastro.');
      }

      setSuccess('Conta criada com sucesso! Redirecionando para o login...');

      // Aguarda 1.5s para exibir a mensagem e redireciona para a página de login
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0f] px-4 py-8">
      <div className="w-full max-w-md bg-[#16161a] p-8 rounded-xl border border-gray-800 shadow-2xl">
        {/* Logo / Título */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white">
            ∏
          </div>
          <span className="text-2xl font-bold tracking-wide">Backstage</span>
        </div>

        <h2 className="text-xl font-semibold text-center mb-2 text-gray-200">
          Criar nova conta
        </h2>
        <p className="text-xs text-gray-400 text-center mb-6">
          Preencha os campos abaixo para cadastrar seu usuário
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded mb-4 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Seu nome"
              className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition mt-2 disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Conta →'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Já possui uma conta?{' '}
          <Link href="/login" className="text-red-500 hover:underline font-medium">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}