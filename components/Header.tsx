import React from 'react';
import { TaskIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <TaskIcon className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Task Manager Pro</h1>
        </div>
        <span className="text-sm font-medium text-slate-500">Gestión Intuitiva de Tareas</span>
      </div>
    </header>
  );
};

export default Header;