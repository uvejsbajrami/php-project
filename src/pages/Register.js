import React, { useEffect, useState } from "react";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SuccessAlert from "../components/Alert";

function Register() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const handleRegister = (e) => {
    e.preventDefault();
    const elements = e.target.elements;
    setUser({
      action: "register",
      name: elements["name"].value,
      discordUsername: elements["discordUsername"].value,
      email: elements["email"].value,
      password: elements["password"].value,
    });
    console.log(user);
  };

  useEffect(() => {
    if (user?.action) {
      axios
        .post("http://localhost/php-full-project/php-project/api/api.php", user)
        .then((response) => {
          if (response.data.status === 1) {
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
              navigate("/");
            }, 1200);
          }
        })
        .catch((error) => alert(error));
    }
  }, [user, navigate]);

  return (
    <>
      <div className="registerDivMain d-flex justify-content-center align-items-center vh-100 position-relative">
        <div className="position-absolute top-0 start-50 translate-middle-x mt-3">
          {" "}
          {showAlert && <SuccessAlert />}
        </div>

        <div className="container formContainerRegister">
          <form method="POST" onSubmit={handleRegister}>
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                <span style={{ color: "white" }}>Email address</span>
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
              <label for="exampleInputEmail1" className="form-label">
                <span style={{ color: "white" }}>Name and Surname</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                name="name"
              />
            </div>
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                <span style={{ color: "white" }}>Discord Username</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                name="discordUsername"
              />
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
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
              />
              <label className="form-check-label" for="exampleCheck1">
                <span style={{ color: "white" }}>Remember me</span>
              </label>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <Link to={"/"}>
              <p style={{ paddingBottom: "10px" }} className="mt-2 ">
                Already have an account?
              </p>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
