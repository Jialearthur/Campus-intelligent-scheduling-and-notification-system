import { useState, useEffect } from 'react';

const CalendarPicker = ({ selectedDates = [], onChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateSet, setSelectedDateSet] = useState(new Set(selectedDates));

  useEffect(() => {
    setSelectedDateSet(new Set(selectedDates));
  }, [selectedDates]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayOfWeek = firstDayOfMonth.getDay();

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day) => {
    const date = new Date(year, month, day);
    const dateStr = formatDate(date);
    const newSet = new Set(selectedDateSet);
    
    if (newSet.has(dateStr)) {
      newSet.delete(dateStr);
    } else {
      newSet.add(dateStr);
    }
    
    setSelectedDateSet(newSet);
    onChange && onChange(Array.from(newSet).sort());
  };

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

  const renderDays = () => {
    const days = [];
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square" />
      );
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(new Date(year, month, day));
      const isSelected = selectedDateSet.has(dateStr);
      const isToday = formatDate(new Date()) === dateStr;
      
      days.push(
        <div
          key={`day-${day}`}
          onClick={() => handleDateClick(day)}
          className={`aspect-square flex items-center justify-center rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium
            ${isSelected 
              ? 'bg-primary text-white shadow-md' 
              : isToday 
                ? 'bg-primary-light text-primary font-semibold' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-gray-800">
          {year}年 {monthNames[month]}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((name, index) => (
          <div
            key={`weekday-${index}`}
            className="aspect-square flex items-center justify-center text-xs font-semibold text-gray-400"
          >
            {name}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary" />
            <span>已选择</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary-light" />
            <span>今天</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPicker;
