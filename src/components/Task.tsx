import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { useDispatch } from 'react-redux';
import { addTask } from '../store/todoSlice';

interface TaskProps {
  task: {
    id: string;
    content: string;
    time: string;
    category: 'personal' | 'freelance' | 'work';
    completed: boolean;
    subtasks?: Array<{
      id: string;
      content: string;
      time: string;
      category: 'personal' | 'freelance' | 'work';
      completed: boolean;
      subtasks?: any[];
    }>;
  };
  onToggle: () => void;
  onDelete: () => void;
  level?: number;
}

const Task: React.FC<TaskProps> = ({ task, onToggle, onDelete, level = 0 }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [showAddSubtask, setShowAddSubtask] = useState(false);

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
    marginLeft: `${level * 24}px`,
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'bg-pink-400';
      case 'freelance': return 'bg-cyan-400';
      case 'work': return 'bg-yellow-400';
      default: return 'bg-gray-400';
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      dispatch(addTask({
        content: newSubtask,
        category: task.category,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        parentTaskId: task.id,
      }));
      setNewSubtask('');
      setShowAddSubtask(false);
      setIsExpanded(true);
    }
  };

  return (
    <div>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white rounded-2xl p-4 flex items-center gap-4 cursor-move mb-2"
      >
        {task.subtasks && task.subtasks.length > 0 && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
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
          onClick={() => setShowAddSubtask(!showAddSubtask)}
          className="text-gray-400 hover:text-purple-500 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {showAddSubtask && (
        <form onSubmit={handleAddSubtask} className="ml-12 mb-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Add a subtask..."
              className="flex-1 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-500"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {isExpanded && task.subtasks && task.subtasks.length > 0 && (
        <div className="ml-6">
          {task.subtasks.map((subtask) => (
            <Task
              key={subtask.id}
              task={subtask}
              onToggle={() => dispatch(toggleTask({ taskId: subtask.id, parentTaskId: task.id }))}
              onDelete={() => dispatch(deleteTask({ taskId: subtask.id, parentTaskId: task.id }))}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Task;