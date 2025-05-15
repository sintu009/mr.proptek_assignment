import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: string;
  content: string;
  time: string;
  category: 'personal' | 'freelance' | 'work';
  completed: boolean;
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
              { id: '1', content: 'work out', time: '8:00 am', category: 'personal', completed: true },
              { id: '2', content: 'Design team meeting', time: '2:00 am', category: 'freelance', completed: false },
              { id: '3', content: 'Hand off the project', time: '7:00 am', category: 'work', completed: false },
              { id: '4', content: 'Hand off the project', time: '7:00 am', category: 'freelance', completed: false },
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
    addList: (state, action: PayloadAction<{ name: string }>) => {
      state.lists.push({
        id: crypto.randomUUID(),
        name: action.payload.name,
        tasks: [],
      });
      saveState(state);
    },
    setActiveList: (state, action: PayloadAction<string>) => {
      state.activeList = action.payload;
    },
    addTask: (state, action: PayloadAction<{ content: string; category: 'personal' | 'freelance' | 'work'; time: string }>) => {
      const list = state.lists.find(list => list.id === state.activeList);
      if (list) {
        list.tasks.push({
          id: crypto.randomUUID(),
          ...action.payload,
          completed: false,
        });
      }
      saveState(state);
    },
    toggleTask: (state, action: PayloadAction<{ taskId: string }>) => {
      const list = state.lists.find(list => list.id === state.activeList);
      if (list) {
        const task = list.tasks.find(task => task.id === action.payload.taskId);
        if (task) {
          task.completed = !task.completed;
        }
      }
      saveState(state);
    },
    deleteTask: (state, action: PayloadAction<{ taskId: string }>) => {
      const list = state.lists.find(list => list.id === state.activeList);
      if (list) {
        list.tasks = list.tasks.filter(task => task.id !== action.payload.taskId);
      }
      saveState(state);
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
  addList,
  setActiveList,
  addTask,
  toggleTask,
  deleteTask,
  reorderTasks,
  setSearchQuery,
} = todoSlice.actions;

export default todoSlice.reducer;