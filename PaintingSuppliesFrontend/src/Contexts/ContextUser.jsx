import { createContext, useContext, useEffect, useState } from "react";
import { useGetPoints } from "../CustomHooks/UserHooks/useGetPoints";
export const UserContext = createContext(undefined);
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [points, setPoints] = useState(100);
  const [previouslySpentPoints, setPreviouslySpentPoints] = useState(0);
 
  const [lastTransaction, setLastTransaction] = useState("");
  
  const contextValue = {
    
    points,
    setPoints,
    previouslySpentPoints,
    setPreviouslySpentPoints,
    lastTransaction,
    setLastTransaction
  };
  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
