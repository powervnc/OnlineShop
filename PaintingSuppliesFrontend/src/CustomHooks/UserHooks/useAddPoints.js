import { dealWithAuthenticationErrors } from "../../../utils/utils";
import { useUserContext } from "../../Contexts/ContextUser";

export const useAddPoints = () => {
  const { points, setPoints } = useUserContext();
  //decrease or add Points

  const addPoints = async (pointsToAdd) => {
    let changePointsWith = pointsToAdd;
    const httpString = "http://localhost:5000/api2/user/addPoints";
    if (points + pointsToAdd < 0) {
      changePointsWith = -points; ///decrease completely
    }
    try {
      const response = await fetch(httpString, {
        method: "PATCH",
        body: JSON.stringify({
          pointsToAdd: pointsToAdd,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization:
            "BEARER " + JSON.parse(localStorage.getItem("accessToken")),
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          dealWithAuthenticationErrors(response.status, errorData.errorMessage);
        }
      } else {
        setPoints(points + changePointsWith);
      }
    } catch (error) {
      console.log(error.message);
      console.error(error.message);
    }
  };

  return addPoints;
};
