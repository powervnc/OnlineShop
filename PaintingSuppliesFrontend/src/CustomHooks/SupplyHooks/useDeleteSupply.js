import { dealWithAuthenticationErrors } from "../../../utils/utils";
import { useSupplyContext } from "../../Contexts/ContextSupply";

const deleteSupply = async (idSupply, pageValue, previousProducer) => {
  const response = await fetch("http://localhost:5000/api2/supply/api4", {
    method: "DELETE",
    body: JSON.stringify({
      id: idSupply,
      page: pageValue,
      producer: previousProducer,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization:
        "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    dealWithAuthenticationErrors(response.status, errorData.errorMessage);
  }
  const result = await response.json();
  return result;
};


const useDeleteSupply = () => {
  const {
    supplies,
    setSupplies,
    currentPage,
    previousSelectedProducer,
    setCurrentPage,
    totalCountSupplies,
    setTotalCountSupplies,
    setPreviousButtonVisible,
    setNextButtonVisible,
    totalPages,
    setTotalPages,
  } = useSupplyContext();
  const finalDeleteSupply = async (idSupply) => {
    let valuePagination = currentPage;
    if (supplies.length == 1 && currentPage !== 1) {
      valuePagination = currentPage - 1;
    }
    const result = await deleteSupply(
      idSupply,
      valuePagination,
      previousSelectedProducer
    );
    setSupplies(result);
    setCurrentPage(valuePagination);
    if (valuePagination == 1) setPreviousButtonVisible(false);
    if (valuePagination >= totalPages) setNextButtonVisible(false);
    if (totalCountSupplies - 1 == 0) setCurrentPage(1);
    else setTotalPages(Math.ceil((totalCountSupplies-1) / 50));
    setTotalCountSupplies(totalCountSupplies - 1);
  };

  return finalDeleteSupply;
};
export default useDeleteSupply;
