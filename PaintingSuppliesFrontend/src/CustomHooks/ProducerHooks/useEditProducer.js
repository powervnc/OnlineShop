import { useProducerContext } from "../../Contexts/ContextProducer";




const updateProducer = async (itemData) => {
  const response = await fetch(
    "http://localhost:5000/api2/producer/updateProducer",
    {
      method: "PATCH",
      body: JSON.stringify({
        idProducer: itemData.idProducer,
        nameProducer: itemData.nameProducer,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  } else {
    const result = await response.json();
    return result;
  }
};

const useEditProducer = () => {
  const {setProducers} = useProducerContext();
  const editProducer = async (idProducer, formData) => {
    const updatedProducer= { ...formData, idProducer };
    const result = await updateProducer(updatedProducer);
    setProducers(result);
  }
  return editProducer;
};

export default useEditProducer;
