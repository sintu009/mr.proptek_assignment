import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PlusIcon, TrashIcon, PencilIcon } from 'lucide-react';
import { addTask, deleteList, renameList } from '../store/todoSlice';
import Task from './Task';

interface TodoListProps {
  id: string;
  name: string;
  tasks: Array<{ id: string; content: string; completed: boolean }>;
}

const TodoList: React.FC<TodoListProps> = ({ id, name, tasks }) => {
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [listName, setListName] = useState(name);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      dispatch(addTask({ listId: id, content: newTask }));
      setNewTask('');
    }
  };

  const handleRename = () => {
    if (listName.trim() && listName !== name) {
      dispatch(renameList({ id, name: listName }));
    }
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#1E293B] p-4 rounded-lg min-w-[300px] max-w-[400px]"
    >
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            onBlur={handleRename}
            onKeyPress={(e) => e.key === 'Enter' && handleRename()}
            className="bg-[#0F172A] text-white px-2 py-1 rounded"
            autoFocus
          />
        ) : (
          <h3 className="text-lg font-semibold text-white">{name}</h3>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 hover:bg-[#0F172A] rounded"
          >
            <PencilIcon className="h-4 w-4 text-gray-400" />
          </button>
          <button
            onClick={() => dispatch(deleteList({ id }))}
            className="p-1 hover:bg-[#0F172A] rounded"
          >
            <TrashIcon className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      <form onSubmit={handleAddTask} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="flex-1 bg-[#0F172A] text-white px-3 py-2 rounded"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {tasks.map((task) => (
          <Task
            key={task.id}
            listId={id}
            task={task}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList;