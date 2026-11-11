'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0d0d0f] text-gray-100 flex flex-col justify-between px-6 py-8">
      {/* Navbar Minimalista */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white">
            ∏
          </div>
          <span className="text-2xl font-bold tracking-wide">Backstage</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-300 hover:text-white transition"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            Cadastrar-se
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl w-full mx-auto text-center space-y-6 my-auto py-12">
        <div className="inline-block bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider mb-2">
          Plataforma para Músicos & Eventos
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          O palco dos seus projetos começa no <span className="text-red-600">Backstage</span>.
        </h1>

        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
          Conecte sua banda a novas oportunidades, gerencie dados de apresentações e mantenha seu perfil musical sempre atualizado.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3.5 rounded-lg transition text-center"
          >
            Criar Minha Conta →
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto bg-[#16161a] hover:bg-gray-800 border border-gray-800 text-gray-200 font-semibold px-8 py-3.5 rounded-lg transition text-center"
          >
            Já tenho conta
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-600 py-4 border-t border-gray-900">
        © {new Date().getFullYear()} Backstage. Todos os direitos reservados.
      </footer>
    </div>
  );
}