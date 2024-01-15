import React, { useEffect, useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "@uidotdev/usehooks";
import axios from "axios";

function UserLogin() {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [lsuser, saveUser] = useLocalStorage("user");

  const handleLogin = (e) => {
    e.preventDefault();
    if (e && e.target) {
      const elements = e.target.elements;
      setData({
        action: "login",
        email: elements["email"].value,
        password: elements["password"].value,
      });
    }
  };

  useEffect(() => {
    if (lsuser?.id) navigate("/discord");
  }, []);

  useEffect(() => {
    if (data?.action) {
      axios
        .post("http://localhost/php-full-project/php-project/api/api.php", data)
        .then((response) => {
          if (response.data.status === 1) {
            saveUser(response.data);
            console.log(response.data);
            navigate("/discord");
          }
        })
        .catch((error) => alert(error));
    }
  }, [data]);

  return (
    <div className="loginDiv">
      <div className="container formContainer">
        <form method="POST" onSubmit={handleLogin}>
          <div className="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              <span style={{ color: "white" }}>Email address</span>s
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              name="email"
            />
            <div id="emailHelp" className="form-text">
              <span style={{ color: "white" }}>
                We'll never share your email with anyone else.
              </span>
            </div>
          </div>
          <div className="mb-3">
            <label for="exampleInputPassword1" className="form-label">
              <span style={{ color: "white" }}>Password</span>
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              name="password"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>

          <p style={{ paddingBottom: "10px" }} className="mt-2">
            <span style={{ color: "#585c63" }}>Need an account?</span>{" "}
            <Link to={"/register"}>Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;
