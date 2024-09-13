import PropTypes from 'prop-types';
const KEYS = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ]
function Keyboard({disabled=false,activeLetters, inactiveLetters, addGuessedLetter}){
   return(
    <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(75px, 1fr))" ,
        gap:".5rem"
    }}>
       {KEYS.map(key=>{
        const isActive=activeLetters.includes(key);
        const isInactive=inactiveLetters.includes(key);
        return (
            <button
            // replace ths style
                style={{
                    backgroundColor: isActive ? "lightgreen" : isInactive ? "lightgrey" : "purple",
                    color: isInactive ? "grey" : "black"
                }}
                onClick={() => !isInactive && addGuessedLetter(key)}
                key={key}
                disabled={isInactive || isActive}
            >
                {key}
            </button>
        )
    })}
    </div>
   )
}

Keyboard.propTypes = {
    disabled:PropTypes.bool.isRequired,
    activeLetters:PropTypes.arrayOf(PropTypes.string).isRequired,
    inactiveLetters:PropTypes.arrayOf(PropTypes.string).isRequired,
    addGuessedLetter:PropTypes.func.isRequired
        
    
};
  
export default Keyboard