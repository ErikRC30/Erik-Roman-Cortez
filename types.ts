export type Priority = 'Baja' | 'Media' | 'Alta';

export type StatusFilter = 'all' | 'pending' | 'completed';

export interface Comment {
  id: number;
  text: string;
  createdAt: string; // ISO date string
}

export interface Task {
  id: number;
  title: string;
  description: string;
  comments: Comment[];
  priority: Priority;
  completed: boolean;
  deadline?: string; // YYYY-MM-DD date string
}
