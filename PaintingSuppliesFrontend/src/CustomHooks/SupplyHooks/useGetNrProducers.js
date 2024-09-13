import { dealWithAuthenticationErrors } from "../../../utils/utils";

const getNrSuppliesProducedBy = async (nameProducer,category) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api2/supply/nrSuppliesProduced",
      {
        method: "PATCH",
        body: JSON.stringify({
          producer: nameProducer,
          category:category
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
      console.log("error in nr :", errorData)
      dealWithAuthenticationErrors(response.status,errorData.message);

    }
    const data = await response.json();
    console.log("Data count:", data)
    return data.count;
  } catch (error) {
    console.error(
      "Error calculating the number of supplies producer by:",
      error
    );
    return 0;
  }
};
export const useGetNrSuppliesProducedBy = () => {
  const finalGetNrSuppliesProducedBy = async (nameProducer,category) => {
    const nrSupplies = await getNrSuppliesProducedBy(nameProducer,category);
    return nrSupplies;
  };
  return finalGetNrSuppliesProducedBy;
};

export default useGetNrSuppliesProducedBy;
