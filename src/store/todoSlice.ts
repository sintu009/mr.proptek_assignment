import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: string;
  content: string;
  time: string;
  category: 'personal' | 'freelance' | 'work';
  completed: boolean;
  subtasks?: Task[];
}

interface TodoList {
  id: string;
  name: string;
  tasks: Task[];
}

interface TodoState {
  lists: TodoList[];
  searchQuery: string;
  activeList: string | null;
}

const loadState = (): TodoState => {
  try {
    const serializedState = localStorage.getItem('todoState');
    if (serializedState === null) {
      return {
        lists: [
          {
            id: 'default',
            name: 'Today Tasks',
            tasks: [
              { 
                id: '1', 
                content: 'work out', 
                time: '8:00 am', 
                category: 'personal', 
                completed: true,
                subtasks: []
              },
              { 
                id: '2', 
                content: 'Design team meeting', 
                time: '2:00 pm', 
                category: 'freelance', 
                completed: false,
                subtasks: []
              },
            ],
          },
        ],
        searchQuery: '',
        activeList: 'default',
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { lists: [], searchQuery: '', activeList: null };
  }
};

const saveState = (state: TodoState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('todoState', serializedState);
  } catch (err) {
    // Handle errors here
  }
};

const initialState: TodoState = loadState();

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<{ content: string; category: 'personal' | 'freelance' | 'work'; time: string; parentTaskId?: string }>) => {
      const list = state.lists.find(list => list.id === state.activeList);
      if (list) {
        const newTask = {
          id: crypto.randomUUID(),
          ...action.payload,
          completed: false,
          subtasks: [],
        };

        if (action.payload.parentTaskId) {
          const findAndAddSubtask = (tasks: Task[]) => {
            for (let task of tasks) {
              if (task.id === action.payload.parentTaskId) {
                task.subtasks = task.subtasks || [];
                task.subtasks.push(newTask);
                return true;
              }
              if (task.subtasks && findAndAddSubtask(task.subtasks)) {
                return true;
              }
            }
            return false;
          };
          findAndAddSubtask(list.tasks);
        } else {
          list.tasks.push(newTask);
        }
        saveState(state);
      }
    },
    toggleTask: (state, action: PayloadAction<{ taskId: string; parentTaskId?: string }>) => {
      const list = state.lists.find(list => list.id === state.activeList);
      if (list) {
        const toggleTaskRecursive = (tasks: Task[]): boolean => {
          for (let task of tasks) {
            if (task.id === action.payload.taskId) {
              task.completed = !task.completed;
              return true;
            }
            if (task.subtasks && toggleTaskRecursive(task.subtasks)) {
              return true;
            }
          }
          return false;
        };
        toggleTaskRecursive(list.tasks);
        saveState(state);
      }
    },
    deleteTask: (state, action: PayloadAction<{ taskId: string; parentTaskId?: string }>) => {
      const list = state.lists.find(list => list.id === state.activeList);
      if (list) {
        const deleteTaskRecursive = (tasks: Task[]): boolean => {
          const taskIndex = tasks.findIndex(task => task.id === action.payload.taskId);
          if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            return true;
          }
          for (let task of tasks) {
            if (task.subtasks && deleteTaskRecursive(task.subtasks)) {
              return true;
            }
          }
          return false;
        };
        deleteTaskRecursive(list.tasks);
        saveState(state);
      }
    },
    reorderTasks: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
      const list = state.lists.find(list => list.id === state.activeList);
      if (list) {
        const [removed] = list.tasks.splice(action.payload.sourceIndex, 1);
        list.tasks.splice(action.payload.destinationIndex, 0, removed);
      }
      saveState(state);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  addTask,
  toggleTask,
  deleteTask,
  reorderTasks,
  setSearchQuery,
} = todoSlice.actions;

export default todoSlice.reducer;