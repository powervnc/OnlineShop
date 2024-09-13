import { useProducerContext } from "../../Contexts/ContextProducer";

const addProducer = async (formData) => {
  const response = await fetch(
    "http://localhost:5000/api2/producer/addProducer",
    {
      method: "POST",
      body: JSON.stringify({
        nameProducer: formData.nameProducer,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );
  if (response.status == 400) {
    throw new Error(response.message);
  }
  else{
  const result = await response.json();
  return result;
  }
};

const useAddProducer = () => {
  const {setProducers} = useProducerContext();
  const addProducerFinal = async (formData) => {
    const producers = await addProducer(formData);
    console.log("producers....:",producers);
    setProducers(producers);
  }
  return addProducerFinal;
};

export default useAddProducer;
