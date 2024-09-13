


import { useProducerContext } from "../../Contexts/ContextProducer";

const getAllProducers = async () => {
  try {
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }
    const response = await fetch(
      "http://localhost:5000/api2/producer/getProducers",
      {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `BEARER ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching producers:", error);
    return [];
  }
};


export const useGetAllProducer=()=>{
   

    const getAllProducersFinal=async()=>{
     const totalProducers=await getAllProducers();
     return totalProducers;
    }
    return getAllProducersFinal
}





















  
 

