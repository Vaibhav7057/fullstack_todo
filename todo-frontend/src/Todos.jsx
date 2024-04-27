import React from "react";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { todoSuccess } from "./reduxStore/Slices/todoSlice";
import Addtodo from "./components/Addtodo";
import Profile from "./components/Profile";
import PrivatePath from "./auth/PrivatePath";
import { setUserDetails } from "./reduxStore/Slices/userSlice";
import SearchFunction from "./components/SearchFunction";

const Todos = () => {
  const { todos } = useSelector((state) => state.todo);
  const popupRef = useRef();
  const { userDetails } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const secureAxios = PrivatePath();
  const [show, setShow] = useState(false);
  const [expandedTodo, setExpandedTodo] = useState(null);
  const [todoId, setTodoId] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const search = SearchFunction(setSearchKey, 500);
  const [changed, setChanged] = useState(false);
  const today = new Date().toLocaleDateString(undefined, {
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
        setIsLoading(false);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
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

  function expandtodo(event, todo) {
    event.stopPropagation();
    setExpandedTodo(todo);
  }

  useEffect(() => {
    if (searchKey) {
      getsearchtodos(searchKey);
    } else {
      getalltodos();
    }
  }, [changed, currentPage, searchKey]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getuserdetails = async () => {
      try {
        const res = await secureAxios.get("/api/user/me", {
          signal: controller.signal,
        });
        isMounted && dispatch(setUserDetails(res.data.user));
      } catch (err) {
        if (!err.response) {
          console.log("no server response");
        } else {
          console.log(err.response?.data);
        }
      }
    };

    getuserdetails();

    return () => {
      isMounted = false;
      controller.abort();
    };
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

  useEffect(() => {
    const popupHandler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setExpandedTodo(null);
      }
    };

    document.addEventListener("mousedown", popupHandler);

    return () => {
      document.removeEventListener("mousedown", popupHandler);
    };
  }, [setExpandedTodo]);

  const Loader = (
    <div className="flex justify-center items-center w-full h-full min-h-[70vh] bg-[#0e2a33]">
      <p className="text-white">...loading</p>
    </div>
  );

  return (
    <>
      <div className=" h-auto bg-[#747C92] py-2 px-2 md:px-5 relative text-black text-lg ">
        <div className="w-full  py-5 bg-[#BBE1C3] px-5 rounded-lg flex flex-col gap-2 ">
          <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-between items-center px-24">
            <h1 className="font-bold text-2xl sm:text-[2.5vmax]">
              Todo List App
            </h1>
            {userDetails && (
              <div className="text-sm font-display font-medium sm:text-[1.5vmax]">
                <h3 className="sm:mb-3">Welcome,</h3>
                <h3>{userDetails?.fullName}</h3>
              </div>
            )}
            <div className="hidden sm:flex font-medium text-lg items-center gap-2">
              <FaRegCalendarAlt /> <span>{today}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center sm:justify-between items-center text-lg">
            <div className="flex items-center rounded-lg py-0.5 px-2 bg-white  min-w-[300px] sm:w-[100%] ">
              <input
                onInput={(e) => {
                  search(e.target.value);
                }}
                placeholder="search your todos"
                type="text"
                className="w-full rounded-lg outline-none px-2 py-1 placeholder:italic placeholder:text-slate-400 placeholder:text-md"
              />
              <div
                className="text-xl hover:cursor-pointer font-bold border-l border-black pl-1 "
                onClick={handleSearch}
              >
                <IoSearch />
              </div>
            </div>
            <div className="flex items-center justify-between gap-8 md:gap-24 sm:ml-28 md:ml-32 sm:mr-20 mt-3 ">
              <div
                onClick={() => setShow(true)}
                className="bg-[#D7BCE8] py-2 px-3 rounded-lg whitespace-nowrap  hover:cursor-pointer mr-10 "
              >
                Add New Todo
              </div>
              <Profile />
            </div>
          </div>
        </div>
        {isLoading ? (
          Loader
        ) : (
          <div className=" min-h-[69vh] py-3 px-2 bg-[#E3DAFF] rounded-lg mt-2 overflow-auto ">
            {!todos?.length && (
              <p className="text-center">
                there are no todos to show, create one !
              </p>
            )}
            {todos?.length > 0 && (
              <table className="w-full">
                <thead>
                  <tr className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12  border-b-2 border-slate-600 pb-2 text-base sm:text-lg ">
                    <th className=" col-span-0.5  ">Sr.no.</th>
                    <th className=" col-span-2 ">Title</th>
                    <th className=" lg:col-span-3 hidden lg:block  ">
                      Description
                    </th>
                    <th className=" lg:col-span-1.5  hidden lg:block ">
                      Created At
                    </th>
                    <th className=" md:col-span-2 hidden md:block  ">
                      Deadline
                    </th>
                    <th className=" col-span-1  ">Status</th>
                    <th className=" col-span-2   ">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todos?.map((todo, i) => (
                    <tr
                      key={todo._id}
                      className={`grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 border-b-2 text-sm sm:text-lg border-slate-600 py-1 ${
                        todo.completed ? "line-through" : ""
                      }`}
                    >
                      <td className=" col-span-.5 place-self-center px-1 ">
                        {i + 1}
                      </td>
                      <td
                        className=" col-span-2 my-auto px-1"
                        onClick={(e) => expandtodo(e, todo)}
                      >
                        {todo.title}
                      </td>
                      <td className=" lg:col-span-3 hidden lg:block my-auto px-1  ">
                        {todo.description}
                      </td>
                      <td className=" lg:col-span-1.5  hidden lg:block place-self-center px-1 ">
                        {new Date(todo.createdAt).toLocaleString(undefined, {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        })}{" "}
                        <br />
                        {new Date(todo.createdAt).toLocaleString(undefined, {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </td>
                      <td className=" md:col-span-2 hidden md:block place-self-center px-1 mx-1 ">
                        {todo.deadline &&
                          new Date(todo.deadline).toLocaleString(undefined, {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          })}{" "}
                        <br />
                        {todo.deadline &&
                          new Date(todo.deadline).toLocaleString(undefined, {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}
                      </td>
                      <td className=" col-span-1 place-self-center px-1">
                        <input
                          type="checkbox"
                          defaultChecked={todo.completed}
                          className="w-3 h-3 sm:w-4 sm:h-4 mr-1 hover:cursor-pointer "
                          name="status"
                          id={i + 1}
                          onClick={(e) => {
                            editStatus(todo._id, !todo.completed);
                          }}
                        />
                        <label htmlFor={i + 1} className="hover:cursor-pointer">
                          {todo.completed ? "Done" : "Pending"}
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
                          } place-self-center rounded-md text-white font-thin text-sm sm:text-[13px]`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            deleteTodo(todo._id);
                          }}
                          className="px-2 mt-0 py-1  bg-red-700 place-self-center rounded-md text-white font-thin text-sm sm:text-[13px] ml-1 "
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {expandedTodo && (
                  <div className="fixed text-md top-0 left-0 w-full h-full flex lg:hidden justify-center items-center bg-transparent">
                    <div
                      className="w-[170px] sm:w-[230px] flex flex-col h-auto bg-white px-3 py-2 border border-slate-400 rounded-md "
                      ref={popupRef}
                    >
                      <button
                        onClick={() => {
                          setExpandedTodo(null);
                        }}
                        className="self-end text-red-700 text-sm sm:text-lg"
                      >
                        Close
                      </button>
                      <h4 className="text-sm sm:text-lg mb-1 font-bold ">
                        Title
                      </h4>
                      <p className="mb-1 text-sm sm:text-lg">
                        {expandedTodo.title}
                      </p>
                      <h4 className="text-sm sm:text-lg mb-1 font-bold ">
                        Description
                      </h4>
                      <p className="mb-1 text-sm sm:text-lg">
                        {expandedTodo.description}
                      </p>
                      <h4 className="text-sm sm:text-lg mb-1 font-bold ">
                        CreatedAt
                      </h4>
                      <p className="mb-1 text-sm sm:text-lg">
                        {expandedTodo.createdAt &&
                          new Date(expandedTodo.createdAt).toLocaleString(
                            undefined,
                            {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            }
                          )}{" "}
                        <span className="ml-3 text-slate-700 ">
                          {expandedTodo.createdAt &&
                            new Date(expandedTodo.createdAt).toLocaleString(
                              undefined,
                              {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              }
                            )}
                        </span>
                      </p>
                      <h4 className="text-sm sm:text-lg mb-1 font-bold ">
                        Deadline
                      </h4>
                      <p className="mb-1 text-sm sm:text-lg">
                        {expandedTodo.deadline &&
                          new Date(expandedTodo.deadline).toLocaleString(
                            undefined,
                            {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            }
                          )}
                        <span className="ml-3 text-slate-700 ">
                          {expandedTodo.deadline &&
                            new Date(expandedTodo.deadline).toLocaleString(
                              undefined,
                              {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              }
                            )}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </table>
            )}
            {todos?.length > 0 && (
              <ul className="flex justify-center items-center text-sm mt-6  bottom-0">
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
                    className={`px-1 py-0.5 border border-black ml-1 hover:cursor-pointer text-md
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
        )}

        {show && (
          <div
            className={`absolute inset-0 bg-[#24212157] flex justify-center  backdrop-blur-sm `}
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
