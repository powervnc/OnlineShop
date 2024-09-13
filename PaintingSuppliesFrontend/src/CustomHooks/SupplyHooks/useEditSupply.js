import { dealWithAuthenticationErrors } from "../../../utils/utils";
import { useSupplyContext } from "../../Contexts/ContextSupply";

const updateItem = async (itemData, page, selectedProducer) => {
  const response = await fetch(
    "http://localhost:5000/api2/supply/updateSupply",
    {
      method: "PATCH",
      body: JSON.stringify({
        ...itemData,
        page: page,
        selectedProducer: selectedProducer,
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
    if (response.status === 400) {
      if (Array.isArray(errorData.message)) {
        throw Error(errorData.message.join(", "));
      } else {
        throw Error(errorData.message || "An unknown error occurred");
      }
    } else dealWithAuthenticationErrors(response.status,errorData.errorMessage);
  }
  const result = await response.json();
  return result;
};
const useEditSupply = () => {
  const { setSupplies, currentPage, previousSelectedProducer } =
    useSupplyContext();

  const finalEditSupply = async (idSupply, formData) => {
    const itemData = { ...formData, idSupply: idSupply };
    console.log("item data in finalEditSupply:", itemData);
    const supplies = await updateItem(
      itemData,
      currentPage,
      previousSelectedProducer
    );
    console.log("supplie sin edit:", supplies);

    if (
      !previousSelectedProducer ||
      previousSelectedProducer == "All Producers" ||
      previousSelectedProducer == formData.nameProducer
    ) {
      setSupplies(supplies);
    }
  };
  return finalEditSupply;
};
export default useEditSupply;
