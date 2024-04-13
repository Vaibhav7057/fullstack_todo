import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const Addtodo = ({ setChanged, setShow, todoId, setTodoId, setErr }) => {
  const [todo, setTodo] = useState({});

  useEffect(() => {
    if (todoId) {
      axios
        .get(`/api/todos/getsingletodo/${todoId}`)
        .then((res) => {
          setTodo(res.data.data);
        })
        .catch((err) => setErr(err.message));
    }
  }, [todoId]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios({
        method: todoId ? "PUT" : "POST",
        url: `/api/todos/${todoId ? "edittodo/" + todoId : "createtodo"}`,
        data: todo,
      });
      console.log(res.data);
    } catch (error) {
      setErr(error.message);
    }
    setTodoId("");
    setTodo({});
    setChanged((pre) => !pre);
    setShow(false);
  }

  return (
    <div className="bg-white min-w-[400px] w-[30%] rounded-md p-7">
      <form onSubmit={handleSubmit} className="flex flex-col ">
        <input
          type="text"
          name="title"
          value={todo.title || ""}
          onChange={(e) =>
            setTodo((pre) => ({ ...pre, title: e.target.value }))
          }
          placeholder="title for your todo"
          className="w-full py-1 px-2 outline-none bg-red-100 rounded-md "
        />{" "}
        <br />
        <textarea
          placeholder="description to your todo"
          name="description"
          value={todo.description || ""}
          onChange={(e) =>
            setTodo((pre) => ({ ...pre, description: e.target.value }))
          }
          className="w-full py-1 px-2 outline-none bg-red-100 rounded-md "
        />
        <br />
        <label htmlFor="deadline">Deadline</label>
        <br />
        <input
          type="datetime-local"
          id="deadline"
          value={todo.deadline || ""}
          onChange={(e) =>
            setTodo((pre) => ({
              ...pre,
              deadline: e.target.value.toLocaleString("en-US"),
            }))
          }
        />
        <div className="flex gap-5 justify-end mt-2">
          <input
            type="button"
            name="cancelbtn"
            value="Cancel"
            onClick={() => {
              setShow(false);
              setTodoId("");
            }}
            className="px-3 py-1 hover:cursor-pointer  bg-red-700 rounded-md text-white font-medium text-md"
          />
          <input
            type="submit"
            name="submitbtn"
            value={`${todoId ? "Update Todo" : "Create Todo"}`}
            className="px-3 py-1 hover:cursor-pointer  bg-green-700 rounded-md text-white font-medium text-md"
          />
        </div>
      </form>
    </div>
  );
};

export default Addtodo;
