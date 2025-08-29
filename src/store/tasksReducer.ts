import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState: [] as Task[],
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      return action.payload;
    },
    toggleComplete: (state, action: PayloadAction<{ taskId: string }>) => {
      const { taskId } = action.payload;
      const task = state.find((t) => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
      }
    },
    removeCompleted: (state, action: PayloadAction<Task[]>) => {
      return action.payload;
    },
  },
});

export const { setTasks, toggleComplete, removeCompleted } = tasksSlice.actions;
export default tasksSlice.reducer;
