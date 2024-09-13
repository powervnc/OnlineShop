
function Supply(props){
    const item=props.item; 
    const image=props.supplyImage;
    const id_quantity = `nr${item.idSupply}`;
    const nrOfSupplies= item.nrOfSupplies;
    return(
        <>
        <h1>{item.priceSupply} points</h1>
        <h1>Name: {item.nameSupply}</h1>
        <div style={{padding:"0xp"}}  >
            <img style={{padding:"10px 0px"}} className="component-image" src="https://wallpaperaccess.com/full/1371991.jpg" alt=""></img>
            <h1>Name: {item.nameSupply}</h1>
            <h1>Category:{item.categorySupply}</h1>
            <h2 id={id_quantity}  >Nr of supplies:{nrOfSupplies}</h2>
        </div>  
        </>
    )

}
export default Supply