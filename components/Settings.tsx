import React, { useState } from 'react';
import type { AppSettings, Service } from '../types';
import { generateUniqueId } from '../utils/helpers';
import { PlusCircleIcon, TrashIcon } from './Icons';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings, onLogout }) => {
  const [newTag, setNewTag] = useState('');

  const handleServiceChange = (id: string, field: keyof Omit<Service, 'id'>, value: string) => {
    const newServices = settings.services.map(service => {
      if (service.id === id) {
        return { ...service, [field]: field === 'price' ? parseFloat(value) || 0 : value };
      }
      return service;
    });
    onUpdateSettings({ ...settings, services: newServices });
  };

  const addService = () => {
    const newService: Service = {
      id: generateUniqueId(),
      name: 'Novo Atendimento',
      price: 20.00,
    };
    onUpdateSettings({ ...settings, services: [...settings.services, newService] });
  };

  const removeService = (id: string) => {
    if (settings.services.length <= 1) {
      alert("É necessário ter pelo menos um tipo de atendimento.");
      return;
    }
    const newServices = settings.services.filter(service => service.id !== id);
    onUpdateSettings({ ...settings, services: newServices });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !settings.studentTags.includes(newTag.trim())) {
      onUpdateSettings({ ...settings, studentTags: [...settings.studentTags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateSettings({ ...settings, studentTags: settings.studentTags.filter(tag => tag !== tagToRemove) });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja apagar sua conta? Esta ação é irreversível e todos os seus dados serão perdidos.')) {
      // In a real app, this would be an API call to the backend.
      // Here, we simulate deletion by clearing localStorage and logging out.
      localStorage.clear();
      onLogout();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-brand-darkgray">Configurações</h2>
            <p className="text-brand-gray">Ajuste as configurações do sistema.</p>
        </div>
      
      <div className="bg-brand-white p-8 rounded-xl shadow-lg space-y-8">
        {/* Services Section */}
        <div>
          <h3 className="text-xl font-semibold text-brand-darkgray">
            Tipos de Atendimento
          </h3>
          <p className="text-sm text-brand-gray mb-4">
            Gerencie os serviços oferecidos e seus respectivos valores.
          </p>
          <div className="space-y-4">
            {settings.services.map(service => (
              <div key={service.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-4 border rounded-lg bg-gray-50">
                <div className="md:col-span-3">
                  <label htmlFor={`service-name-${service.id}`} className="text-xs font-medium text-gray-500">Nome do Atendimento</label>
                  <input
                    id={`service-name-${service.id}`}
                    type="text"
                    value={service.name}
                    onChange={e => handleServiceChange(service.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition"
                    placeholder="Ex: Pilates"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor={`service-price-${service.id}`} className="text-xs font-medium text-gray-500">Valor (R$)</label>
                  <input
                    id={`service-price-${service.id}`}
                    type="number"
                    value={service.price}
                    onChange={e => handleServiceChange(service.id, 'price', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition"
                    placeholder="0.00"
                    step="0.50"
                    min="0"
                  />
                </div>
                <div className="md:col-span-1 flex items-end justify-center h-full">
                  <button
                    onClick={() => removeService(service.id)}
                    disabled={settings.services.length <= 1}
                    className="w-full flex items-center justify-center space-x-2 text-sm text-red-600 hover:bg-red-100 font-medium py-2 px-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent"
                    title="Remover Atendimento"
                  >
                    <TrashIcon />
                    <span className="hidden md:inline">Remover</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={addService} 
            className="mt-6 w-full md:w-auto flex items-center justify-center space-x-2 text-sm text-primary-dark bg-primary-light hover:bg-blue-200 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <PlusCircleIcon />
            <span>Adicionar Atendimento</span>
          </button>
        </div>

        {/* Tags Section */}
        <div className="pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-brand-darkgray">Legendas de Alunos</h3>
          <p className="text-sm text-brand-gray mb-4">
            Crie e gerencie legendas para classificar seus alunos (ex: Estúdio, Wellhub, Gympass).
          </p>
          <div className="space-y-3 mb-4">
            {settings.studentTags.map(tag => (
              <div key={tag} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                  title={`Remover legenda "${tag}"`}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="Nova legenda"
              className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition"
            />
            <button
              onClick={handleAddTag}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 text-sm text-primary-dark bg-primary-light hover:bg-blue-200 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <PlusCircleIcon />
              <span>Adicionar</span>
            </button>
          </div>
        </div>
      </div>
       {/* Danger Zone */}
       <div className="mt-12 bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-red-800">Zona de Perigo</h3>
          <p className="text-sm text-red-700 mt-1 mb-4">
            Esta ação não pode ser desfeita. Isso excluirá permanentemente todos os seus dados de agendamento, despesas e configurações.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Apagar Conta
          </button>
        </div>
    </div>
  );
};

export default Settings;