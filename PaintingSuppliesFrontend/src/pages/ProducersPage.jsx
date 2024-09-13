import { useState } from "react"

import { useEffect} from "react"

import RepoProducers from "../Repository/RepoProducers"
import { useNavigate } from "react-router-dom";
import { useHealthContext } from "../Contexts/ContextHealth";
import { ProducerContext } from "../Contexts/ContextProducer";


function HomeProducers(props){
    const navigate = useNavigate();
    const [role,setRole]=useState("");
    const {isServerOnline} = useHealthContext();
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setRole(payload.role);
          console.log(role);
          if(payload.role!=="admin" && payload.role!=="moderator"  ){
            navigate("/");
          }
        } else {
          console.log("No access token found in local storage");
        }
      }, []);

    return (
        <>
        {!isServerOnline ? <h1>Server is dead </h1> :
        <>
        <h1 className="mx-9 text-5xl">Producers</h1>
        <br></br>
        <br></br>
         <RepoProducers>
        </RepoProducers>
       
        </>
            }</>
    )  
}

export default HomeProducers
