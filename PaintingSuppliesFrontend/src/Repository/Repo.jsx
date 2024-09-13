import { Link } from "react-router-dom";
import Supply from "../Supply";
import Popup from "reactjs-popup";
import FormElementEdit from "../Forms/FormElementEdit";

import { useSupplyContext } from "../Contexts/ContextSupply";
import { useHealthContext } from "../Contexts/ContextHealth";
import useDeleteSupply from "../CustomHooks/SupplyHooks/useDeleteSupply";
import { storeAction } from "../LocalStoroge/localStorageUtils";
import usePreviousPage from "../CustomHooks/SupplyHooks/usePreviousPage";
import useNextPage from "../CustomHooks/SupplyHooks/useNextPage";
import useSelectNewProducer from "../CustomHooks/SupplyHooks/useSelectNewProducer";

function Repo() {
  const { supplies, producers, nextButtonVisible, previousButtonVisible, addToCart } =
    useSupplyContext();

  const { isServerOnline } = useHealthContext();

  const role = "admin";

  const handleDeleteOnline = useDeleteSupply();
  const handlePreviousPage = usePreviousPage();
  const handleNextPage = useNextPage();
  const handelFilterProducer = useSelectNewProducer();
  const handleDelete = (idSupply) => {
    if (isServerOnline) {
      handleDeleteOnline(idSupply);
    } else {
      storeAction("deleteSupply", idSupply);
    }
  };

  const onClickFilterByProducer = () => {
    const selectElement = document.getElementById("producer-select");
    const selectedProducer = selectElement.value;
    handelFilterProducer(selectedProducer);
  };


  return (
    <div >
      <div className="mx-9">
      <button
        // id="button-filter-by-producer"
        className="button-53"
        onClick={() => {
           onClickFilterByProducer();
        }}
      >
        Filter by producer
      </button>
      {producers.length > 0 ? (
        <select
           id="producer-select"
          className="border-black"
          name="producer"
          onChange={() => {}}
          defaultValue={producers[0]}
        >
          <option value="All Producers">All Producers</option>
          {producers.map((producer, index) => (
            <option key={index} value={producer.nameProducer}>
              {producer.nameProducer}
            </option>
          ))}
        </select>
      ) : (
        <></>
      )}
      <br></br>
      </div>
      <div id="duv-buttons">
        <button
          id="previous-button"
          style={{ display: previousButtonVisible ? "block" : "none" }}
          className="button-55 mx-9"
          onClick={async () => {
            handlePreviousPage();
          }}
        >
          Previous Page
        </button>
        <br></br>
        <button
          id="next-button"
          style={{ display: nextButtonVisible ? "block" : "none" }}
          className="button-55 mx-9"
          onClick={async () => {
            handleNextPage();
          }}
        >
          Next Page
        </button>
        <br></br>
      </div>
      <div className="body-container">
        {supplies.map((element, index) => (
          <div id={element.idSupply} key={index} className="component-container">
            <Supply item={element}></Supply>
            <span >
              <Link
                to={{ pathname: `/app/element/${element.idSupply}` }}
                state={{ idSupply: element.idSupply }}
              >
                <button className="button-55">View</button>
              </Link>
              {(role === "admin" || role === "moderator") && (
                <>
                  <button className="button-55"
                    onClick={() => {
                      handleDelete(element.idSupply);
                    }}
                  >
                    Delete
                  </button>
                  <Popup
                    trigger={<button className="button-55"> Edit </button>}
                    modal
                    nested
                  >
                    {(close) => (
                      <div className="modal">
                         {/* className="button-55" */}
                        <div className="pop-up-content">
                          <h1>Edit {element.nameSupply}! </h1>
                          <FormElementEdit item={element}></FormElementEdit>
                        </div>
                        <div>
                          <button  onClick={() => close()}>Close modal</button>
                        </div>
                      </div>
                    )}
                  </Popup>
                </>
              )}
            </span>
            {
              element.nrOfSupplies>0?(<button className="button-53" onClick={()=>addToCart(element.idSupply)}>Add To Cart</button>):(<></>)
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default Repo;
