import React, { useState, useEffect } from 'react';
import type { Service, YearlySummary, DailySchedule, Expense } from '../types';
import { calculateYearlySummary, ESTIMATED_TAX_RATE } from '../utils/calculations';
import { formatCurrency } from '../utils/helpers';
import { AccountingIcon, ChevronLeftIcon, ChevronRightIcon, RevenueIcon, ProfitIcon, ExpensesIcon } from './Icons';

interface AccountingProps {
  services: Service[];
  getAnnualData: (year: number) => {
    allSchedules: { [date: string]: DailySchedule };
    allExpenses: { [date: string]: Expense[] };
  };
}

const Accounting: React.FC<AccountingProps> = ({ services, getAnnualData }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState<YearlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const { allSchedules, allExpenses } = getAnnualData(selectedYear);
    const calculatedSummary = calculateYearlySummary(allSchedules, allExpenses, services);
    setSummary(calculatedSummary);
    setIsLoading(false);
  }, [selectedYear, getAnnualData, services]);

  const StatCard: React.FC<{ title: string; value: string; description: string; icon: React.ReactNode }> = ({ title, value, description, icon }) => (
    <div className="bg-brand-white p-6 rounded-xl shadow-lg flex flex-col justify-between h-full">
        <div>
            <div className="flex items-start space-x-4 mb-2">
                <div className="text-3xl text-primary pt-1">{icon}</div>
                <div>
                    <p className="text-base font-semibold text-brand-gray">{title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-brand-darkgray">{value}</p>
                </div>
            </div>
        </div>
        <p className="text-sm text-brand-gray mt-4">{description}</p>
    </div>
  );
  
  const handleYearChange = (increment: number) => {
    setSelectedYear(prev => prev + increment);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-darkgray">Resumo Anual (Contabilidade)</h2>
          <p className="text-brand-gray">Visão geral das finanças do ano selecionado.</p>
        </div>
        <div className="flex items-center space-x-2 bg-brand-white p-2 rounded-lg shadow">
          <button onClick={() => handleYearChange(-1)} className="p-2 rounded-md hover:bg-gray-200 transition" aria-label="Ano anterior">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <span className="font-bold text-xl text-primary-dark w-24 text-center">{selectedYear}</span>
          <button onClick={() => handleYearChange(1)} className="p-2 rounded-md hover:bg-gray-200 transition" aria-label="Próximo ano">
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <p className="text-center text-brand-gray">Calculando resumo anual...</p>
      ) : summary ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <StatCard 
                title="Ganho Bruto Anual" 
                value={formatCurrency(summary.totalRevenue)}
                description="Soma de todos os valores recebidos de atendimentos durante o ano."
                icon={<RevenueIcon />}
            />
             <StatCard 
                title="Despesas Anuais" 
                value={formatCurrency(summary.totalExpenses)}
                description="Soma de todos os gastos e despesas registrados durante o ano."
                icon={<ExpensesIcon className="w-6 h-6" />}
            />
             <StatCard 
                title="Lucro Líquido Anual" 
                value={formatCurrency(summary.netProfit)}
                description="O resultado final após subtrair todas as despesas dos ganhos."
                icon={<ProfitIcon />}
            />
             <StatCard 
                title="Imposto Bruto Estimado" 
                value={formatCurrency(summary.estimatedTax)}
                description={`Cálculo simplificado baseado em ${ESTIMATED_TAX_RATE * 100}% sobre o Ganho Bruto. Consulte um contador.`}
                icon={<AccountingIcon className="w-6 h-6" />}
            />
         </div>
      ) : (
        <p>Ocorreu um erro ao calcular os dados.</p>
      )}

      <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg">
        <h4 className="font-bold">Aviso Importante</h4>
        <p className="text-sm">Os valores apresentados, especialmente a estimativa de imposto, são baseados em um cálculo simplificado e servem apenas para referência. Este sistema não substitui a orientação de um profissional de contabilidade.</p>
      </div>
    </div>
  );
};

export default Accounting;