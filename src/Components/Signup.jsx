import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

const Signup = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = useRef(null);
  const user_name = useRef(null);
  const password = useRef(null);
  function signup() {
    if (
      !email.current.value ||
      !user_name.current.value ||
      !password.current.value
    ) {
      setError("Please fill out all the fields!");
      return;
    }
    fetch("http://localhost:5050/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.current.value, username: user_name.current.value ,password: password.current.value }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message !== "User created Successfully") {
          setError(data.message);
          return;
        }
        if (data.message === "User created Successfully") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", data.user.email);
          localStorage.setItem("user_id", data.user._id);
          localStorage.setItem("username", data.user.username);
          navigate(`/home/${localStorage.getItem("user_id")}`)
        }
      });
  }
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate(`/home/${localStorage.getItem("user_id")}`);
    }
  }, []);
  return (
    <>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-orange-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold">
                  Signup with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-600 font-bold">
                    FUNFOX
                  </span>
                </h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <p className="text-red-600 text-center">{error}</p>
                  <div className="relative">
                    <input
                      ref={email}
                      autocomplete="off"
                      id="email"
                      name="email"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Email address"
                    />
                    <label
                      for="email"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Email Address
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      ref={user_name}
                      autocomplete="off"
                      id="username"
                      name="text"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Username"
                    />
                    <label
                      for="username"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Username
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      ref={password}
                      autocomplete="off"
                      id="password"
                      name="password"
                      type="password"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Password"
                    />
                    <label
                      for="password"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <button onClick={signup} className="btn btn-primary w-full">
                      Sign up
                    </button>
                  </div>
                  <div>
                    <p>
                      Already have an account?{" "}
                      <Link to={`/`} className="underline">
                        Log in
                      </Link>{" "}
                      instead.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
