import { useEffect, useState } from "react";
import "./MemoryGame.css";
import Card from "./Card.jsx";
import { useUserContext } from "../../Contexts/ContextUser.jsx";
import { useAddPoints } from "../../CustomHooks/UserHooks/useAddPoints.js";

const cardImages = [
  // { src: "../../../public/img/cover.png", matched: false },
  { src: "../../../public/img/potion-1.png", matched: false },
  { src: "../../../public/img/ring-1.png", matched: false },
  { src: "../../../public/img/scroll-1.png", matched: false },
  { src: "../../../public/img/shield-1.png", matched: false },
  { src: "../../../public/img/sword-1.png", matched: false },
  { src: "../../../public/img/helmet-1.png", matched: false },
];

function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  //6 pairs of cards
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const addPoints=useAddPoints();
  const {setPoints} =useUserContext();
  const shuffleCards = () => {
    const shuffledCards = shuffleArray([...cardImages, ...cardImages])
      .sort(() => {
        return Math.random() - 0.5;
      })
      .map((card) => {
        return {
          ...card,
          id: Math.random(),
        };
      });
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
  };

  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };
  //comparing 2 cards
  useEffect(()=>{
        let inProgress=false;
        if(cards!=[])
          for (let index = 0; index < cards.length; index++) {
            if(!cards.match)inProgress=false
            
          }
        if(!inProgress){
          console.log("Game ended");
          const pointsValue= 60-4*turns
          addPoints(pointsValue);
          if(pointsValue<0)setPoints(0);
          else setPoints(pointsValue);
        }

    
  },[turns])
  useEffect(() => {
    if (choiceOne && choiceTwo && choiceOne.id != choiceTwo.id) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        console.log("yes");
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, match: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
    shuffleCards();
  }, []);
  return (
    <div style={{width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',backgroundColor:"#250148"}}>
    <div className="Game">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card == choiceOne || card == choiceTwo || card.match}
            disable={disabled}
          />
        ))}
      </div>
      <p>Turns:{turns}</p>
    </div>
   </div>
  );
}
export default MemoryGame;
