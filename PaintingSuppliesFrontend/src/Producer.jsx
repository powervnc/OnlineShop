

import PropTypes from 'prop-types';
function MyComponent({producer}){
    return(
        <>
        <h1>Name: {producer.nameProducer}</h1>
        <div >
            <img className="component-image" src="https://cdn3.iconfinder.com/data/icons/hand-drawn-mix-iii/200/painting-1024.png" alt=""></img>
            <h1>Name: {producer.nameProducer}</h1>
        </div>
       
        </>
    )
}


MyComponent.propTypes = {
    producer: PropTypes.shape({
      nameProducer: PropTypes.string.isRequired,
      // Add more PropTypes as per the structure of producer object
    }).isRequired,
  };
  
export default MyComponent