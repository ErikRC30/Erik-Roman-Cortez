import React from 'react';
import { Priority, StatusFilter } from '../types';
import { FilterIcon, SearchIcon } from './Icons';

interface FilterProps {
  statusFilter: StatusFilter;
  priorityFilter: Priority | 'all';
  searchTerm: string;
  onFilterChange: (type: 'status' | 'priority', value: StatusFilter | Priority | 'all') => void;
  onSearchChange: (query: string) => void;
}

const statusOptions: { label: string; value: StatusFilter }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Completadas', value: 'completed' },
];

const priorityOptions: { label: string; value: Priority | 'all' }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Alta', value: 'Alta' },
  { label: 'Media', value: 'Media' },
  { label: 'Baja', value: 'Baja' },
];

const Filter: React.FC<FilterProps> = ({ statusFilter, priorityFilter, searchTerm, onFilterChange, onSearchChange }) => {
  const getButtonClass = (isActive: boolean) =>
    `px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white shadow'
        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
    }`;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 animate-fade-in">
        <div className="flex items-center mb-4">
            <FilterIcon className="w-6 h-6 text-slate-500 mr-3" />
            <h3 className="text-lg font-bold text-slate-700">Filtrar y Buscar</h3>
        </div>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Por estado:</label>
              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                {statusOptions.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => onFilterChange('status', value)}
                    className={getButtonClass(statusFilter === value)}
                    aria-pressed={statusFilter === value}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Por prioridad:</label>
              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                {priorityOptions.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => onFilterChange('priority', value)}
                    className={getButtonClass(priorityFilter === value)}
                    aria-pressed={priorityFilter === value}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
        </div>
        <div className="border-t border-slate-200 pt-4">
             <label htmlFor="search" className="block text-sm font-medium text-slate-600 mb-2">Buscar por palabra clave:</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    id="search"
                    placeholder="Buscar por título o descripción..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 rounded-md border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
             </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;