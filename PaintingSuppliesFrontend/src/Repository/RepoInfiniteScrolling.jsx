
import { useSupplyContext } from "../Contexts/ContextSupply";
import Supply from "../Supply";




function Repo(){
    const { supplies, addToCart } =useSupplyContext();  
    return(
         <div className="body-container" >           
                {
                supplies.map((element,index)=>
                      <div key={index} className="component-container">
                        <Supply  item={element}></Supply>
                        {
              element.nrOfSupplies>0?(<button className="button54" onClick={()=>addToCart(element.idSupply)}>Add To Cart</button>):(<></>)
            }   
                    </div>
                    )
                }
                
          </div>)
}

export default Repo