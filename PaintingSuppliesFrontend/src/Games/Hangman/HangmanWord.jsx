
import PropTypes from 'prop-types';
function HangmanWord({reveal,word,guessedLetters}) {
  return (
    <div
      style={{
        display: "flex",
        gap: ".25em",
        fontSize: "6rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        fontFamily: "monospace",
      }}
    >
      {word.split("").map((letter, index) => {
        return(
        <span key={index} style={{ borderBottom: ".1em solid purple" }}>
         
          <span style={{
            visibility:guessedLetters.includes(letter) || reveal?"visible":"hidden",
            color:!guessedLetters.includes(letter) && reveal?"red":"black"
            
          }}>
            
            {letter}
          </span>

        </span>)
      })}
    </div>
  );
}
HangmanWord.propTypes = {
    word: PropTypes.string.isRequired,
    guessedLetters: PropTypes.arrayOf(PropTypes.string).isRequired,
    reveal:PropTypes.bool.isRequired
};
  
export default HangmanWord;
