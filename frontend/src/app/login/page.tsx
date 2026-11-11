'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const mensagemErro = Array.isArray(data.message) 
          ? data.message.join(', ') 
          : data.message;
        throw new Error(mensagemErro || 'Falha ao realizar login');
      }

      // 1. Mapeia 'usuario' retornado pela API
      if (data.usuario) {
        localStorage.setItem('user', JSON.stringify(data.usuario));
      } else if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // 2. Mapeia 'access_token' retornado pelo JwtModule
      const token = data.access_token || data.token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        throw new Error('Token de autenticação não foi recebido do servidor.');
      }

      // Substitui a rota atual no histórico, impedindo o loop no botão "Voltar" do navegador
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar. Verifique e-mail e senha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0f] px-4">
      <div className="w-full max-w-md bg-[#16161a] p-8 rounded-xl border border-gray-800 shadow-2xl">
        
        {/* Logo / Título */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white">
            ∏
          </div>
          <span className="text-2xl font-bold tracking-wide">Backstage</span>
        </div>

        <h2 className="text-xl font-semibold text-center mb-6 text-gray-200">
          Entrar na sua conta
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              className="w-full bg-[#0d0d0f] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition mt-2 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar no Backstage →'}
          </button>
        </form>

        {/* Rodapé organizado com o link de retorno e o atalho para cadastro */}
        <div className="flex justify-between items-center text-xs text-gray-400 mt-6 pt-4 border-t border-gray-800">
          <Link href="/" className="hover:text-white transition flex items-center gap-1">
            ← Voltar para o início
          </Link>
          <Link href="/register" className="text-red-500 hover:underline font-medium">
            Criar conta
          </Link>
        </div>

      </div>
    </div>
  );
}