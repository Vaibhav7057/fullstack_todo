import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  todos: [],
  loading: false,
  todoError: null,
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    todoRequest: (state, action) => {
      state.loading = true;
    },
    todoSuccess: (state, action) => {
      state.todos = action.payload;
      state.loading = false;
    },
    todoFail: (state, action) => {
      state.loading = false;
      state.todos = [];
      state.todoError = action.payload;
    },
  },
});

export const { todoSuccess, todoFail } = todoSlice.actions;
export default todoSlice.reducer;
