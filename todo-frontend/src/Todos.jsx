import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { todoSuccess } from "./reduxStore/Slices/todoSlice";
import { loginSuccess } from "./reduxStore/Slices/userSlice";
import Addtodo from "./components/Addtodo";
import { Link } from "react-router-dom";
import Profile from "./components/Profile";

const Todos = () => {
  const { todos, loading, todoError } = useSelector((state) => state.todo);
  const { user, isAuthenticated, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [todoId, setTodoId] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [changed, setChanged] = useState(false);
  const today = new Date().toLocaleDateString("en-us", {
    weekday: "long",
    // year: "numeric",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    axios
      .get("/api/user/loginwithtoken")
      .then((res) => dispatch(loginSuccess(res.data.data)))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    axios
      .get("/api/todos/getalltodos")
      .then((res) => {
        dispatch(todoSuccess(res.data.data));
        setFilteredTodos(res.data.data);
      })
      .catch((err) => console.log(err));
  }, [changed]);

  async function deleteTodo(id) {
    await axios
      .delete(`/api/todos/deletetodo/${id}`)
      .then((res) => {
        console.log(res);
        setChanged((pre) => !pre);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function editStatus(id, completed) {
    await axios
      .put(`/api/todos/editstatus/${id}`, { completed })
      .then((res) => {
        console.log(res);
        setChanged((pre) => !pre);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleSearch(key) {
    if (!key || key.length == 0) {
      setFilteredTodos(todos);
    } else {
      const result = todos.filter((todo) => todo.title.includes(key));
      setFilteredTodos(result);
      console.log(filteredTodos);
    }
  }

  return (
    <>
      <div className="w-[100vw] h-[100vh] bg-pink-400 py-2 px-5 relative ">
        <div className="w-full  py-3 bg-yellow-200 px-5 rounded-lg flex flex-col gap-2 ">
          <div className="flex justify-between px-24">
            <h3 className="font-bold text-[2.5vmax]">Todo List App</h3>{" "}
            <div className="flex font-medium text-lg items-center gap-2">
              <FaRegCalendarAlt /> <span>{today}</span>
            </div>{" "}
          </div>
          <div className="flex gap-10 justify-center">
            {" "}
            <div className="flex items-center rounded-lg bg-white  min-w-[250px] w-[60%] ">
              {" "}
              <input
                onInput={(e) => {
                  handleSearch(e.target.value);
                  setSearchKey(e.target.value);
                }}
                type="text"
                className="w-full rounded-lg py-2 px-5 outline-none "
              />{" "}
              <div
                className="text-2xl hover:cursor-pointer font-bold p-2 border border-l-slate-300 "
                onClick={() => handleSearch(searchKey)}
              >
                <IoSearch />
              </div>
            </div>{" "}
            <button
              onClick={() => setShow(true)}
              className="bg-green-300 px-4 py-2 rounded-lg "
            >
              Add New Todo
            </button>{" "}
            {isAuthenticated && <Profile />}
          </div>
        </div>
        {isAuthenticated ? (
          <div className="w-full py-3 px-2 bg-yellow-200 rounded-lg mt-2 overflow-auto">
            {filteredTodos.length === 0 && (
              <p className="text-center">
                there are no todos to show, create one !
              </p>
            )}
            {filteredTodos.length > 0 && (
              <Fragment>
                <table className="w-full">
                  <thead>
                    <tr className="grid grid-cols-12 border-b-2 border-slate-600 pb-2 ">
                      <th className=" col-span-0.5  ">Sr.no.</th>
                      <th className=" col-span-2  ">Title</th>
                      <th className=" col-span-3   ">Description</th>
                      <th className=" col-span-1.5   ">Created At</th>
                      <th className=" col-span-2   ">Deadline</th>
                      <th className=" col-span-1  ">Status</th>
                      <th className=" col-span-2   ">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTodos?.map((todo, i) => (
                      <tr
                        key={todo._id}
                        className="grid grid-cols-12 border-b-2 border-slate-600 py-1 "
                      >
                        <td className=" col-span-.5 place-self-center px-1 ">
                          {i + 1}
                        </td>
                        <td className=" col-span-2 place-self-center px-1 ">
                          {todo.title}
                        </td>
                        <td className=" col-span-3 place-self-center px-1  ">
                          {todo.description}
                        </td>
                        <td className=" col-span-1.5 place-self-center px-1 ">
                          {todo.createdAt}
                        </td>
                        <td className=" col-span-2 place-self-center px-1 mx-1 ">
                          {todo.deadline}
                        </td>
                        <td className=" col-span-1 place-self-center px-1 ">
                          {todo.completed ? "Completed" : "Pending"}{" "}
                          <input
                            type="checkbox"
                            defaultChecked={todo.completed}
                            name="status"
                            onClick={(e) => {
                              editStatus(todo._id, !todo.completed);
                            }}
                          />
                        </td>
                        <td className=" col-span-2 place-self-center px-1 ">
                          <button
                            disabled={todo.completed}
                            onClick={() => {
                              setShow(true);
                              setTodoId(todo._id);
                            }}
                            className={`px-3 py-1 ${
                              todo.completed ? "bg-[#38419D]" : "bg-green-700"
                            }  rounded-md text-white font-medium text-md`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              deleteTodo(todo._id);
                            }}
                            className="px-3 py-1  bg-red-700 rounded-md text-white font-medium text-md ml-1 "
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Fragment>
            )}
          </div>
        ) : (
          <div className="w-full py-3 px-2 bg-yellow-200 rounded-lg mt-2 overflow-auto text-center">
            <span>Login to use this App</span>{" "}
            <Link to="/auth" className="underline">
              Login Here
            </Link>
          </div>
        )}
        {show && (
          <div
            className={`absolute inset-0 bg-[#24212157] flex justify-center items-center backdrop-blur-sm min-w-full`}
          >
            <Addtodo
              setChanged={setChanged}
              setShow={setShow}
              todoId={todoId}
              setTodoId={setTodoId}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Todos;
