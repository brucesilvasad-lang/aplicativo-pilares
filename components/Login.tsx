import React, { useState } from 'react';
import type { User } from '../types';
import { GoogleIcon } from './Icons';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate credentials against a backend
    onLogin({ email: 'demo@pilates.com', name: 'Studio Admin' });
  };
  
  const renderForm = () => {
    switch (view) {
      case 'register':
        return (
          <>
            <h2 className="text-2xl font-bold text-center text-brand-darkgray">Criar Nova Conta</h2>
            <p className="text-center text-brand-gray mb-6">Comece a organizar seu estúdio hoje.</p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="register-name">Nome Completo</label>
                <input className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition" id="register-name" type="text" placeholder="Seu Nome" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="register-email">Email</label>
                <input className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition" id="register-email" type="email" placeholder="email@exemplo.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="register-password">Senha</label>
                <input className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition" id="register-password" type="password" placeholder="••••••••" required />
              </div>
              <button className="w-full bg-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-dark transition-colors" type="button" onClick={() => { alert('Conta criada com sucesso! (Simulação)'); setView('login'); }}>
                Criar Conta
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              Já tem uma conta? <button onClick={() => setView('login')} className="font-medium text-primary hover:underline">Faça o login</button>
            </p>
          </>
        );
      case 'forgot':
        return (
           <>
            <h2 className="text-2xl font-bold text-center text-brand-darkgray">Recuperar Senha</h2>
            <p className="text-center text-brand-gray mb-6">Insira seu email para enviarmos um link de recuperação.</p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="forgot-email">Email</label>
                <input className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition" id="forgot-email" type="email" placeholder="email@exemplo.com" required />
              </div>
              <button className="w-full bg-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-dark transition-colors" type="button" onClick={() => { alert('Link de recuperação enviado! (Simulação)'); setView('login'); }}>
                Enviar Link
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              Lembrou a senha? <button onClick={() => setView('login')} className="font-medium text-primary hover:underline">Voltar para o login</button>
            </p>
          </>
        );
      case 'login':
      default:
        return (
          <>
            <h2 className="text-2xl font-bold text-center text-brand-darkgray">Bem-vindo(a) de volta!</h2>
            <p className="text-center text-brand-gray mb-6">Faça o login para continuar.</p>
            <form className="space-y-4" onSubmit={handleDemoLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                <input className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition" id="email" type="email" placeholder="email@exemplo.com" defaultValue="demo@pilates.com" required />
              </div>
              <div>
                <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">Senha</label>
                    <button type="button" onClick={() => setView('forgot')} className="text-sm font-medium text-primary hover:underline">Esqueceu?</button>
                </div>
                <input className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition" id="password" type="password" placeholder="••••••••" defaultValue="demo" required />
              </div>
              <button className="w-full bg-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-dark transition-colors" type="submit">
                Entrar
              </button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">OU</span>
              </div>
            </div>
            <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors" onClick={handleDemoLogin}>
              <GoogleIcon className="w-5 h-5" />
              <span>Entrar com Google</span>
            </button>
            <p className="text-center text-sm text-gray-600 mt-6">
              Não tem uma conta? <button onClick={() => setView('register')} className="font-medium text-primary hover:underline">Crie uma agora</button>
            </p>
          </>
        );
    }
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-center items-center p-4">
       <div className="flex items-center space-x-2 mb-8">
            <svg className="w-10 h-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <h1 className="text-3xl font-bold text-brand-darkgray">
                Pilaris<span className="text-primary">Control</span>
            </h1>
        </div>
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        {renderForm()}
      </div>
    </div>
  );
};

export default Login;
