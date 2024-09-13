import { useState } from "react";
import Repo from "../Repository/Repo";
import Popup from "reactjs-popup";
import FormElement from "../Forms/FormElement";
import { useEffect } from "react";
import { io } from "socket.io-client";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
import { useProducerContext } from "../Contexts/ContextProducer";
import { useHealthContext } from "../Contexts/ContextHealth";
import { useSupplyContext } from "../Contexts/ContextSupply";
import ShoppingCart from "../Components/ShoppingCart";
import { useUserContext } from "../Contexts/ContextUser";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useGetPoints } from "../CustomHooks/UserHooks/useGetPoints";
import GoogleMapComponent from "../Components/GoogleMapComponent";

function Home(props) {
  const { points } = useUserContext();
  const { setPoints } = useUserContext();
  const navigate = useNavigate();
  const { supplies, currentPage, totalCountSupplies, totalPages, setPageMode } =
    useSupplyContext();
  console.log("total count supplies:", totalCountSupplies);
  const [role, setRole] = useState("");

  const getPoints = useGetPoints();
  useEffect(
    () =>
      async function () {
        const newPoints = await getPoints();
        setPoints(newPoints);
      },

    []
  );

  useEffect(() => {
    setPageMode(true);
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
      console.log(role);
      if (payload.role === "user") {
        navigate("/app/infiniteScroll");
      }
    } else {
      console.log("No access token found in local storage");
    }
  }, []);

  useEffect(() => {
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
          if (data.ok) {
            return data.json();
          } else {
            console.log(data);
            return data.json().then((errorData) => {
              throw new Error(errorData.message);
            });
          }
        })
        .then((data) =>
          localStorage.setItem("accessToken", JSON.stringify(data.accessToken))
        )
        .catch((error) => {
          console.error("Error refreshing token:", error.message);
          window.alert(
            "The refresh token has expired! Please start a new session!"
          );
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/";
        });
    }, 300000);
    return () => clearInterval(refreshTokenInterval);
  }, []);

  const [pret, setPret] = useState(0);

  useEffect(() => {
    // setPoints(points + pret * 1.8)
    console.log("PRET" + points);
    setPoints(points + pret * 1.8);
    fetch("http://localhost:5000/api2/user/addPoints", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization:
          "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
      },
      body: JSON.stringify({ pointsToAdd: pret * 1.8 }),
    });
  }, [pret]);

  const [amount, setAmount] = useState(10);

  return (
    <>
      <div className="overflow-x-hidden" >
        <GoogleMapComponent />
        <div id="app-main-page">
          <p className="text-6xl flex items-center justify-center">Welcome!</p>
          <br />

          <nav className="w-screen flex items-center justify-center gap-20">
            <a href="/app/producers">Producers</a>
            <a href="/app/users">Users</a>
            <a href="/app/games/hangman">Hangman</a>
            <a href="/app/games/slots">Slots</a>
            <a href="/app/games/memoryGame">Memory Game</a>
            <Logout></Logout>
          </nav>
          <div className="flex flex-row-reverse mx-8">
            <ShoppingCart></ShoppingCart>
          </div>
          <div className="text-xl font-bold mb-4">&nbsp;&nbsp;&nbsp;&nbsp;Points:{points}</div>
        
          <div  className="flex flex-col items-center justify-center w-full max-w-md p-6 mx-auto my-6 bg-white rounded-lg shadow-md">
            <h1 className="text-xl font-bold mb-4">Buy Points with PayPal</h1>
            <input  className="w-full p-2 mb-4 text-lg border rounded"
              type="number"
              id="price"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p>Conversion rate: 1 Dollar = 1.8 Points</p>
            <PayPalScriptProvider
              options={{
                clientId:
                  "AdqWla9-tKfCHcISs4gVTRN_CfcbMo1D_dYEnqBg5fPH6PxPrPDBMuC37azHTxuvWR92EuZo-TG-h9VO",
              }}
            >
              <PayPalButtons
                
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: document.getElementById("price").value,
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then(() => {
                    setPret(document.getElementById("price").value);
                  });
                }}
              />
            </PayPalScriptProvider>
          </div>
          <br></br>
          {(role === "admin" || role === "moderator") && (
            <Popup
              trigger={<button className="button-55 mx-9"> Add supply </button>}
              modal
              nested
            >
              {(close) => (
                <div className="modal">
                  <div className="pop-up-content">
                    <FormElement nextPage={() => {}}></FormElement>
                  </div>
                  <div className="flex flex-row-reverse mx-5 my-3">
                    <button onClick={() => close()}>Close</button>
                  </div>
                </div>
              )}
            </Popup>
          )}
          <br></br>

          <>
            <h1>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Page #{currentPage} out
              of {totalPages} pages
            </h1>
            <h2>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Number of items
              currently shown :{supplies.length}
            </h2>
          </>

          <Repo role={role}></Repo>
        </div>
      </div>
    </>
  );
}

export default Home;
