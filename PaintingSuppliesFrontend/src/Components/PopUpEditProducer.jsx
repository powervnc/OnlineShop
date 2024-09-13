import Popup from "reactjs-popup";
import FormElementEditProducer from "../Forms/FormElementEditProducer";

import PropTypes from 'prop-types';

function PopUpEditProducer({producer}){

return (
  <Popup trigger={<button className="button-55"> Edit </button>} modal nested>
    {(close) => (
      <div className="modal">
        <div className="pop-up-content">
          <h1>Edit {producer.nameProducer}! </h1>
          <p>
            Name:{producer.nameProducer}
            <br></br>
          </p>

          <FormElementEditProducer
            producer={producer}
          ></FormElementEditProducer>
        </div>
        <div className="flex flex-row-reverse mx-5 my-3">
          <button onClick={() => close()}>Close</button>
        </div>
      </div>
    )}
  </Popup>
);

}
PopUpEditProducer.propTypes = {
  producer: PropTypes.shape({
    nameProducer: PropTypes.string.isRequired, // Assuming nameProducer is a required string
    // Add more PropTypes as per the structure of producer object
  }).isRequired,
};

export default PopUpEditProducer