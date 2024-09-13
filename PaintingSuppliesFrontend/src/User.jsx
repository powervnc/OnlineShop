
function User(props){
    const item=props.item; 
    return(
        <>
        <h1>Username: {item.username}</h1>
        <div style={{height:"200px"}}  >
            <img className="component-image" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficons.veryicon.com%2Fpng%2Fo%2Fmiscellaneous%2Ftwo-color-icon-library%2Fuser-286.png&f=1&nofb=1&ipt=1192cb829efd96a770f6dae807fd3d0c7ef2af4e5107edf1c5a345b28a79b51c&ipo=images" alt="User"></img>
            
        </div>
        <h1 style={{height:"20px", padding:"5px"}}>Role: {item.nameRole}</h1>  
        </>
    )

}
export default User