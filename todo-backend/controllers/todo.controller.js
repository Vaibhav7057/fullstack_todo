import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Todo } from "../models/todo.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const addtodo = asyncHandler(async (req, res) => {
  const userid = req.user._id;
  const { title, description, deadline } = req.body;
  if (!title) return res.json(new ApiError(401, "title field is requied"));
  const existedTodo = await Todo.findOne({ title });

  if (existedTodo) {
    return res.json(
      new ApiError(409, `Todo with title '${title}' already exists`)
    );
  }

  const todo = await Todo.create({
    title,
    description,
    deadline,
  });
  if (!todo) return res.json(new ApiError(501, "internal server error"));

  const filledTodo = await Todo.findById(todo._id);
  todo.owner = userid;
  await todo.save();
  const updatedUser = await User.findById(req.user._id);
  updatedUser.todos.push(filledTodo._id);
  await updatedUser.save();
  return res
    .status(201)
    .json(new ApiResponse(201, "todo created successfully"));
});

const removetodo = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const deletedtodo = await Todo.findByIdAndDelete(id);
  if (!deletedtodo)
    return res.json(new ApiError(500, "Something went wrong in server"));
  const user = await User.findById(req.user._id);
  const index = user.todos.indexOf(id);
  user.todos.splice(index, 1);
  await user.save();

  return res.json(
    new ApiResponse(200, deletedtodo, "your todo was deleted successfully!")
  );
});

const findsingletodo = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const singleTodo = await Todo.findById(id).select("-deadline");

  return res.json(new ApiResponse(200, singleTodo, "here is your todo!"));
});

const findtodo = asyncHandler(async (req, res) => {
  const userid = req.user._id;
  const alltodos = await Todo.find({ owner: userid });
  if (!alltodos) {
    return res.status(404).json(new ApiError(404, "you are not a valid user"));
  }
  res.json(new ApiResponse(200, alltodos, "here are your todos!"));
});

const updatetodo = asyncHandler(async (req, res) => {
  const updatedtodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  if (!updatedtodo)
    return new ApiError(501, "Something went wrong while updating todo");
  res
    .status(200)
    .json(new ApiResponse(200, updatedtodo, "todo updated successfully"));
});

const updatetodostatus = asyncHandler(async (req, res) => {
  const { completed } = req.body;

  const updatedtodo = await Todo.findByIdAndUpdate(
    req.params.id,
    { completed },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  if (!updatedtodo)
    return new ApiError(501, "Something went wrong while updating todo");
  res
    .status(200)
    .json(
      new ApiResponse(200, updatedtodo, "todo status updated successfully")
    );
});

export {
  addtodo,
  removetodo,
  findtodo,
  findsingletodo,
  updatetodo,
  updatetodostatus,
};
