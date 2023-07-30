import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "./Header";

const Home = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showAlert, setAlert] = useState(false);
  const [selectValue, setSelectValue] = useState("pending");
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getGroup(id),
    refetchOnWindowFocus: false,
  });
  async function getGroup(id) {
    const res = await axios.get(`http://localhost:5050/home/${id}`);
    const data = await res.data;
    localStorage.setItem("group_id", data.group[0]._id);
    console.log(data);
    return data;
  }

  async function deleteTask(id) {
    const res = await axios.delete(`http://localhost:5050/task/${id}`);
    const data = await res.data;
    if (data) {
      setAlert((pre) => {
        return !pre;
      });
      refetch();
    }
  }

  function setDate(d) {
    let date = new Date(d);
    return date.toLocaleString();
  }

  async function changeStatus(id) {
    const status = {
      status: selectValue,
    };
    const res = await axios.put(
      `http://localhost:5050/updatestatus/${id}`,
      status
    );
    const data = await res.data;
    if (data) {
      setAlert((pre) => {
        return !pre;
      });
      refetch();
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate(`/`);
    }
  }, []);

  return (
    <>
      <Header />
      {isLoading ? (
        <div
          className="w-screen h-screen flex justify-center items-center"
          role="status"
        >
          <svg
            aria-hidden="true"
            class="w-32 h-32 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-orange-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      ) : (
        <main className="w-screen h-screen flex justify-center items-start p-4">
          <section className="w-full md:w-10/12 p-4 flex flex-col gap-6">
            <div className="w-full flex justify-between items-center">
              <p className="font-semibold text-2xl">{data.group[0].title}</p>
              <Link to={`/addtask`} className="btn btn-primary">
                Create a task
              </Link>
            </div>
            <div
              className={`${
                showAlert ? "w-full flex justify-center" : "hidden"
              }`}
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
                <div className="w-full flex justify-between">
                  <span>Action has been completed successfully!</span>
                  <span
                    onClick={() =>
                      setAlert((pre) => {
                        return !pre;
                      })
                    }
                    className="underline cursor-pointer"
                  >
                    close
                  </span>
                </div>
              </div>
            </div>
            {data.tasks.length === 0 ? (
              <p>0 tasks pending</p>
            ) : (
              data.tasks.map((elem) => {
                return (
                  <div className="collapse collapse-arrow bg-base-200">
                    <input
                      type="radio"
                      name="my-accordion-2"
                      checked="checked"
                    />
                    <div className="collapse-title text-2xl font-medium">
                      {elem.title}
                    </div>
                    <div className="collapse-content flex flex-col gap-3">
                      <p>
                        <span className="font-semibold">Description:</span>{" "}
                        {elem.description}
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span>{" "}
                        <select
                          onChange={(event) =>
                            setSelectValue(event.target.value)
                          }
                          className="select select-xs ml-2"
                        >
                          <option disabled selected value={elem.status}>{elem.status}</option>
                          <option value="pending">pending</option>
                          <option value="complete">complete</option>
                        </select>
                      </p>
                      <p></p>
                      <p>
                        <span className="font-semibold">Created by:</span>{" "}
                        {elem.username}
                      </p>
                      <p>
                        <span className="font-semibold">Created on:</span>{" "}
                        {setDate(elem.createdAt)}
                      </p>
                      <div className="mt-4 flex gap-4">
                        <button
                          onClick={() => deleteTask(elem._id)}
                          className="btn btn-warning"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => changeStatus(elem._id)}
                          className="btn btn-success"
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        </main>
      )}
    </>
  );
};

export default Home;
