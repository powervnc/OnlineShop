import React, { useState, useEffect } from "react";
import "./ShoppingCart.css";
import { useSupplyContext } from "../Contexts/ContextSupply";
import { usePlaceOrders } from "../CustomHooks/SupplyHooks/usePlaceOrders";
import { useUserContext } from "../Contexts/ContextUser";

//deal later with image

const ShoppingCart = () => {
  const [isOpen, setOpen] = useState(false);
  const { cart, removeFromCart,total } = useSupplyContext();
  const {lastTransaction,previouslySpentPoints }= useUserContext();
  const placeOrders=usePlaceOrders();
  console.log(cart);
  const toggleCart = () => {
    setOpen(!isOpen);
  };

  return (
    <>
      <div className="icon-cart" onClick={toggleCart}>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1"
          />
        </svg>
        {/* <span>{cart.reduce((total, item) => total + item.quantity, 0)}</span> */}
      </div>
      {isOpen && (
        <div className="shopping-cart">
          <div className="cart-content">
            <h2>Your Cart:</h2>
            {cart.length > 0 ? (
              <div>
                <div id='total-cart'>
                  Total: {total} points 
                  </div>
                <div className="cart-items">
                  {cart.map((item) => {
                    return (
                      <div key={item.idSupply} className="cart-item">
                        <div className="image">
                          <img
                            src="https://wallpaperaccess.com/full/1371991.jpg"
                            alt={item.idSupply}
                          />
                        </div>
                        <div className="details">
                          <div className="nameSupply">{item.nameSupply}</div>
                          <div className="priceSupply">
                            ${item.priceSupply * item.quantity}
                          </div>
                          <div className="quantity">
                            <span></span>
                            <span
                              className="minus"
                              onClick={() => removeFromCart(item.idSupply)}
                            >
                              −
                            </span>
                            <span>{item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <br></br>
                {/* id="submit-order-button"  */}
                <button className="bg-red-900 rounded-md text-white px-1" onClick={()=>{placeOrders()}} >Submit order</button>
                
              </div>
            ) : (
              // <div className="grid justify-center items-center grid-rows-3 grid-cols-3 col-span-3 col-start-1 col-end-3 row-start-2">Your cart is empty</div>
              <div className="grid grid-cols-3 grid-rows-3">
                <div className="col-span-3 row-start-2 col-start-1 col-end-4 flex justify-center items-center">
                  Your cart is empty!
                </div>
              </div>
            )}
          </div>
          <div id='last-transaction'>
                    &nbsp;History:&nbsp;
                    {lastTransaction}
                 <br></br>
                    &nbsp;Spend on last transaction:&nbsp;
                    {previouslySpentPoints}
                </div>
        </div>
      )}
    </>
  );
};

export default ShoppingCart;
