import { dealWithAuthenticationErrors } from "../../../utils/utils";


 const getPoints=async()=>{

    try{
   const httpString= "http://localhost:5000/api2/user/getPoints";
   const response=await fetch(httpString,{
    method:"GET",
    headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization:
          "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
      },

   })
   if(!response.ok){
    const errorData = await response.json();
    console.log("error in getting points :", errorData);
    dealWithAuthenticationErrors(response.status,errorData);
   }
   const data = await response.json();
   return data.points;
}catch(error){
    console.log("error getting the points of user:",error);
    return -0;

}
}

export const useGetPoints=()=>{
      
      const finalGetPoints=async()=>{
            const newPoints= await getPoints();
            return newPoints;

      }
      return finalGetPoints;

}




