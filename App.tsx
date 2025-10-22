import React, { useState, useEffect, useMemo } from 'react';
import { Task, Priority, StatusFilter } from './types';
import Header from './components/Header';
import AddTaskForm from './components/AddTaskForm';
import TaskItem from './components/TaskItem';
import Filter from './components/Filter';
import { CheckCircleIcon } from './components/Icons';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [
        { id: 1, title: 'Diseñar UI de la App', description: 'Crear los mockups y el prototipo final en Figma.', comments: [], priority: 'Alta', completed: false, deadline: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0] },
        { id: 2, title: 'Desarrollar Frontend', description: 'Implementar la interfaz de usuario con React y Tailwind.', comments: [
          { id: 1, text: 'Revisar la paleta de colores.', createdAt: new Date(Date.now() - 86400000).toISOString() }
        ], priority: 'Alta', completed: false, deadline: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0] },
        { id: 3, title: 'Configurar Base de Datos', description: 'Diseñar el esquema y configurar la base de datos para las tareas.', comments: [], priority: 'Media', completed: false },
        { id: 4, title: 'Reunión de equipo', description: 'Revisar avances del sprint y planificar próximas tareas.', comments: [], priority: 'Baja', completed: true, deadline: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0] },
      ];
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
      return [];
    }
  });

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
    }
  }, [tasks]);

  const addTask = (title: string, description: string, priority: Priority, deadline?: string) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      comments: [],
      priority,
      completed: false,
      deadline: deadline || undefined,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };
  
  const addComment = (taskId: number, text: string) => {
    const newComment = {
      id: Date.now(),
      text,
      createdAt: new Date().toISOString(),
    };
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, comments: [...task.comments, newComment] }
        : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateTask = (id: number, updates: { title: string; description: string; priority: Priority; deadline?: string }) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const handleFilterChange = (type: 'status' | 'priority', value: StatusFilter | Priority | 'all') => {
    if (type === 'status') {
      setStatusFilter(value as StatusFilter);
    } else if (type === 'priority') {
      setPriorityFilter(value as Priority | 'all');
    }
  };
  
  const handleSearchChange = (query: string) => {
    setSearchTerm(query);
  };

  const filteredAndSortedTasks = useMemo(() => {
    const priorityOrder: { [key in Priority]: number } = { 'Alta': 1, 'Media': 2, 'Baja': 3 };

    const filtered = tasks.filter(task => {
        const statusMatch = 
            statusFilter === 'all' ||
            (statusFilter === 'completed' && task.completed) ||
            (statusFilter === 'pending' && !task.completed);
        
        const priorityMatch =
            priorityFilter === 'all' || task.priority === priorityFilter;
        
        const searchMatch = 
            !searchTerm ||
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase());

        return statusMatch && priorityMatch && searchMatch;
    });

    return [...filtered].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [tasks, statusFilter, priorityFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <AddTaskForm onAddTask={addTask} />
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Mis Actividades</h2>
          <Filter 
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            searchTerm={searchTerm}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
          />
          {tasks.length > 0 ? (
            filteredAndSortedTasks.length > 0 ? (
                <div className="space-y-4">
                  {filteredAndSortedTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onAddComment={addComment}
                      onDelete={deleteTask}
                      onToggleComplete={toggleTaskCompletion}
                      onUpdateTask={updateTask}
                    />
                  ))}
                </div>
            ) : (
                <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-600">No hay tareas que coincidan</h3>
                    <p className="text-slate-500 mt-2">Prueba a cambiar los filtros o el término de búsqueda.</p>
                </div>
            )
          ) : (
            <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-slate-200">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600">¡Todo al día!</h3>
                <p className="text-slate-500 mt-2">No tienes tareas pendientes. Añade una nueva para empezar.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;