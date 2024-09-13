
import { useNavigate, Navigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const handleLogout = () => {
    const refreshToken=localStorage.getItem("refreshToken");
    fetch("http://localhost:5000/api1/logout", {
      method: "POST",
      body: JSON.stringify({
        token: refreshToken,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      
      },
    })
      .then((res) => {
        console.log(res);
        if (!res.ok) {
          throw new Error("Logout failed");
        }
      })
      .then(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/");
      })
      .catch(() => {
        console.error("Logout error:");
      });
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }
 else  return (
    // <div style={{backgroundColor:'green',margin:10,paddingBottom:20,paddingLeft:20}}>
      // <h1>Welcome to the App!</h1>
      <>
      <button className="button-54" onClick={handleLogout}>Logout</button>
      <br></br>
      {/* Display user profile or application content here */}
     </>
  );
};

export default Logout;
