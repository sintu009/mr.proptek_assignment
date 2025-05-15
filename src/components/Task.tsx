import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

interface TaskProps {
  task: {
    id: string;
    content: string;
    time: string;
    category: 'personal' | 'freelance' | 'work';
    completed: boolean;
  };
  onToggle: () => void;
  onDelete: () => void;
}

const Task: React.FC<TaskProps> = ({ task, onToggle, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'bg-pink-400';
      case 'freelance': return 'bg-cyan-400';
      case 'work': return 'bg-yellow-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-2xl p-4 flex items-center gap-4 cursor-move"
    >
      <span className={clsx('w-3 h-3 rounded-full', getCategoryColor(task.category))}></span>
      <span className={clsx('flex-1', task.completed && 'line-through text-gray-400')}>{task.content}</span>
      <span className="text-gray-500">{task.time}</span>
      <button
        onClick={onToggle}
        className={clsx(
          'w-8 h-8 rounded-full border-2',
          task.completed ? 'bg-purple-400 border-purple-400' : 'border-gray-300'
        )}
      >
        {task.completed && (
          <svg className="w-6 h-6 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Task;