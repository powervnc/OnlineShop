import { useState } from "react";
import RepoUsers from "../Repository/RepoUsers";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Home(props) {
  const navigate = useNavigate();
  const [isServerOnline, setIsServerOnline] = useState(true);
  const [listUsers, setListUsers] = useState([]);
  const [role, setRole] = useState("");
  useEffect(() => {
    const checkServerStatus = () => {
      fetch("http://localhost:5000/api2/supply/health-check", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => {
          console.log("Health Check Response Status:", response.status);
          console.log(
            "Health Check Response Status Text:",
            response.statusText
          );

          if (!response.ok) {
            console.log("Server is offline or returned an error");
            setIsServerOnline(false);
          } else {
            console.log("Server is online");
            setIsServerOnline(true);
          }
        })
        .catch((error) => {
          console.error("Error connecting to the server:", error);
          setIsServerOnline(false);
        });
    };

    checkServerStatus();

    const interval = 200000; // Define the interval (in milliseconds)
    const intervalId = setInterval(checkServerStatus, interval);

    return () => clearInterval(intervalId);
  }, []);
  useEffect(()=>{
  const refreshTokenInterval = setInterval(() => {
    const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
    console.log(refreshToken);
    fetch("http://localhost:5000/api1/refreshToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refreshToken }),
    })
      .then((data) => {
        if(data.ok){
        return data.json();
      }
        else{
        console.log(data)
        return data.json().then((errorData) => {
          throw new Error(errorData.message); // throw an error with the error message
        })}
      }).then(data=>
        localStorage.setItem("accessToken",JSON.stringify(data.accessToken))
      )
      .catch((error) => {
        console.error("Error refreshing token:", error.message);
       // window.alert("The refresh token has expired! Please start a new session!");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      });
  }, 30000);//30 seconds

  return () => clearInterval(refreshTokenInterval);
}, []);



  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
      console.log(role);
      if (payload.role === "user" || payload.role == "moderator") {
        navigate("/");
      }
    } else {
      console.log("No access token found in local storage");
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api2/user/notAdminUsers", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization:
          "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Something went wrong when fetching moderators and users!"
          );
        }
        return response.json();
      })
      .then((data) => {
        setListUsers(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error.message);
        window.alert(error.message);
      });
  }, []);
  return (
    <>
      {!isServerOnline ? (
        <h1>Server dead lmao</h1>
      ) : (
        <>
          <h1>Users</h1>
          <RepoUsers listUsers={listUsers} setListUsers={setListUsers} />
        </>
      )}
    </>
  );
}

export default Home;
