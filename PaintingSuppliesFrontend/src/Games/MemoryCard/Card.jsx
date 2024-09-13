import "./Card.css";
import "../../../public/img/cover.png"

function Card({ card, handleChoice, flipped, disabled }) {
  const handleClick = () => {
    if (!disabled) handleChoice(card);
  };
  return (
    <div src={card.src} className="card">
      <div className={flipped ? "flipped" : "sal"}>
        <img className="front" src={card.src} alt="card front"></img>
        <img
          className="back"
          // src="https://wallpaperaccess.com/full/1371991.jpg"
          src="../../../public/img/cover.png"
          onClick={handleClick}
          alt="card back"
        ></img>
      </div>
    </div>
  );
}
export default Card;
