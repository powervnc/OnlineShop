import { createContext, useContext, useState } from "react";
import { useGetAllProducer } from "../CustomHooks/ProducerHooks/useGetAllProducers";
import { useEffect } from "react";
useGetAllProducer;
export const ProducerContext = createContext(undefined);
export const useProducerContext = () => useContext(ProducerContext);
export const ProducerProvider = ({ children }) => {
  const [producers, setProducers] = useState([]);
  const getAllProducers = useGetAllProducer();
  const contextValue = {
    producers,
    setProducers,
  };
  useEffect(
    () =>
      async function () {
        setProducers(await getAllProducers());
      },
    []
  );

  return (
    <ProducerContext.Provider value={contextValue}>
      {children}
    </ProducerContext.Provider>
  );
};
