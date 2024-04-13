import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { todoSuccess } from "./reduxStore/Slices/todoSlice";
import Addtodo from "./components/Addtodo";
import Profile from "./components/Profile";
import PrivatePath from "./auth/PrivatePath";
import { setUserDetails } from "./reduxStore/Slices/userSlice";

const Todos = () => {
  const { todos } = useSelector((state) => state.todo);
  const { userDetails } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const secureAxios = PrivatePath();
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
    secureAxios
      .get("/api/todos/getalltodos")
      .then((res) => {
        dispatch(todoSuccess(res.data.todos));
        setFilteredTodos(res.data.todos);
      })
      .catch((err) => console.log(err));
  }, [changed]);

  useEffect(() => {
    const getuserdetails = async () => {
      try {
        const res = await secureAxios.get("/api/user/me");
        if (res.data?.success) {
          dispatch(setUserDetails(res.data.user));
        }
      } catch (err) {
        if (!err.response) {
          console.log("no server response");
        } else {
          console.log(err.response?.data);
        }
      }
    };

    getuserdetails();
  }, [userDetails]);

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
      <div className="w-[100vw] min-h-[100vh] h-auto bg-[#747C92] py-2 px-5 relative text-black ">
        <div className="w-full  py-3 bg-[#BBE1C3] px-5 rounded-lg flex flex-col gap-2 ">
          <div className="flex justify-between px-24">
            <h3 className="font-bold text-[2.5vmax]">Todo List App</h3>
            {userDetails && (
              <div className="font-bold text-[1.5vmax]">
                <h3>Welcome,</h3>
                <h2>{userDetails?.fullName}</h2>
              </div>
            )}
            <div className="flex font-medium text-lg items-center gap-2">
              <FaRegCalendarAlt /> <span>{today}</span>
            </div>{" "}
          </div>
          <div className="flex gap-10 justify-end items-center">
            <div className="flex items-center rounded-lg py-0.5 px-2 bg-white  min-w-[250px] w-[100%] ">
              <input
                onInput={(e) => {
                  handleSearch(e.target.value);
                  setSearchKey(e.target.value);
                }}
                type="text"
                className="w-full rounded-lg outline-none text-xs "
              />
              <div
                className="text-xl hover:cursor-pointer font-bold border-l border-black pl-1 "
                onClick={() => handleSearch(searchKey)}
              >
                <IoSearch />
              </div>
            </div>
            <div
              onClick={() => setShow(true)}
              className="bg-[#D7BCE8] text-xs py-2 px-3 rounded-lg whitespace-nowrap hover:cursor-pointer "
            >
              Add New Todo
            </div>

            <Profile />
          </div>
        </div>

        <div className="w-full py-3 px-2 bg-[#E3DAFF] rounded-lg mt-2 overflow-auto">
          {!filteredTodos ? (
            <p className="text-center">
              there are no todos to show, create one !
            </p>
          ) : (
            <Fragment>
              <table className="w-full">
                <thead>
                  <tr className="grid grid-cols-12 border-b-2 border-slate-600 pb-2 text-xs ">
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
                      className="grid grid-cols-12 border-b-2 border-slate-600 py-1 text-xs "
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
                      <td className=" col-span-2 place-self-center px-1">
                        <button
                          disabled={todo.completed}
                          onClick={() => {
                            setShow(true);
                            setTodoId(todo._id);
                          }}
                          className={`px-3 py-1 ${
                            todo.completed ? "bg-[#38419D]" : "bg-green-700"
                          } place-self-center rounded-md text-white font-thin text-xs`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            deleteTodo(todo._id);
                          }}
                          className="px-3 py-1  bg-red-700 place-self-center rounded-md text-white font-thin text-xs ml-1 "
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

        {show && (
          <div
            className={`absolute inset-0 bg-[#24212157] flex justify-center items-center backdrop-blur-sm min-w-full`}
          >
            <Addtodo
              setChanged={setChanged}
              setShow={setShow}
              todoId={todoId}
              setTodoId={setTodoId}
              setErr={setErr}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Todos;
