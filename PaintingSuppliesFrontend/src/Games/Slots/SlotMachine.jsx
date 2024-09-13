import  { useState } from "react";
import Slot from "./Slot";
import "./SlotMachine.css"
import { useUserContext } from "../../Contexts/ContextUser";
import { useAddPoints } from "../../CustomHooks/UserHooks/useAddPoints";
const getRandomSlots = (amount) => {
  
  const symbols = ["🍒", "🍊", "🍋", "🍇", "🍉"];
  const newSlots = [];
  for (let i = 0; i < amount; i++) {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    newSlots.push(symbols[randomIndex]);
  }
  return newSlots;
};
function SlotMachine({ amountOfSlots }) {
  const [slots, setSlots] = useState(getRandomSlots(amountOfSlots));
  const {points}= useUserContext();
  const [lastResult,setLastResult]=useState(0);
  const addPoints=useAddPoints();
  const isWinning = () => {
    return slots.every((slot) => slot === slots[0]);
  };

  const pullLever = () => {
    const newSlots = getRandomSlots(amountOfSlots);
    setSlots(newSlots);
    if (isWinning()) {
      fetchAndUpdateWinnings(4000);
    } else {
      fetchAndUpdateWinnings(-10);
    }
  };

  const fetchAndUpdateWinnings = (amount) => {
    // Simulating a fetch call to update winnings
    // Replace with actual fetch call as needed
    // Here, using setTimeout to simulate async behavior
    addPoints(amount);
    setLastResult(amount);
  };

  

  return (
    
    <div className="slotMachineContainer">
      <div>
      Rules
    </div>
      <h1>!!!Grand Prize 4000 points!!!</h1>
      <h2>10 points per failure</h2>
      <div className="slotMachineSubContainer">
        <button onClick={pullLever}>Pull Lever</button>
        {slots.map((slot, index) => (
          <Slot value={slot} key={index} />
        ))}
      </div>
      <p>Winnings:${lastResult} </p>
      <p>Points: ${points}</p>
    </div>
  );
}

export default SlotMachine;
