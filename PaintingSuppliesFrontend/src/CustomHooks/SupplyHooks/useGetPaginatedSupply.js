import { dealWithAuthenticationErrors } from "../../../utils/utils";



const getPaginatedSupplies = async (nameProducer, page,load_5,category) => {
  try {
    const response = await fetch("http://localhost:5000/api2/supply/pages", {
      method: "PATCH",
      body: JSON.stringify({
        producer: nameProducer,
        page: page,
        load_5:load_5,
        category:category
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization:
          "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
      },
    });
    if (!response.ok) {
      const errorData = await response.json(); 
      dealWithAuthenticationErrors(response.status, errorData.mesage);
    }
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error("Error getting the paginated supplies", error);
    return [];
  }
};

const useGetPaginatedSupplies = () => {
  const finalGetPaginatedSupplies = async (previousSelectedProducer, page,load_5,category) => {
    const supplies = await getPaginatedSupplies(previousSelectedProducer, page,load_5,category);
    return supplies;
  };

  return finalGetPaginatedSupplies;
};
export default useGetPaginatedSupplies;
