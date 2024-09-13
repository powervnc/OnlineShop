import { dealWithAuthenticationErrors } from "../../../utils/utils";
import { useSupplyContext } from "../../Contexts/ContextSupply";

const addSupply = async (formData, valuePagination, selectedProducer) => {
  console.log("Form data:",formData);
  const formDataToSend = new FormData();
  
  // formDataToSend.append("selectedProducer", selectedProducer);
  // formDataToSend.append("nameSupply", formData.nameSupply);
  // formDataToSend.append("nameProducer", formData.nameProducer);
  // formDataToSend.append("priceSupply", formData.priceSupply);
  // formDataToSend.append("nrOfSupplies", formData.nrOfSupplies);
  // formDataToSend.append("categorySupply", formData.categorySupply);
  // formDataToSend.append("descriptionSupply", "");
  // formDataToSend.append("page", valuePagination);
  // formDataToSend.append("supplyImage", formData.supplyImage[0]);
  // console.log("from data after:",formDataToSend)
  const response = await fetch("http://localhost:5000/api2/supply/addSupply", {
    method: "POST",
    body: JSON.stringify({
      selectedProducer: selectedProducer,
      nameSupply: formData.nameSupply,
      nameProducer: formData.nameProducer,
      priceSupply: formData.priceSupply,
      nrOfSupplies: formData.nrOfSupplies,
      categorySupply:formData.categorySupply,
      descriptionSupply: "",
      page: valuePagination,
      supplyImage:formData.supplyImage
    }),
    // body: formDataToSend,
    
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization:
        "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 400) {
      if (Array.isArray(errorData.message)) {
        throw Error(errorData.message.join(", "));
      } else {
        throw Error(errorData.message || "An unknown error occurred");
      }
    } else dealWithAuthenticationErrors(response.status, errorData.message);
  }

  const result = await response.json();
  return result;
};

const useAddSupply = () => {
  const {
    supplies,
    setSupplies,
    setTotalCountSupplies,
    setCurrentPage,
    previousSelectedProducer,
    currentPage,
    totalCountSupplies,
    setTotalPages,
    totalPages,
    setPreviousButtonVisible,
  } = useSupplyContext();

  const finalAddSupply = async (formData) => {
    let valuePagination = currentPage;

    if (
      !previousSelectedProducer ||
      previousSelectedProducer == "All Producers" ||
      previousSelectedProducer == formData.nameProducer
    ) {
      if (supplies.length == 50 && currentPage == totalPages) {
        valuePagination = currentPage + 1;
      }
    }
    const result = await addSupply(formData, valuePagination,previousSelectedProducer);

    if (result.message) {
      throw new Error(result.message);
    }
    setTotalPages(Math.ceil((totalCountSupplies + 1) / 50));
    setSupplies(result);
    setTotalCountSupplies(totalCountSupplies + 1);
    setCurrentPage(valuePagination);
    if (valuePagination > 1) setPreviousButtonVisible(true);
  };

  return finalAddSupply;
};

export default useAddSupply;
