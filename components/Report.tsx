// FIX: Implemented the Report view for a detailed daily summary.
import React from 'react';
import type { DailySchedule, Expense, Service } from '../types';
import { calculateTotalRevenue, calculateTotalExpenses, calculateNetProfit } from '../utils/calculations';
import { formatCurrency } from '../utils/helpers';
import { AttendanceStatus } from '../types';

interface ReportProps {
  currentDate: string;
  schedule: DailySchedule;
  expenses: Expense[];
  services: Service[];
}

const Report: React.FC<ReportProps> = ({ currentDate, schedule, expenses, services }) => {
  const totalRevenue = calculateTotalRevenue(schedule, services);
  const totalExpenses = calculateTotalExpenses(expenses);
  const netProfit = calculateNetProfit(totalRevenue, totalExpenses);

  const formattedDate = new Date(currentDate + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const getServiceName = (serviceId: string) => services.find(s => s.id === serviceId)?.name || 'N/A';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-brand-darkgray">Relatório do Dia</h2>
        <p className="text-brand-gray">Detalhes de atendimentos e finanças para {formattedDate}.</p>
      </div>

      <div className="bg-brand-white p-8 rounded-xl shadow-lg space-y-8">
        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-semibold">Receita Bruta</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-800 font-semibold">Despesas</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-semibold">Lucro Líquido</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(netProfit)}</p>
            </div>
        </div>

        {/* Attendance Details */}
        <div className="pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-brand-darkgray mb-4">Detalhes dos Atendimentos</h3>
          <div className="space-y-4">
            {schedule.map(slot => (
              <div key={slot.time} className="p-4 border rounded-lg">
                <h4 className="font-bold text-lg text-brand-blue">{slot.time} - {getServiceName(slot.serviceId)}</h4>
                <ul className="mt-2 divide-y">
                  {slot.students.filter(s => s.status !== AttendanceStatus.Vago).map(student => (
                    <li key={student.id} className="py-2 flex justify-between items-center">
                      <span className="text-brand-darkgray">{student.name} {student.tag && `(${student.tag})`}</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        student.status === AttendanceStatus.Presente ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses Details */}
        <div className="pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-brand-darkgray mb-4">Detalhes das Despesas</h3>
          {expenses.length > 0 ? (
            <ul className="divide-y">
              {expenses.map(expense => (
                <li key={expense.id} className="py-2 flex justify-between items-center">
                  <span className="text-brand-darkgray">{expense.description}</span>
                  <span className="font-semibold text-red-600">{formatCurrency(expense.amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brand-gray">Nenhuma despesa registrada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
