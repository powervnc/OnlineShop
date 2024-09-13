import { createContext, useContext, useEffect, useState } from "react";

export const HealthContext = createContext(undefined);
export const useHealthContext = () => useContext(HealthContext);
export const HealthProvider = ({ children }) => {

  const [isServerOnline, setIsServerOnline] = useState(false);
  
  useEffect(() => {
    const checkServerStatus = () => {
      fetch("http://localhost:5000/api2/supply/health-check", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => {
          console.log("Health Check Response Status:", response.status);
          console.log(
            "Health Check Response Status Text:",
            response.statusText
          );

          if (!response.ok) {
            console.log("Server is offline or returned an error");
            setIsServerOnline(false);
          } else {
            console.log("Server is online");
            setIsServerOnline(true);
          }
        })
        .catch((error) => {
          console.error("Error connecting to the server:", error);
          setIsServerOnline(false);
        });
    };

    checkServerStatus();
    const interval = 200000;
    const intervalId = setInterval(checkServerStatus, interval);
    return () => clearInterval(intervalId);
  }, []);

  


  const contextValue = {
    
    isServerOnline,
    setIsServerOnline,
  };
  return (
    <HealthContext.Provider value={contextValue}>
      {children}
    </HealthContext.Provider>
  );
};
