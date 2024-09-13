import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useInput from "./useInput";

function UserForm() {
  const [username, bindUsername, resetUsername, validateUsername] = useInput("");
  const [email, bindEmail, resetEmail, validateEmail] = useInput("");
  const [password, bindPassword, resetPassword, validatePassword] = useInput("");
  const [errorMessage, setError] = useState(null);

  const navigate = useNavigate();

  function handleLogIn() {
    console.log(username);
    localStorage.setItem("user", JSON.stringify({ username }));
    navigate("/app");
  }

  const [toggleSignUpLogin, setToggle] = useState(1);

  const handleClickSignUp = (e) => {
    setError(null);
    const header = document.querySelector("#login-or-signup-header");
    header.innerHTML = "Sign Up ";
    e.target.style.backgroundColor = "purple";
    e.target.style.color = "white";
    setToggle(1);
    const button = document.querySelector("#login-button");
    button.style.backgroundColor = "white";
    button.style.color = "gray";
  };

  const handleClickLogIn = (e) => {
    setError(null);
    const header = document.querySelector("#login-or-signup-header");
    header.innerHTML = "Log In ";
    e.target.style.backgroundColor = "purple";
    e.target.style.color = "white";
    setToggle(-1);
    const button = document.querySelector("#signup-button");
    button.style.backgroundColor = "white";
    button.style.color = "gray";
  };

  const submitLogIn = () => {
    fetch("http://localhost:5000/api1/login", {
      method: "post",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.log("Log in not ok");
          // If an error occurred, throw an error with the status text
          return res.json().then((errorData) => {
            throw new Error(errorData); // throw an error with the error message
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
        localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
        handleLogIn();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const submitSignUp = () => {
    fetch("http://localhost:5000/api1/signup", {
      method: "post",
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.log(res);
          return res.json().then((errorData) => {
            throw new Error(errorData); // throw an error with the error message
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
        localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
        handleLogIn();
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };

  const submitHandler = (e) => {
    setError(null);
    e.preventDefault();
    if (!validateUsername()) setError("Username empty");
    else if (!validateEmail() && toggleSignUpLogin === 1)
      setError("Email empty");
    else if (!validatePassword()) setError("Password empty");
    else {
      if (toggleSignUpLogin === -1) {
        submitLogIn();
      } else {
        submitSignUp();
      }
    }
    resetUsername();
    resetEmail();
    resetPassword();
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      navigate("/app");
    }
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="w-screen max-w-md bg-white p-8 rounded shadow-lg">
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <p id="login-or-signup-header" className="text-3xl">
              {toggleSignUpLogin === 1 ? "Sign Up" : "Log In"}
            </p>
            <br />
            <input
              type="text"
              {...bindUsername}
              className="w-full px-3 py-2 border rounded"
              placeholder="Username..."
            />
          </div>
          {toggleSignUpLogin === 1 && (
            <div>
              <input
                type="text"
                {...bindEmail}
                className="w-full px-3 py-2 border rounded"
                placeholder="Email..."
              />
            </div>
          )}
          <div>
            <input
              type="password"
              {...bindPassword}
              className="w-full px-3 py-2 border rounded"
              placeholder="Password..."
            />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <div className="flex items-center justify-between">
            <div id="login-or-signup-options">
              <button
                style={{
                  backgroundColor: toggleSignUpLogin === -1 ? "purple" : "white",
                  color: toggleSignUpLogin === -1 ? "white" : "gray",
                }}
                type="button"
                id="login-button"
                onClick={handleClickLogIn}
              >
                Login
              </button>
              <br></br>
              <button
                style={{
                  backgroundColor: toggleSignUpLogin === 1 ? "purple" : "white",
                  color: toggleSignUpLogin === 1 ? "white" : "gray",
                  
                }}
                type="button"
                
                onClick={handleClickSignUp}
              >
                Sign up
              </button>
            </div>
            <Link
              to="/reset-password"
              className="text-sm text-gray-500 hover:text-blue-600"
            >
              Forgot password? Reset it here.
            </Link>
          </div>
          <input
            type="submit"
            value={toggleSignUpLogin === 1 ? "Sign Up" : "Login"}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          />
        </form>
      </div>
    </div>
  );
}

export default UserForm;
