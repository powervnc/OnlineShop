export const dealWithAuthenticationErrors = (status,errorMessage) => {
  
   if (status === 401) {
    throw new Error("Unauthorized");
  } else if (status === 403) {
    if (errorMessage === "The access token is not valid!") {
      throw new Error("Try again.The acess stoken is expired");
    } else {
      throw new Error("You do not have the required permissions.");
    }
  } 
  else throw new Error(errorMessage);
};

