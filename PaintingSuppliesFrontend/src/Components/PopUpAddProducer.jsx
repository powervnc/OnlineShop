import Popup from "reactjs-popup";
import FormElementAddProducer from "../Forms/FormElementAddProducer";
function PopUpAddProducer() {
  return (
    <div className="mx-9">
    <Popup
      trigger={<button className="button-55"> Click to open modal </button>}
      modal
      nested
    >
      {(close) => (
        <div className="modal">
          <div className="pop-up-content">
            {/* Add an item! */}
            <FormElementAddProducer />
          </div>
          <div className="flex flex-row-reverse mx-5 my-3">
            <button onClick={() => close()}>Close</button>
          </div>
        </div>
      )}
    </Popup>
    </div>
  );
}
export default PopUpAddProducer;
