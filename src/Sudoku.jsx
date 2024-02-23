import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { nanoid } from "nanoid";
import { findErrors, isBoardCorrect } from "./game_logic";

function Sudoku({ newGameRequested, setNewGameRequested }) {
  const savedGrid = JSON.parse(localStorage.getItem("sudoku"));
  const savedSolution = JSON.parse(localStorage.getItem("sudoku-solution"));

  // Initialize grid to saved state with empty grid as fallback
  const [gridData, setGridData] = useState(
    savedGrid ||
    Array(9)
      .fill()
      .map(() => ({
        id: nanoid(),
        row: Array(9)
          .fill()
          .map(() => ({ id: nanoid(), val: " ", selected: false })),
      }))
  );
  const [solution, setSolution] = useState(savedSolution);
  const [selectedCell, setSelectedCell] = useState({
    id: null,
    row: null,
    col: null,
    val: 0,
  });

async function fetchNewBoard() {
  const res = await fetch(
    "https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value,solution}}}"
  );
  let data = await res.json();
  data = data.newboard.grids[0];

  setGridData((gridData) =>
    gridData.map(({ id, row }, i) => ({
      id,
      row: row
        .map((cell, j) => ({
          ...cell,
          val: data.value[i][j],
        }))
        .map((cell) =>
          cell.val === 0
            ? { ...cell, val: " ", permanent: false }
            : { ...cell, val: `${cell.val}`, permanent: true }
        ),
    }))
  );
  const solution = data.solution.map((row) => row.map((val) => val.toString()))
  setSolution(solution);
  localStorage.setItem("sudoku-solution", JSON.stringify(solution));
}

  useEffect(() => {
    if (solution) {
    const errors = checkForErrors(gridData.map(({ row }) => row.map(({ val }) => val)), solution);
      // Do something with the errors, e.g., highlight them on the UI
      console.log("Errors:", errors);
    }
  }, [gridData, solution]);

  useEffect(() => {
    if (isBoardCorrect(gridData.map(({ row }) => row.map(({ val }) => val)))) {
      console.log("You won!");
    }
  }, [gridData]);

  // Save grid locally on every change
  useEffect(() => {
    localStorage.setItem("sudoku", JSON.stringify(gridData));
  }, [gridData]);

  function selectCell(id, row, col, val) {
    setSelectedCell({ id, row, col, val });
  }

  // Fetch a board after page load
  useEffect(() => {
    if (savedGrid === null) {
      fetchNewBoard();
    }
  }, [savedGrid]);

  // Fetch new board when new game is requested
  useEffect(() => {
    if (newGameRequested) {
      fetchNewBoard();
    }
    setNewGameRequested(false);
  }, [newGameRequested, setNewGameRequested]);

  // Register event listener for keystrokes
  useEffect(() => {
    const listener = (e) => {
      const isDelete =
        e.key === "Backspace" || e.key === "Delete" || e.key === "0";
      const isNumber = /^[1-9]$/i.test(e.key);
      if ((!isDelete && !isNumber) || selectedCell.id === null) {
        return;
      }
      const val = isDelete ? " " : e.key;
      setGridData((gridData) =>
        gridData.map(({ row, ...rowData }, rowIdx) => ({
          ...rowData,
          row: row.map((cell, colIdx) =>
            selectedCell.row === rowIdx &&
              selectedCell.col === colIdx &&
              !cell.permanent
              ? { ...cell, val }
              : cell
          ),
        }))
      );
      setSelectedCell((selectedCell) => ({ ...selectedCell, val }));
    };
    document.addEventListener("keyup", listener);
    return () => document.removeEventListener("keyup", listener);
  }, [selectedCell]);

  // Convert board data into table data elements
  const gridElements = gridData.map(({ id, row }, rowIdx) => (
    <tr key={id}>
      {row.map(({ id, val, permanent }, colIdx) => {
        const classes = [
          selectedCell.row === rowIdx && selectedCell.col === colIdx
            ? "selected-cell"
            : selectedCell.row === rowIdx || selectedCell.col === colIdx
              ? "selected-row-col"
              : "",
          selectedCell.val === val && val !== " " ? "selected-number" : "",
          permanent ? "permanent" : "",
        ].join(" ");
        return (
          <td
            key={id}
            className={classes}
            onClick={() => selectCell(id, rowIdx, colIdx, val)}
          >
            {val}
          </td>
        );
      })}
    </tr>
  ));

  return (
    <>
      <main className="sudoku">
        <table>
          <colgroup>
            <col />
            <col />
            <col />
          </colgroup>
          <colgroup>
            <col />
            <col />
            <col />
          </colgroup>
          <colgroup>
            <col />
            <col />
            <col />
          </colgroup>
          <tbody>{gridElements.slice(0, 3)}</tbody>
          <tbody>{gridElements.slice(3, 6)}</tbody>
          <tbody>{gridElements.slice(6, 9)}</tbody>
        </table>
      </main>
    </>
  );
}

Sudoku.propTypes = {
  newGameRequested: PropTypes.bool,
  setNewGameRequested: PropTypes.func,
};

export default Sudoku;
