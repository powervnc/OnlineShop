import { useState } from "react";
import Repo from "../Repository/RepoInfiniteScrolling";
import Popup from "reactjs-popup";
import FormElement from "../Forms/FormElement";
import { useEffect } from "react";
import { Socket, io } from "socket.io-client";
import Logout from "./Logout";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate, Navigate } from "react-router-dom";
import { useHealthContext } from "../Contexts/ContextHealth";
import { useSupplyContext } from "../Contexts/ContextSupply";
import { useUserContext } from "../Contexts/ContextUser";
import ShoppingCart from "../Components/ShoppingCart";
import useSelectNewProducer from "../CustomHooks/SupplyHooks/useSelectNewProducer";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useGetPoints } from "../CustomHooks/UserHooks/useGetPoints";
import GoogleMapComponent from "../Components/GoogleMapComponent";
const LOAD_MORE_VALUE = 5;

function Home(props) {
  const { points, setPoints } = useUserContext();
  const navigate = useNavigate();
  //const [listProducers, setListProducers] = useState([]);
  // const [isServerOnline, setIsServerOnline] = useState(true);
  const { isServerOnline } = useHealthContext();
  const {
    supplies,
    previousSelectedProducer,
    setPreviousProducer,
    totalCountSupplies,  
    producers,
    setSupplies,
    currentPage,
    setCurrentPage,
    category,
    setCategory,
    setPageMode
    
  } = useSupplyContext();

  const getPoints = useGetPoints();
  useEffect(
    () =>
      async function () {
        const newPoints = await getPoints();
        setPoints(newPoints);
      },

    []
  );

  const dealWithChangedProducer = useSelectNewProducer();
  const [role, setRole] = useState(null);
  useEffect(() => {
    setPageMode(false);
    const token = localStorage.getItem("accessToken");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
      console.log(role);
      // if (payload.role !== "user") {
      //   navigate("/");
      // }
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
          Authorization:
            "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
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
          // window.alert("The refresh token has expired! Please start a new session!");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/";
        });
    }, 300000);

    return () => clearInterval(refreshTokenInterval);
  }, []);

  const startSupplyFiltering = () => {
    const selectElement = document.getElementById("producer-select");
    const selectedProducer = selectElement.value;
    dealWithChangedProducer(selectedProducer,category);
  
  };
  const canAddMoreToScroll = () => {
    console.log("Total:", totalCountSupplies);
    console.log("Length:", supplies.length);
    console.log("supplies:",supplies);
    console.log(totalCountSupplies > supplies.length)
    return totalCountSupplies > supplies.length;
  };

  const addMoreToScroll = () => {
    const producerSelect = document.getElementById("producer-select");
    const selectedProducer = producerSelect.value;
    setTimeout(() =>
      fetch("http://localhost:5000/api2/supply/pages", {
        method: "PATCH",
        body: JSON.stringify({
          producer: selectedProducer,
          page: currentPage + 1,
          load_5:true,
          category:category
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization:
            "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
        },
      })
        .then((response) => {
          if (response.ok) return response.json();
          else {
            throw new Error(response.json().message);
          }
        })
        .then((data) => {
          if (Array.isArray(data)) {
            console.log("data list:", data);
            setSupplies(supplies.concat(data));
            setCurrentPage(currentPage+ 1);
          }
        })
        .catch((err) => {
          console.error("Error on selecting the producer: ", err);
        })
    );
  };


  const onClickFilterByCategory = (category) => {
    ///filter by category 
    dealWithChangedProducer("All Producers", category);
  };

  const [pret, setPret] = useState(0)
  

  
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
    })

  },[pret]);


  const [amount, setAmount] = useState(10);

  return (
    <>
    
    <div id="app-main-page">
      
  
      <div className="flex flex-row-reverse mx-8">
      <GoogleMapComponent />
           
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


      <nav>
        <div id='option-all-categories-supplies' className="button-55"
          onClick={()=>{onClickFilterByCategory()}}>
            All Categories
        </div>
        <div
          id="option-drawing-supplies" className="button-55"
          onClick={() => {
            onClickFilterByCategory("Drawing");
          }}
        >
          Drawing Supplies
        </div>
        <div
          id="option-painting-supplies" className="button-55"
          onClick={() => {
            onClickFilterByCategory("Painting");
          }}
        >
          Painting Supplies
        </div>
        <div
          id="option-craft-supplies" className="button-55"
          onClick={() => {
            onClickFilterByCategory("Craft");
          }}
        
        >Craft Supplies</div>
        <div
          id="option-printmaking-supplies" className="button-55"
          onClick={() => {
            onClickFilterByCategory("Printmaking");
          }}
        >
          Printmaking Supplies
        </div>
        <div
          id="option-sculpting-supplies" className="button-55"
          onClick={() =>
            onClickFilterByCategory( "Sculpting")
          }
        >
          Sculpting Supplies
        </div>
        <Logout></Logout>
        <div>
       
        </div>
        <ShoppingCart></ShoppingCart>
      </nav>
      <br></br>

      <select id="producer-select" name="producer">
        <option value="All Producers">All Producers</option>
        {producers.map((producer, index) => (
          <option key={index} value={producer.nameProducer}>
            {producer.nameProducer}
          </option>
        ))}
      </select>

      <button
        id="next-button"
        style={{ display: "block" }}
        onClick={startSupplyFiltering}
      >
        Start infinite Scroll
      </button>

      <h1>Number of items shown:{supplies.length}</h1>

      {supplies.length !== 0 ? (
        <InfiniteScroll
          dataLength={supplies.length}
          next={addMoreToScroll}
          hasMore={canAddMoreToScroll()}
          loader={<p>loading....</p>}
          endMessage={<p>No more items!</p>}
        >
          <Repo itemList={supplies}></Repo>
        </InfiniteScroll>
      ) : (
        <></>
      )}
      </div>
    </>
  );
}

export default Home;
