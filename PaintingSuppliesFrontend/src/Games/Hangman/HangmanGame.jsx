import { useCallback, useContext, useEffect, useState } from "react";
import HangmanDrawing from "./HangmanDrawing";
import HangmanWord from "./HangmanWord";
import Keyboard from "./Keyboard";
import { useAddPoints } from "../../CustomHooks/UserHooks/useAddPoints";
import { useUserContext } from "../../Contexts/ContextUser";
useUserContext
const words = [
  "painting",
  "artist",
  "modernism",
  "sculpture",
  "canvas",
  "easel",
  "palette",
  "brush",
  "gallery",
  "museum",
  "abstract",
  "portrait",
  "landscape",
  "sketch",
  "draw",
  "charcoal",
  "pastel",
  "oilpaint",
  "watercolor",
  "acrylic",
  "fresco",
  "mural",
  "impressionism",
  "expressionism",
  "cubism",
  "surrealism",
  "dadaism",
  "minimalism",
  "baroque",
  "renaissance",
  "gothic",
  "classical",
  "neoclassical",
  "romanticism",
  "realism",
  "photography",
  "digital",
  "collage",
  "printmaking",
  "etching",
  "lithography",
  "woodcut",
  "engraving",
  "ceramics",
  "pottery",
  "craft",
  "weaving",
  "textile",
  "embroidery",
  "calligraphy",
  "graffiti",
  "streetart",
  "performance",
  "installation",
  "conceptual",
  "videoart",
  "multimedia",
  "design",
  "architecture",
  "fashion",
  "jewelry",
  "mosaic",
  "stainedglass",
  "tapestry",
  "folkart",
  "popart",
  "fauvism",
  "artdeco",
  "artnouveau",
  "symbolism",
  "romanesque",
  "byzantine",
  "medieval",
  "mannerism",
  "prehistory",
  "cavepainting",
  "hieroglyph",
  "tempera",
  "gouache",
  "encaustic",
  "marble",
  "bronze",
  "clay",
  "stone",
  "metalwork",
  "woodwork",
  "origami",
  "animation",
  "illustration",
  "print",
  "engraving",
  "ink",
  "chalk",
  "pencil",
  "crayon",
  "marker",
  "spraypaint",
  "airbrush",
  "calligraphy",
  "stencil",
];

function getWord() {
  const wordToGuess = words[Math.floor(Math.random() * words.length)];
  return wordToGuess;
}

function HangmanGame() {
  const {points,setPoints}= useUserContext();
  const addPoints=useAddPoints();
  const [wordToGuess, setWordToGuess] = useState(getWord);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );
  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const addGuessedLetter = useCallback(
    (letter) => {
      
      if (guessedLetters.includes(letter) || isWinner || isLoser) return;
      else {
        setGuessedLetters((currentLetters) => [...currentLetters, letter]);
      }
    },
    [guessedLetters, isWinner, isLoser]
  );

  useEffect(() => {
    const handler = (e) => {
      const key = e.key;
      if (!key.match(/^[a-z]/)) return;
      e.preventDefault();
      addGuessedLetter(key);
    };
    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters]);



  useEffect(()=>{
    if(isWinner){addPoints(10)
      setPoints(points+10);
    }
    else if(isLoser) {addPoints(-5)
      if(5>points)setPoints(0);
      else setPoints(points-10);

    }

  },[isWinner,isLoser])
  useEffect(() => {
    const handler = (e) => {
      const key = e.key;
      if (key !== "Enter") return;
      
      
      
      e.preventDefault();
      setGuessedLetters([]);
      setWordToGuess(getWord());
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [isWinner, isLoser]);
  return (
    <div
      id="game"
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isWinner && "Winner! - Refresh to try again"}
        {isLoser && "Nice Try - Refresh to try again"}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        word={wordToGuess}
        guessedLetters={guessedLetters}
      />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter((letter) =>
            wordToGuess.includes(letter)
          )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default HangmanGame;
