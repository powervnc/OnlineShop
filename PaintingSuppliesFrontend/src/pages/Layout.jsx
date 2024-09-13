import { Outlet, Link } from "react-router-dom";
import Popup from "reactjs-popup";
import FormElement from "../Forms/FormElement";

function Layout(){
  return(<>
    {/* <header className="style-header">
        <h1>My webpage</h1>
    </header> */}
    <Outlet></Outlet>
</>
)
}


export default Layout





