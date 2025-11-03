// FIX: Implemented the Schedule view to manage daily appointments.
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { DailySchedule, Student, Service, TimeSlot } from '../types';
import TimeSlotCard from './TimeSlotCard';
import DateRangePicker from './Calendar';
import { SearchIcon } from './Icons';
import { generateUniqueId } from '../utils/helpers';
import { AttendanceStatus } from '../types';

interface ScheduleProps {
  currentDate: string;
  services: Service[];
  studentTags: string[];
}

const getDatesInRange = (start: string, end: string): string[] => {
    const dates = [];
    let currentDate = new Date(start + 'T00:00:00');
    const endDate = new Date(end + 'T00:00:00');
    
    if (currentDate > endDate) return [];

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
};

const Schedule: React.FC<ScheduleProps> = ({
  currentDate,
  services,
  studentTags,
}) => {
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [searchQuery, setSearchQuery] = useState('');
  const [rangedSchedule, setRangedSchedule] = useState<{ [date: string]: DailySchedule }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const dates = getDatesInRange(startDate, endDate);
    const newRangedSchedule: { [date: string]: DailySchedule } = {};
    
    dates.forEach(date => {
        try {
            const savedSchedule = localStorage.getItem(`pilaris_control_${date}_schedule`);
            if (savedSchedule) {
                newRangedSchedule[date] = JSON.parse(savedSchedule);
            }
        } catch (error) {
            console.error(`Error reading schedule for date ${date} from localStorage`, error);
        }
    });

    setRangedSchedule(newRangedSchedule);
    setIsLoading(false);
  }, [startDate, endDate]);

  const handleUpdate = useCallback((date: string, updatedDaySchedule: DailySchedule) => {
    const newRangedSchedule = { ...rangedSchedule, [date]: updatedDaySchedule };
    setRangedSchedule(newRangedSchedule);
    try {
        localStorage.setItem(`pilaris_control_${date}_schedule`, JSON.stringify(updatedDaySchedule));
    } catch (error) {
        console.error(`Error saving schedule for date ${date} to localStorage`, error);
    }
  }, [rangedSchedule]);

  const onUpdateStudent = (date: string, time: string, studentId: string, updatedStudent: Partial<Student>) => {
    const daySchedule = rangedSchedule[date] || [];
    const updatedDaySchedule = daySchedule.map(slot =>
      slot.time === time
        ? { ...slot, students: slot.students.map(s => s.id === studentId ? { ...s, ...updatedStudent } : s) }
        : slot
    );
    handleUpdate(date, updatedDaySchedule);
  };
  
  const onAddStudentSlot = (date: string, time: string) => {
    const daySchedule = rangedSchedule[date] || [];
    const updatedDaySchedule = daySchedule.map(slot =>
        slot.time === time
            ? { ...slot, students: [...slot.students, { id: generateUniqueId(), name: '', status: AttendanceStatus.Presente, tag: '', notes: '' }] }
            : slot
    );
    handleUpdate(date, updatedDaySchedule);
  };

  const onRemoveStudentSlot = (date: string, time: string, studentId: string) => {
    const daySchedule = rangedSchedule[date] || [];
    const updatedDaySchedule = daySchedule.map(slot =>
        slot.time === time
            ? { ...slot, students: slot.students.filter(s => s.id !== studentId) }
            : slot
    );
    handleUpdate(date, updatedDaySchedule);
  };

  const onUpdateTimeSlot = (date: string, time: string, updatedTimeSlot: Partial<TimeSlot>) => {
    const daySchedule = rangedSchedule[date] || [];
    const updatedDaySchedule = daySchedule.map(slot => slot.time === time ? { ...slot, ...updatedTimeSlot } : slot);
    handleUpdate(date, updatedDaySchedule);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) {
      return rangedSchedule;
    }
    
    const newFilteredData: { [date: string]: DailySchedule } = {};
    
    for (const date in rangedSchedule) {
      const dailySchedule = rangedSchedule[date];
      const filteredSlots = dailySchedule.filter(slot => 
        slot.students.some(student => 
          student.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      
      if (filteredSlots.length > 0) {
        newFilteredData[date] = filteredSlots;
      }
    }
    
    return newFilteredData;
  }, [searchQuery, rangedSchedule]);

  const filteredDates = Object.keys(filteredData);
  
  const formatDateHeader = (dateString: string) => {
      return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
      });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h2 className="text-3xl font-bold text-brand-darkgray">Agenda</h2>
            <p className="text-brand-gray">Gerencie os horários e alunos no período selecionado.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                  type="text"
                  placeholder="Buscar aluno..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition"
                  aria-label="Buscar aluno por nome"
              />
          </div>
          <DateRangePicker 
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>
      </div>
      
      {isLoading ? (
         <div className="text-center py-16 bg-brand-white rounded-xl shadow-lg">
            <p className="text-brand-gray text-lg">Carregando agendamentos...</p>
         </div>
      ) : filteredDates.length > 0 ? (
        <div className="space-y-12">
          {filteredDates.map(date => (
            <div key={date}>
              <h3 className="text-2xl font-bold text-brand-darkgray mb-4 pb-2 border-b-2 border-primary">{formatDateHeader(date)}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredData[date].map(timeSlot => (
                  <TimeSlotCard
                    key={timeSlot.time}
                    timeSlot={timeSlot}
                    services={services}
                    studentTags={studentTags}
                    onUpdateStudent={(time, studentId, updatedStudent) => onUpdateStudent(date, time, studentId, updatedStudent)}
                    onAddStudentSlot={(time) => onAddStudentSlot(date, time)}
                    onRemoveStudentSlot={(time, studentId) => onRemoveStudentSlot(date, time, studentId)}
                    onUpdateTimeSlot={(time, updatedTimeSlot) => onUpdateTimeSlot(date, time, updatedTimeSlot)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-brand-white rounded-xl shadow-lg">
          <p className="text-brand-gray text-lg">
            {searchQuery 
              ? `Nenhum aluno encontrado com o nome "${searchQuery}" no período selecionado.` 
              : 'Nenhum horário encontrado para o período selecionado.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Schedule;