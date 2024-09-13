import { useSupplyContext } from "../../Contexts/ContextSupply";

const useInitializeNextButton = async (nextButton) => {
  const {totalCountSupplies}=useSupplyContext();
  if (Math.ceil(totalCountSupplies/ 50) > 1) {
    console.log("next");
    nextButton.style.display = "block";
    nextButton.innerHTML = "next page";
  } else {
    nextButton.style.display = "none";
  }
};
export default useInitializeNextButton