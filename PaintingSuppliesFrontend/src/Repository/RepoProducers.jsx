
import Producer from "../Producer";

import PopUpEditProducer from "../Components/PopUpEditProducer";
import PopUpAddProducer from "../Components/PopUpAddProducer";
import { useEffect } from "react";
import { useProducerContext } from "../Contexts/ContextProducer";
import { useGetAllProducer } from "../CustomHooks/ProducerHooks/useGetAllProducers";
import useDeleteProducer from "../CustomHooks/ProducerHooks/useDeleteProducer";

function RepoProducers() {
  const {producers} = useProducerContext();
  console.log("producer inside repo produducer:",producers);
  const handleDelete=useDeleteProducer();
  
  return (
    <>
     <PopUpAddProducer></PopUpAddProducer>
     <br></br>
     <br></br>
     <br></br>
    <div className="body-container">
      {producers.map((producer, index) => (
        <div key={index} className="component-container">
          <Producer producer={producer}></Producer>
          <span className="span-button">
            <button className="button-55" onClick={async() =>await handleDelete(producer)}>Delete</button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;
            &nbsp;&nbsp;&nbsp;
           <PopUpEditProducer producer={producer}></PopUpEditProducer>
          </span>
        </div>
      ))}
    </div>
    </>
  );
}

export default RepoProducers;
