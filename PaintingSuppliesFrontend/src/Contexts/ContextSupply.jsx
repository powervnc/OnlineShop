import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useProducerContext } from "./ContextProducer";
import useGetPaginatedSupplies from "../CustomHooks/SupplyHooks/useGetPaginatedSupply";
import useGetNrSuppliesProducedBy from "../CustomHooks/SupplyHooks/useGetNrProducers";
import { useUserContext } from "./ContextUser";

export const SupplyContext = createContext(undefined);
export const useSupplyContext = () => useContext(SupplyContext);
export const SupplyProvider = ({ children }) => {
  const { producers, setProducers } = useProducerContext();
  const [socketFaker, setSocketFacker] = useState(null);
  const [supplies, setSupplies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCountSupplies, setTotalCountSupplies] = useState(0);
  const [previousSelectedProducer, setPreviousProducer] = useState();
  const { points, setLastTransaction } = useUserContext();
  const [pageMode, setPageMode]=useState(true);

  const [category, setCategory] = useState("All Categories");
  const CATEGORIES = [
    "Drawing",
    "Painting",
    "Craft",
    "Printmaking",
    "Sculpting",
  ];
  const getPaginatedSupplies = useGetPaginatedSupplies();
  const getNrSuppliesProducerBy = useGetNrSuppliesProducedBy();
  const [nextButtonVisible, setNextButtonVisible] = useState(false);
  const [previousButtonVisible, setPreviousButtonVisible] = useState(false);
  const [cart, setCart] = useState([]);

  const total = cart.reduce(
    (partialSum, itemInCart) =>
      partialSum + itemInCart.priceSupply * itemInCart.quantity,
    0
  );
  console.log("TOTAL IN CART:", total);

  const dealWithNextButtonAtInitialization = (nrPages) => {
    if (nrPages > 1) {
      setNextButtonVisible(true);
    } else {
      setNextButtonVisible(false);
    }
  };

  //initialize pagination

  useEffect(
    () =>
      async function () {
        console.log(previousSelectedProducer);
        const suppliesOnPage1 = await getPaginatedSupplies(
          previousSelectedProducer,
          1,
          false
        );
        const nrSuppliesProduced = await getNrSuppliesProducerBy(
          previousSelectedProducer
        );
        setTotalCountSupplies(nrSuppliesProduced);
        let nrPages = 0;
        if (nrSuppliesProduced == 0) nrPages = 1;
        else nrPages = Math.ceil(nrSuppliesProduced / 50);
        setTotalPages(nrPages);
        // setSupplies(suppliesOnPage1);
        dealWithNextButtonAtInitialization(nrPages);
        const c = getCartFromLocalStorage();
        if (c.length > 0) {
          const updatedSupplies = suppliesOnPage1.map((supply) => {
            const cartItem = c.find(
              (item) => item.idSupply === supply.idSupply
            );
            if (cartItem) {
              return {
                ...supply,
                nrOfSupplies: supply.nrOfSupplies - cartItem.quantity,
              };
            }
            return supply;
          });
          setSupplies(updatedSupplies);
        } else {
          setSupplies(suppliesOnPage1);
        }
      },
    []
  );

  //page change, supplies changed--> reconfigure
  useEffect(() => {
    if (currentPage != 1) {
      const c = getCartFromLocalStorage();
      console.log("supplis begore configuring for cart:", supplies);
      //supplies wmpty array
      const updatedSupplies = supplies.map((supply) => {
        const cartItem = c.find((item) => item.idSupply === supply.idSupply);
        if (cartItem) {
          return {
            ...supply,
            nrOfSupplies: supply.nrOfSupplies - cartItem.quantity,
          };
        }
        return supply;
      });
      setSupplies(updatedSupplies);
    }
  }, [currentPage]);

  useEffect(() => {
    //add wss back
    const socketIo = io("ws://localhost:5000", {});
    socketIo.connect();
    socketIo.on("connect", () => {
      console.log("Socket connected");
      setSocketFacker(socketIo);
    });

    return () => {
      socketIo.disconnect();
    };
  }, [previousSelectedProducer]);
  useEffect(() => {
    if (socketFaker) {
      const handleNewRandom = (newItems) => {
        console.log("Received new items:", newItems);

        setSupplies((prevSupplies) => {
          let updatedSupplies = [...prevSupplies];

          for (let newItem of newItems) {
            if (
              updatedSupplies.length < 50 && pageMode&&
              (previousSelectedProducer === null ||
                previousSelectedProducer === "AllProducers" ||
                newItem.idProducer === previousSelectedProducer)
            ) {
              updatedSupplies.push(newItem);
            }


           


          }

          if (updatedSupplies.length > 50 && pageMode) {
            updatedSupplies = updatedSupplies.slice(0, 50);
          }
          if(pageMode==false && supplies.length>=totalCountSupplies){
            setTotalCountSupplies(newItems.length+totalCountSupplies);
            setSupplies([...supplies,...newItems])
     }

          if (
            previousSelectedProducer === null ||
            previousSelectedProducer === "AllProducers" ||
            newItems.some(
              (item) => item.idProducer === previousSelectedProducer
            )
          ) {
            setTotalCountSupplies((prevCount) => prevCount + newItems.length);
          }

          return updatedSupplies;
        });
      };

      socketFaker.on("newItems", handleNewRandom);

      return () => {
        socketFaker.off("newItems", handleNewRandom);
      };
    }
  }, [previousSelectedProducer, socketFaker]);

  useEffect(() => {
    if (socketFaker) {
      console.log("fak:", socketFaker);
      const handleNewRandom = (event) => {
        console.log("socket faker deal with new items");
        const newItems = event;
        console.log("New items", newItems);
        // const spaceLeft = 50 - supplies.length;
        // const itemsToAdd = newItems.slice(0, spaceLeft);
        // if (newItems.length > spaceLeft) {
        //   setNextButtonVisible(true);
        // }
        // if (supplies.length <= 50) setSupplies([...supplies, ...itemsToAdd]);
        // setTotalPages(length + 10);
      };
      socketFaker.on("newItems", handleNewRandom);
      return () => {
        socketFaker.off("newItems", handleNewRandom);
      };
    }
  }, [previousSelectedProducer, socketFaker]);

  ///add to cart
  //TO DO: verify you have enough money

  const userHasEnoughMoney = (newSupply) => {
    const priceToAdd = newSupply.priceSupply;
    let sumMoney = 0;
    cart.forEach((item) => {
      sumMoney += item.quantity * item.priceSupply;
    });
    if (points >= sumMoney + priceToAdd) return true;
    return false;
  };

  const addToCart = (idSupply) => {
    const supply = supplies.find((s) => s.idSupply === idSupply);
    if (!supply || supply.nrOfSupplies <= 0) {
      console.log("Supply not found or no supplies left");
      return;
    }
    if (!userHasEnoughMoney(supply)) {
      console.log("poits:", points);
      const deficit = -points + total + supply.priceSupply;
      setLastTransaction(
        " You need " +
          deficit +
          " more points to also buy one " +
          supply.nameSupply
      );
      return;
    }
    console.log(supply);
    const nrOfSupplies = supply.nrOfSupplies;
    const updatedSupply = { ...supply, nrOfSupplies: nrOfSupplies - 1 };

    const updatedSupplies = supplies.map((s) =>
      s.idSupply === idSupply ? updatedSupply : s
    );
    setSupplies(updatedSupplies);
    //cart item
    //image --> later
    //idSupply
    //quantity

    const existingItemIndex = cart.findIndex(
      (item) => item.idSupply === idSupply
    );
    if (existingItemIndex === -1) {
      setCart([
        ...cart,
        {
          idSupply: idSupply,
          nameSupply: supply.nameSupply,
          quantity: 1,
          priceSupply: supply.priceSupply,
        },
      ]);
    } else {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity++;
      setCart(updatedCart);
    }
    updateLocalStorage();
  };

  //use state cart
  // save in local storage

  //search in cart for item with idSupply

  //remove from cart

  const removeFromCart = (idSupply) => {
    console.log("supplie sin rmeove:", supplies);
    const supply = supplies.find((s) => s.idSupply === idSupply);

    if (supply) {
      const nrOfSupplies = supply.nrOfSupplies;
      const updatedSupply = { ...supply, nrOfSupplies: nrOfSupplies + 1 };
      const updatedSupplies = supplies.map((s) =>
        s.idSupply === idSupply ? updatedSupply : s
      );
      setSupplies(updatedSupplies);
    }
    const existingItemIndex = cart.findIndex(
      (item) => item.idSupply === idSupply
    );
    if (existingItemIndex == -1) return;
    const updatedCart = [...cart];
    if (updatedCart[existingItemIndex].quantity > 1) {
      updatedCart[existingItemIndex].quantity--;
    } else {
      updatedCart.splice(existingItemIndex, 1);
    }
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
  };

  //TO DO: in the backend if something out of stock return as error in the cart
  //TO DO: if the prduce doesn exits anymore..... return error produce not anymore

  const getCartFromLocalStorage = () => {
    let newCart = JSON.parse(localStorage.getItem("cart"));
    console.log("cart:", newCart);
    if (newCart) {
      console.log("yes");
      setCart(newCart);
      console.log(newCart);
    } else if (!newCart) {
      emptyOutCart();
    }
    return newCart;
  };
  const updateLocalStorage = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const emptyOutCart = () => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  const contextValue = {
    supplies,
    currentPage,
    totalPages,
    totalCountSupplies,
    setSupplies,
    setCurrentPage,
    setTotalPages,
    setTotalCountSupplies,
    previousSelectedProducer,
    setPreviousProducer,
    setSocketFacker,
    socketFaker,
    nextButtonVisible,
    setNextButtonVisible,
    previousButtonVisible,
    setPreviousButtonVisible,
    producers,
    setProducers,
    dealWithNextButtonAtInitialization,
    CATEGORIES,
    addToCart,
    removeFromCart,
    cart,
    updateLocalStorage,
    emptyOutCart,
    total,
    category,
    setCategory,
    setPageMode
  };

  return (
    <SupplyContext.Provider value={contextValue}>
      {children}
    </SupplyContext.Provider>
  );
};
