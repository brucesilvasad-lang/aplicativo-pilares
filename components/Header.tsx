import React from 'react';
import { DashboardIcon, ScheduleIcon, ExpensesIcon, ReportIcon, SettingsIcon, AccountingIcon, LogoutIcon } from './Icons';
import type { View } from '../types';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onLogout }) => {
  const navItems: { id: View; label: string, icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-5 h-5" /> },
    { id: 'schedule', label: 'Agenda', icon: <ScheduleIcon className="w-5 h-5" /> },
    { id: 'expenses', label: 'Despesas', icon: <ExpensesIcon className="w-5 h-5" /> },
    { id: 'report', label: 'Relatório', icon: <ReportIcon className="w-5 h-5" /> },
    { id: 'accounting', label: 'Contabilidade', icon: <AccountingIcon className="w-5 h-5" /> },
    { id: 'settings', label: 'Configurações', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  const getButtonClass = (view: View) => {
    const baseClass = "px-3 py-2 rounded-lg font-medium transition-colors text-sm flex items-center space-x-2";
    if (currentView === view) {
      return `${baseClass} bg-primary text-brand-white`;
    }
    return `${baseClass} text-brand-darkgray hover:bg-gray-200`;
  };

  return (
    <header className="bg-brand-white shadow-md mb-8">
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <h1 className="text-xl font-bold text-brand-darkgray">
                Pilaris<span className="text-primary">Control</span>
            </h1>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={getButtonClass(item.id)}
              title={item.label}
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
           <button
              onClick={onLogout}
              className="px-3 py-2 rounded-lg font-medium transition-colors text-sm flex items-center space-x-2 text-brand-darkgray hover:bg-red-100 hover:text-red-600"
              title="Sair"
            >
              <LogoutIcon className="w-5 h-5" />
              <span className="hidden md:inline">Sair</span>
            </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;