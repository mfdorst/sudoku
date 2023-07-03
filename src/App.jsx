import { useState } from "react";
import Sudoku from "./Sudoku";

function App() {
  const [newGameRequested, setNewGameRequested] = useState(false);

  return (
    <>
      <h1 className="heading">Sudoku</h1>
      <Sudoku
        newGameRequested={newGameRequested}
        setNewGameRequested={setNewGameRequested}
      />
      <button className="button" onClick={() => setNewGameRequested(true)}>
        New Game
      </button>
    </>
  );
}

export default App;
