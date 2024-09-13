import { dealWithAuthenticationErrors } from "../../../utils/utils";
import { useSupplyContext } from "../../Contexts/ContextSupply";
import { useUserContext } from "../../Contexts/ContextUser";

export const usePlaceOrders = () => {
  const { points, setPoints, setPreviouslySpentPoints, setLastTransaction } =
    useUserContext();
  const { cart,emptyOutCart  } = useSupplyContext();
  let totalSumSpent = 0;
  const placeOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api2/supply/placeOrders",
        {
          method: "POST",
          body: JSON.stringify({
            cart: cart,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization:
              "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        const status = response.status;
        if (status == 400) {
          totalSumSpent = errorData.totalSumSpent;
          setPreviouslySpentPoints(totalSumSpent);
          setPoints(points - totalSumSpent);
          setLastTransaction(errorData.message);
        } else dealWithAuthenticationErrors(status, errorData.message);
      } else {
        const data = await response.json();
        totalSumSpent = data.totalSumSpent;
        setPreviouslySpentPoints(totalSumSpent);
        setPoints(points - totalSumSpent);
        setLastTransaction("Succesfully placed orders");
      }
    } catch (error) {
      setPreviouslySpentPoints(0);
      setLastTransaction("Something went wrong on the server:"
        +error.message)
    }
    emptyOutCart();

  };
  return placeOrders;
};
