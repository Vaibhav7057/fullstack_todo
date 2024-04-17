import React from "react";
import { useState, useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { todoSuccess } from "./reduxStore/Slices/todoSlice";
import Addtodo from "./components/Addtodo";
import Profile from "./components/Profile";
import PrivatePath from "./auth/PrivatePath";
import { setUserDetails } from "./reduxStore/Slices/userSlice";

const Todos = () => {
  const { todos } = useSelector((state) => state.todo);
  const { userDetails } = useSelector((state) => state.user);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const secureAxios = PrivatePath();
  const [show, setShow] = useState(false);
  const [todoId, setTodoId] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [changed, setChanged] = useState(false);
  const today = new Date().toLocaleDateString("en-us", {
    weekday: "long",
    // year: "numeric",
    month: "short",
    day: "numeric",
  });

  const getalltodos = () => {
    secureAxios
      .get(`/api/todos/getalltodos/?limit=10&skip=${currentPage * 10 - 10}`)
      .then((res) => {
        dispatch(todoSuccess(res.data.todos));
        let totalPages = Math.ceil(res.data.numberOfTodos / 10);
        let arrayOfPages = new Array(totalPages).fill(1);
        setPages(arrayOfPages);
      })
      .catch((err) => console.log(err));
  };

  const getsearchtodos = (key) => {
    secureAxios
      .get(
        `/api/todos/searchtodos/?searchkey=${key}&limit=10&skip=${
          currentPage * 10 - 10
        }`
      )
      .then((res) => {
        dispatch(todoSuccess(res.data.todos));
        let totalPages = Math.ceil(res.data.numberOfTodos / 10);
        let arrayOfPages = new Array(totalPages).fill(1);
        setPages(arrayOfPages);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (searchKey) {
      getsearchtodos(searchKey);
    } else {
      getalltodos();
    }
  }, [changed, currentPage, searchKey]);

  useEffect(() => {
    const getuserdetails = async () => {
      try {
        const res = await secureAxios.get("/api/user/me");
        dispatch(setUserDetails(res.data.user));
      } catch (err) {
        if (!err.response) {
          console.log("no server response");
        } else {
          console.log(err.response?.data);
        }
      }
    };

    getuserdetails();
  }, []);

  async function deleteTodo(id) {
    await secureAxios
      .delete(`/api/todos/deletetodo/${id}`)
      .then((res) => {
        console.log(res);
        setChanged((pre) => !pre);
      })
      .catch((err) => {
        if (!err.response) {
          console.log("no server response");
        } else {
          console.log(err.response?.data);
        }
      });
  }

  async function editStatus(id, completed) {
    await secureAxios
      .put(`/api/todos/editstatus/${id}`, { completed })
      .then((res) => {
        console.log(res);
        setChanged((pre) => !pre);
      })
      .catch((err) => {
        if (!err.response) {
          console.log("no server response");
        } else {
          console.log(err.response?.data);
        }
      });
  }

  const handleSearch = () => {
    if (searchKey) {
      getsearchtodos(searchKey);
    }
  };
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
            </div>
          </div>
          <div className="flex gap-10 justify-end items-center">
            <div className="flex items-center rounded-lg py-0.5 px-2 bg-white  min-w-[250px] w-[100%] ">
              <input
                onInput={(e) => {
                  setSearchKey(e.target.value);
                }}
                type="text"
                className="w-full rounded-lg outline-none text-xs "
              />
              <div
                className="text-xl hover:cursor-pointer font-bold border-l border-black pl-1 "
                onClick={handleSearch}
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

        <div className="w-full min-h-screen py-3 px-2 bg-[#E3DAFF] rounded-lg mt-2 overflow-auto">
          {!todos?.length && (
            <p className="text-center">
              there are no todos to show, create one !
            </p>
          )}
          {todos?.length > 0 && (
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
                {todos?.map((todo, i) => (
                  <tr
                    key={todo._id}
                    className={`grid grid-cols-12 border-b-2 border-slate-600 py-1 text-[15px]  ${
                      todo.completed ? "line-through" : ""
                    }`}
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
                      {new Date(todo.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}{" "}
                      <br />
                      {new Date(todo.createdAt).toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </td>
                    <td className=" col-span-2 place-self-center px-1 mx-1 ">
                      {todo.deadline &&
                        new Date(todo.deadline).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        })}{" "}
                      <br />
                      {todo.deadline &&
                        new Date(todo.deadline).toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                    </td>
                    <td className=" col-span-1 place-self-center px-1">
                      <input
                        type="checkbox"
                        defaultChecked={todo.completed}
                        name="status"
                        id={i + 1}
                        onClick={(e) => {
                          editStatus(todo._id, !todo.completed);
                        }}
                      />
                      <label htmlFor={i + 1}>
                        {todo.completed ? "Completed" : "Pending"}
                      </label>
                    </td>
                    <td className=" col-span-2 place-self-center text-center px-1">
                      <button
                        disabled={todo.completed}
                        onClick={() => {
                          setShow(true);
                          setTodoId(todo._id);
                        }}
                        className={`px-2 mt-0 py-1 ${
                          todo.completed ? "bg-[#38419D]" : "bg-green-700"
                        } place-self-center rounded-md text-white font-thin text-[13px]`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          deleteTodo(todo._id);
                        }}
                        className="px-2 mt-0 py-1  bg-red-700 place-self-center rounded-md text-white font-thin text-[13px] ml-1 "
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {todos?.length > 0 && (
            <ul className="flex justify-center items-center text-xs mt-6  bottom-0">
              <li
                className="px-1 py-0.5 border border-black hover:cursor-pointer"
                onClick={() => {
                  if (currentPage == 1) return;

                  setCurrentPage(currentPage - 1);
                }}
              >
                Previous
              </li>
              {pages.map((_, i) => (
                <li
                  key={i}
                  className={`px-1 py-0.5 border border-black ml-1 hover:cursor-pointer text-xs
                    ${currentPage == i + 1 ? "bg-slate-500 text-white" : ""}`}
                  onClick={() => {
                    setCurrentPage(i + 1);
                  }}
                >
                  {i + 1}
                </li>
              ))}
              <li
                className="px-1 py-0.5 border border-black ml-1 hover:cursor-pointer"
                onClick={() => {
                  if (currentPage == pages.length) return;

                  setCurrentPage(currentPage + 1);
                }}
              >
                Next
              </li>
            </ul>
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
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Todos;
