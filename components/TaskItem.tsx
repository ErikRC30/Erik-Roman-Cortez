import React, { useState } from 'react';
import { Task } from '../types';
import { MailIcon, WhatsAppIcon, TrashIcon, PaperAirplaneIcon, XMarkIcon, CalendarIcon } from './Icons';

interface TaskItemProps {
  task: Task;
  onAddComment: (id: number, text: string) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

const priorityStyles: {
    [key in Task['priority']]: {
        badge: string;
        background: string;
        border: string;
        checkbox: string;
    }
} = {
    'Alta': {
        badge: 'bg-red-100 text-red-700',
        background: 'bg-red-50',
        border: 'border-red-200 hover:border-red-300',
        checkbox: 'text-red-600 focus:ring-red-500',
    },
    'Media': {
        badge: 'bg-amber-100 text-amber-700',
        background: 'bg-amber-50',
        border: 'border-amber-200 hover:border-amber-300',
        checkbox: 'text-amber-600 focus:ring-amber-500',
    },
    'Baja': {
        badge: 'bg-blue-100 text-blue-700',
        background: 'bg-blue-50',
        border: 'border-blue-200 hover:border-blue-300',
        checkbox: 'text-blue-600 focus:ring-blue-500',
    },
};


const PriorityBadge: React.FC<{ priority: Task['priority'] }> = ({ priority }) => {
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityStyles[priority].badge}`}>
            {priority}
        </span>
    );
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onAddComment, onDelete, onToggleComplete }) => {
  const { id, title, description, comments, priority, completed, deadline } = task;
  const [newComment, setNewComment] = useState('');
  const [isEmailInputVisible, setIsEmailInputVisible] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');

  const getDeadlineInfo = () => {
    if (!deadline) return null;

    const deadlineDate = new Date(deadline);
    const userTimezoneOffset = deadlineDate.getTimezoneOffset() * 60000;
    const localDate = new Date(deadlineDate.getTime() + userTimezoneOffset);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let statusClass = 'text-slate-500';
    let statusText = '';
    
    const isOverdue = localDate < today && !completed;
    
    if (isOverdue) {
        statusClass = 'text-red-600 font-semibold';
        statusText = 'Vencida';
    } else if (!completed) {
         const diffTime = localDate.getTime() - today.getTime();
         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

         if (diffDays === 0) {
             statusClass = 'text-amber-600 font-semibold';
             statusText = 'Vence Hoy';
         } else if (diffDays === 1) {
             statusClass = 'text-amber-600';
             statusText = 'Vence Mañana';
         }
    }

    const formattedDate = localDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return { formattedDate, statusClass, statusText };
  };

  const deadlineInfo = getDeadlineInfo();

  const handleSendEmail = () => {
    if (!emailRecipient.trim()) return;

    const subject = encodeURIComponent(`Recordatorio de Tarea: ${title}`);
    const body = encodeURIComponent(
      `Hola,\n\nEste es un recordatorio para la siguiente tarea:\n\nTítulo: ${title}\nPrioridad: ${priority}\n${deadline ? `Fecha Límite: ${deadlineInfo?.formattedDate}\n` : ''}Descripción: ${description}\n\nSaludos.`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailRecipient)}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
    setIsEmailInputVisible(false);
    setEmailRecipient('');
  };

  const handleWhatsAppReminder = () => {
    const message = encodeURIComponent(
      `*Recordatorio de Tarea:*\n\n*Título:* ${title}\n*Prioridad:* ${priority}\n${deadline ? `*Fecha Límite:* ${deadlineInfo?.formattedDate}\n` : ''}*Descripción:* ${description}`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(id, newComment.trim());
      setNewComment('');
    }
  };

  const currentPriorityStyles = priorityStyles[priority];

  return (
    <div className={`p-5 rounded-xl shadow-md border hover:shadow-lg transition-all duration-300 flex flex-col space-y-4 ${completed ? 'opacity-60 bg-slate-100 border-slate-200' : `${currentPriorityStyles.background} ${currentPriorityStyles.border}`}`}>
      <div className="flex justify-between items-start">
        <div className="flex-grow flex items-start gap-4">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => onToggleComplete(id)}
            className={`mt-1 h-5 w-5 rounded border-gray-300 cursor-pointer flex-shrink-0 ${currentPriorityStyles.checkbox}`}
            aria-labelledby={`task-title-${id}`}
          />
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
               <h3 id={`task-title-${id}`} className={`text-lg font-bold text-slate-800 ${completed ? 'line-through' : ''}`}>
                  {title}
               </h3>
               <PriorityBadge priority={priority} />
            </div>
            <p className={`text-slate-600 text-sm mb-2 ${completed ? 'line-through' : ''}`}>{description}</p>
            {deadlineInfo && (
              <div className="mt-2 flex items-center text-sm">
                <CalendarIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                <span className={deadlineInfo.statusClass}>
                  {/* FIX: Use deadlineInfo.statusText instead of statusText */}
                  {deadlineInfo.statusText ? `${deadlineInfo.statusText} el ${deadlineInfo.formattedDate}` : deadlineInfo.formattedDate}
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(id)}
          className="p-2 ml-4 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 transition-colors flex-shrink-0"
          aria-label="Eliminar tarea"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className={`border-t border-slate-200 pt-4 ${completed ? 'pointer-events-none' : ''}`}>
        <h4 className="text-sm font-semibold text-slate-600 mb-3">Comentarios</h4>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {comments.length > 0 ? (
                comments.map(comment => (
                    <div key={comment.id} className="bg-white/70 p-3 rounded-lg">
                        <p className="text-sm text-slate-800 break-words">{comment.text}</p>
                        <span className="text-xs text-slate-400 mt-1 block text-right">
                            {new Date(comment.createdAt).toLocaleString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                ))
            ) : (
                <p className="text-sm text-slate-400 italic">No hay comentarios todavía.</p>
            )}
        </div>
        <form onSubmit={handleAddComment} className="mt-4 flex items-start space-x-3">
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Añadir un comentario..."
                className="w-full p-2 bg-white rounded-md border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                rows={2}
                disabled={completed}
            />
            <button
                type="submit"
                className="flex-shrink-0 flex items-center justify-center h-10 w-10 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                disabled={!newComment.trim() || completed}
                aria-label="Añadir comentario"
            >
                <PaperAirplaneIcon className="w-5 h-5"/>
            </button>
        </form>
      </div>

      <div className={`border-t border-slate-200 pt-4 ${completed ? 'pointer-events-none' : ''}`}>
        <div className="flex items-center justify-end space-x-2">
          <span className="text-sm font-medium text-slate-500 mr-auto">Enviar recordatorio:</span>
          
          {!isEmailInputVisible ? (
            <>
              <button
                onClick={() => setIsEmailInputVisible(true)}
                className="flex items-center px-3 py-1.5 text-sm font-semibold text-slate-700 bg-white/70 rounded-md hover:bg-slate-200 transition-colors"
                aria-label="Enviar recordatorio por correo"
                disabled={completed}
              >
                <MailIcon className="w-5 h-5 mr-2 text-slate-500" />
                Correo
              </button>
              
              <button
                onClick={handleWhatsAppReminder}
                className="flex items-center px-3 py-1.5 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                aria-label="Enviar recordatorio por WhatsApp"
                disabled={completed}
              >
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                WhatsApp
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-3 w-full animate-fade-in">
              <div className="flex flex-col space-y-2">
                <input
                    type="email"
                    placeholder="Correo del destinatario..."
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    className="w-full p-2 bg-white rounded-md border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm h-10"
                    disabled={completed}
                />
              </div>
              <div className="flex items-center justify-end space-x-2">
                <button
                    onClick={handleSendEmail}
                    className="flex-shrink-0 flex items-center justify-center h-10 px-4 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
                    aria-label="Enviar correo"
                    disabled={!emailRecipient.trim() || completed}
                >
                    <PaperAirplaneIcon className="w-5 h-5"/>
                </button>
                <button
                    onClick={() => {
                      setIsEmailInputVisible(false);
                      setEmailRecipient('');
                    }}
                    className="flex-shrink-0 flex items-center justify-center h-10 w-10 bg-slate-100 text-slate-600 rounded-md font-semibold hover:bg-slate-200 transition-colors"
                    aria-label="Cancelar"
                    disabled={completed}
                >
                    <XMarkIcon className="w-5 h-5"/>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;