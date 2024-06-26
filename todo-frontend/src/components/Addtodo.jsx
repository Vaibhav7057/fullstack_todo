import React, { useEffect, useRef } from "react";
import { useState } from "react";
import PrivatePath from "../auth/PrivatePath";
import ServiceLoder from "./ServiceLoder";
import toast from "react-hot-toast";

const Addtodo = ({ setChanged, setShow, todoId, setTodoId }) => {
  const [todo, setTodo] = useState({});
  const todoRef = useRef();
  const [loading, setLoading] = useState(false);
  const secureAxios = PrivatePath();

  useEffect(() => {
    if (todoId) {
      secureAxios
        .get(`/api/todos/getsingletodo/${todoId}`)
        .then((res) => {
          setTodo(res.data.todo);
        })
        .catch((error) => {
          const err = error.response?.data;
          if (!err) {
            toast.error(error.response.statusText);
          } else {
            toast.error(err.message);
          }
        });
    }
  }, [todoId]);

  useEffect(() => {
    const todoBoxHandler = (e) => {
      if (!todoRef.current.contains(e.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", todoBoxHandler);

    return () => {
      document.removeEventListener("mousedown", todoBoxHandler);
    };
  }, [setTodo]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    secureAxios({
      method: todoId ? "PUT" : "POST",
      url: `/api/todos/${todoId ? "edittodo/" + todoId : "createtodo"}`,
      data: todo,
    })
      .then((res) => {
        setLoading(false);
        setTodoId("");
        setTodo({});
        setChanged((pre) => !pre);
        toast.success(todoId ? "to do updated" : "new to do added");
        setShow(false);
      })
      .catch((error) => {
        const err = error.response?.data;
        if (!error.response) {
          toast.error("internal server error, sorry !");
        } else if (!err) {
          toast.error(error.response.statusText);
        } else {
          toast.error(err.message);
        }
      })
      .finally(() => setLoading(false));
  }

  return (
    <div
      ref={todoRef}
      className="controldiv max-h-80 text-sm pb-5 border border-1 border-slate-800 bg-slate-100 rounded-md px-4 py-6  mt-16 "
    >
      {loading ? (
        <ServiceLoder text={`${todoId ? "updating" : "adding"} your todo`} />
      ) : (
        ""
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={todo.title || ""}
          onChange={(e) =>
            setTodo((pre) => ({ ...pre, title: e.target.value }))
          }
          placeholder="title for your todo"
          className="bg-red-100 rounded-md px-2 py-1 mb-4 border border-1 border-slate-400 outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm"
          required
        />{" "}
        <br />
        <textarea
          placeholder="description to your todo"
          name="description"
          value={todo.description || ""}
          onChange={(e) =>
            setTodo((pre) => ({ ...pre, description: e.target.value }))
          }
          className=" bg-red-100 rounded-md px-2 py-1 mb-4 border border-1 border-slate-400 outline-none w-full placeholder:italic placeholder:text-slate-400 placeholder:text-sm "
        />
        <br />
        <label htmlFor="deadline" className="font-bold text-sm ">
          Deadline
        </label>
        <br />
        <input
          type="datetime-local"
          id="deadline"
          className="font-bold text-sm hover:cursor-pointer"
          value={todo.deadline || ""}
          onChange={(e) =>
            setTodo((pre) => ({
              ...pre,
              deadline: e.target.value.toLocaleString(undefined, {
                year: "numeric",
                weekday: "long",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }),
            }))
          }
        />
        <div className="flex gap-5 justify-end ">
          <input
            type="button"
            name="cancelbtn"
            value="Cancel"
            onClick={() => {
              setShow(false);
              setTodoId("");
            }}
            className="bg-red-700 rounded-md text-center w-full text-white text-sm font-medium my-4 py-2 hover:cursor-pointer "
          />
          <input
            type="submit"
            name="submitbtn"
            value={`${todoId ? "Update Todo" : "Create Todo"}`}
            className="bg-green-600 rounded-md text-center w-full text-white text-sm font-medium my-4 py-2 hover:cursor-pointer "
          />
        </div>
      </form>
    </div>
  );
};

export default Addtodo;
