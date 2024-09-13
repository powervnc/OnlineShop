import User from "../User";

function RepoUsers(props) {
  const stateList = props.listUsers;
  const setList = props.setListUsers;

  function handleDelete(index) {
    fetch("http://localhost:5000/api2/user/deleteUser", {
      method: "DELETE",
      body: JSON.stringify({
        username: stateList[index].username,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization:
          "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong when deleting");
        }
        return response.json();
      })
      .then((data) => {
        setList(data);
      })
      .catch((error) => {
        console.error("Error:", error.message);
        window.alert(error.message);
      });
  }
  function handleRoleChange(index, newRole) {
    let roleFetch;
    if(newRole==2)roleFetch="Moderator"
    else roleFetch="User";
    fetch(`http://localhost:5000/api2/user/updateRoleTo${roleFetch}`, {
      method: "PATCH",
      body: JSON.stringify({
        username: stateList[index].username,
        idRole: newRole,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization:
          "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong when updating role");
        }
        return response.json();
      })
      .then((data) => {
        setList(data);
      })
      .catch((error) => {
        console.error("Error:", error.message);
        window.alert(error.message);
      });
  }

  return (
    <div className="body-container">
      {stateList.map((element, index) => (
        <div key={index} className="component-container">
          <User item={element}></User>
          <span style={{margin:"10px"}}>
          < button  style={{  color:"blue"}}  onClick={() => handleDelete(index)}>Delete</button>
          
          {element.nameRole === "User" && (
            <button className="button-55" style={{  color:"blue"}} onClick={() => handleRoleChange(index, 2)}>
              Become Moderator
            </button>
          )}
          &nbsp;&nbsp;&nbsp;
          {element.nameRole === "Moderator" && (
            <button className="button-55" style={{color:"blue"}} onClick={() => handleRoleChange(index, 3)}>
              Become User
            </button>
          )}
          </span>
        </div>
      ))}
    </div>
  );
}

export default RepoUsers;
