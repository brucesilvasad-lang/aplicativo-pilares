// FIX: Implemented a simple date picker component for navigating between dates.
import React from 'react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 bg-brand-white p-2 rounded-lg shadow">
      <div className="flex items-center space-x-2">
        <label htmlFor="schedule-start-date" className="font-medium text-brand-darkgray text-sm">
          Início:
        </label>
        <input
          id="schedule-start-date"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition"
          aria-label="Data de início"
        />
      </div>
       <div className="flex items-center space-x-2">
        <label htmlFor="schedule-end-date" className="font-medium text-brand-darkgray text-sm">
          Fim:
        </label>
        <input
          id="schedule-end-date"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition"
          aria-label="Data de fim"
          min={startDate}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;