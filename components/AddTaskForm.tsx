import React, { useState } from 'react';
import { PlusIcon } from './Icons';
import { Priority } from '../types';

interface AddTaskFormProps {
  onAddTask: (title: string, description: string, priority: Priority, deadline?: string, reminder?: string) => void;
}

const priorityClasses: { [key in Priority]: { labelChecked: string, radio: string } } = {
  Baja: {
    labelChecked: 'bg-blue-50 border-blue-400',
    radio: 'text-blue-600',
  },
  Media: {
    labelChecked: 'bg-amber-50 border-amber-400',
    radio: 'text-amber-600',
  },
  Alta: {
    labelChecked: 'bg-red-50 border-red-400',
    radio: 'text-red-600',
  },
};

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Media');
  const [deadline, setDeadline] = useState('');
  const [reminder, setReminder] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim(), description.trim(), priority, deadline, reminder);
      setTitle('');
      setDescription('');
      setPriority('Media');
      setDeadline('');
      setReminder('');
      setIsExpanded(false);
    }
  };

  const handleReminderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReminder(e.target.value);
    if (e.target.value && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 transition-all duration-300">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={isExpanded ? "Título de la tarea..." : "Añadir una nueva tarea..."}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="w-full text-lg font-medium p-2 border-b-2 border-slate-200 focus:border-indigo-500 outline-none transition-colors"
        />
        {isExpanded && (
          <div className="mt-4 animate-fade-in">
            <textarea
              placeholder="Añadir una descripción (opcional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mt-2 bg-slate-50 rounded-md border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              rows={3}
            ></textarea>

            <div className="mt-4">
                <label className="block text-sm font-medium text-slate-600 mb-2">Prioridad</label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    {(['Baja', 'Media', 'Alta'] as Priority[]).map((level) => (
                        <label key={level} className={`flex-1 flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-all ${priority === level ? priorityClasses[level].labelChecked : 'border-slate-200'}`}>
                            <input
                                type="radio"
                                name="priority"
                                value={level}
                                checked={priority === level}
                                onChange={() => setPriority(level)}
                                className={`form-radio h-5 w-5 transition duration-150 ease-in-out ${priorityClasses[level].radio}`}
                            />
                            <span className="font-medium text-slate-700">{level}</span>
                        </label>
                    ))}
                </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-slate-600 mb-2">Fecha Límite (Opcional)</label>
                    <input
                        type="date"
                        id="deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full p-2 bg-slate-50 rounded-md border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
                 <div>
                    <label htmlFor="reminder" className="block text-sm font-medium text-slate-600 mb-2">Recordatorio (Opcional)</label>
                    <input
                        type="datetime-local"
                        id="reminder"
                        value={reminder}
                        onChange={handleReminderChange}
                        className="w-full p-2 bg-slate-50 rounded-md border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        min={getMinDateTime()}
                    />
                </div>
            </div>

            <div className="flex justify-end items-center mt-4 space-x-3">
               <button 
                type="button" 
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 rounded-md text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
               >
                Cancelar
               </button>
               <button
                type="submit"
                className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                disabled={!title.trim()}
              >
                <PlusIcon className="w-5 h-5 mr-2"/>
                Añadir Tarea
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddTaskForm;
