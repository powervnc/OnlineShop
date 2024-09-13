import { useProducerContext } from "../../Contexts/ContextProducer";



  const deleteProducer=async(producer) =>{
   
   const response=await fetch("http://localhost:5000/api2/producer/deleteProducer", {
      method: "DELETE",
      body: JSON.stringify({
        idProducer: producer.idProducer,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    
    

        if (response.status == 400) {
          throw new Error("Supply data is not correct");
        }
     const result=await response.json();
     return result
    
  }


const useDeleteProducer=()=>{

    const {setProducers} = useProducerContext();
    const finalDeleteProducer=async(producer)=>{
        const producersAfterDelete=await deleteProducer(producer);
        setProducers(producersAfterDelete);

    }
    return finalDeleteProducer;

}
export default useDeleteProducer;
