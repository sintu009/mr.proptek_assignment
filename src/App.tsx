import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, FolderIcon, Settings, Plus, Search, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { addTask, toggleTask, deleteTask, setSearchQuery, reorderTasks, addList, setActiveList, deleteList } from './store/todoSlice';
import type { RootState } from './store/store';
import Task from './components/Task';

export default function App() {
  const dispatch = useDispatch();
  const { lists, activeList, searchQuery } = useSelector((state: RootState) => state.todo);
  const [newTask, setNewTask] = useState('');
  const [newListName, setNewListName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'personal' | 'freelance' | 'work'>('personal');
  const [showNewListInput, setShowNewListInput] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeListData = lists.find(list => list.id === activeList);
  const filteredTasks = activeListData?.tasks.filter(task => 
    task.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      dispatch(addTask({
        content: newTask,
        category: selectedCategory,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      setNewTask('');
    }
  };

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      dispatch(addList({ name: newListName }));
      setNewListName('');
      setShowNewListInput(false);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = filteredTasks.findIndex(task => task.id === active.id);
      const newIndex = filteredTasks.findIndex(task => task.id === over.id);
      
      dispatch(reorderTasks({ sourceIndex: oldIndex, destinationIndex: newIndex }));
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-72 border-r p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <img
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold">To Do</h2>
            <p className="text-purple-500">Hamza Mameri</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        <nav className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-lg font-medium mb-4">
              <div className="flex items-center gap-2">
                <FolderIcon className="w-5 h-5" />
                <span>Lists</span>
              </div>
              <button
                onClick={() => setShowNewListInput(!showNewListInput)}
                className="text-gray-400 hover:text-purple-500"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {showNewListInput && (
              <form onSubmit={handleAddList} className="mb-4">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="New list name..."
                  className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </form>
            )}
            <ul className="space-y-2">
              {lists.map(list => (
                <li
                  key={list.id}
                  className={clsx(
                    "flex items-center justify-between p-2 rounded-lg cursor-pointer",
                    activeList === list.id ? "bg-purple-100" : "hover:bg-gray-100"
                  )}
                  onClick={() => dispatch(setActiveList(list.id))}
                >
                  <span>{list.name}</span>
                  {lists.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deleteList({ id: list.id }));
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 text-lg font-medium mb-4">
              <FolderIcon className="w-5 h-5" />
              <span>Categories</span>
            </div>
            <ul className="space-y-2 pl-7">
              <li className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedCategory('personal')}>
                <span className="w-3 h-3 rounded-full bg-pink-400"></span>
                <span>Personal</span>
              </li>
              <li className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedCategory('freelance')}>
                <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                <span>Freelance</span>
              </li>
              <li className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedCategory('work')}>
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span>Work</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 text-lg font-medium">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-purple-400 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-white text-2xl mb-2">Today main focus</h1>
          <h2 className="text-white text-4xl font-bold mb-8">{activeListData?.name || 'Select a list'}</h2>

          <div className="space-y-4">
            {/* Task Input */}
            <form onSubmit={handleAddTask} className="bg-white rounded-2xl p-4 flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('personal')}
                  className={clsx('w-3 h-3 rounded-full bg-pink-400', selectedCategory === 'personal' && 'ring-2 ring-offset-2')}
                ></button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('freelance')}
                  className={clsx('w-3 h-3 rounded-full bg-cyan-400', selectedCategory === 'freelance' && 'ring-2 ring-offset-2')}
                ></button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('work')}
                  className={clsx('w-3 h-3 rounded-full bg-yellow-400', selectedCategory === 'work' && 'ring-2 ring-offset-2')}
                ></button>
              </div>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What is your task ?"
                className="flex-1 outline-none"
              />
              <div className="flex gap-4">
                <Clock className="w-5 h-5 text-gray-400" />
                <FolderIcon className="w-5 h-5 text-gray-400" />
              </div>
            </form>

            {/* Tasks List */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {filteredTasks.map(task => (
                    <Task
                      key={task.id}
                      task={task}
                      onToggle={() => dispatch(toggleTask({ taskId: task.id }))}
                      onDelete={() => dispatch(deleteTask({ taskId: task.id }))}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}