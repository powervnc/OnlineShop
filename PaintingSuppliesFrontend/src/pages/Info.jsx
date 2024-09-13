import { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
function Info(){
    let {state}=useLocation();
    const idItem=state.idSupply;
    console.log("IdItem:",idItem);
    const [item,setItem]=useState({});
    console.log(idItem);
    useEffect(()=>{
    fetch(`http://localhost:5000/api2/supply/api3?idSupply=${idItem}`, {
          method: "GET",
          headers: {
          "Content-type": "application/json; charset=UTF-8"
                   }
        }).then((response)=>response.json()).then(
            (data)=>{
                console.log("data:",data);
                setItem(data);}
        )    
            },[]);
    ///the useEffect makes sure that set Function, in our case fetch(...) runs every time the dependecy(idItem) changes  
    console.log("Item:",item);
    const description=item.descriptionSupply;
    const name=item.nameSupply;
    const producer=item.nameProducer;
    const price=item.priceSupply;
    const category=item.categorySupply;
    return(
        <div className="info">
           <div className="center-information">
           <h1>{name}</h1>
           <h2>
            Producer:{producer} 
            </h2>
           <h2>
            Name:{name}
            </h2>
            <h2>
            Price:{price}
            </h2>
           <h2>Description:{description}</h2>
           <h2>Category:{category}</h2>
           </div>
           <img  className="image-info"  src="./src/assets/paint.jpg" alt=""></img>
        </div>
    );
}
export default Info