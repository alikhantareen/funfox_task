import user from "../assets/user_avatar.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [authenticated, setauthenticated] = useState("");
  const [id, profileID] = useState("");
  function logout() {
    setauthenticated("");
    localStorage.clear();
    navigate("/");
  }
  useEffect(() => {
    const loggedInUser = localStorage.getItem("token");
    if (loggedInUser) {
      setauthenticated(loggedInUser);
      profileID(localStorage.getItem("user_id"));
    }
  }, [authenticated]);
  return (
    <nav>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link
            to={`/home/${localStorage.getItem("user_id")}`}
            className="btn btn-ghost font-bold normal-case text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-600"
          >
            FunFox
          </Link>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={user} />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {authenticated ? (
                <>
                  <li>
                    <Link to={`/home/${localStorage.getItem("user_id")}`}>
                      <p className="justify-between">Profile</p>
                    </Link>
                  </li>
                  <li>
                    <a onClick={logout}>Logout</a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to={"/"}>
                      <a>Login</a>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;