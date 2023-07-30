import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const AddTask = () => {
  const [error, setError] = useState("");
  const [showAlert, setAlert] = useState(false);
  const navigate = useNavigate();
  const title = useRef(null);
  const description = useRef(null);

  async function createTask() {
    if (!title.current.value || !description.current.value) {
      setError("Please fill all the fields!");
      return;
    }
    try {
      const url = "http://localhost:5050/createtask";
      const task_data = {
        user: localStorage.getItem("user_id"),
        group: localStorage.getItem("group_id"),
        username: localStorage.getItem("username"),
        status: "pending",
        title: title.current.value,
        description: description.current.value,
        token: localStorage.getItem("token"),
      };
      const response = await axios.post(url, task_data);
      const data = response.data;
      if (data.user) {
        setAlert(true);
        setTimeout(() => {
          navigate(`/home/${localStorage.getItem("user_id")}`);
        }, 2000);
      }
    } catch (error) {
      setError(error);
      return;
    }
  }
  useEffect(() => {
    if(!localStorage.getItem("token")) {
      navigate(`/`)
    }
  }, [])
  return (
    <>
      <Header />
      <main className="w-full p-8">
        <Link
          to={`/home/${localStorage.getItem("user_id")}`}
          className="text-sm pl-2 leading-none underline"
        >
          Back
        </Link>
        <div
          className={`${showAlert ? "w-full flex justify-center" : "hidden"}`}
        >
          <div className="alert alert-success w-1/3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Task has been created!</span>
          </div>
        </div>
        <div className="p-8 flex flex-col gap-4 rounded-md justify-center items-center">
          <div className="flex flex-col justify-center items-center gap-4 w-1/2">
            <p className="text-3xl font-semibold">Create a task</p>
            <p className="text-red-600 text-center">{error}</p>
            <input
              ref={title}
              id="title"
              type="text"
              placeholder="Enter title"
              className="input input-bordered input-primary w-full max-w-md"
            />
            <textarea
              ref={description}
              id="description"
              className="textarea textarea-primary w-full max-w-md"
              placeholder="Enter description"
              rows={5}
            ></textarea>
            <button
              onClick={createTask}
              type="submit"
              className="btn btn-primary w-full max-w-md"
            >
              {showAlert ? "Redirecting..." : "Create a task"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default AddTask;
